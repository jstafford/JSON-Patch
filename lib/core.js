/**
 * deepEqual
 * Copyright (c) 2017 Evgeny Poberezkin
 * MIT License
 * https://github.com/epoberezkin/fast-deep-equal/
 */
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }

  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);
  let i;

  if (aIsArray && bIsArray) {
    if (a.length != b.length) {
      return false;
    }
    for (i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  if (aIsArray != bIsArray) {
    return false;
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) {
      return false;
    }

    const aIsDate = a instanceof Date;
    const bIsDate = b instanceof Date;
    if (aIsDate && bIsDate) {
      return a.getTime() == b.getTime();
    }
    if (aIsDate != bIsDate) {
      return false;
    }

    const aIsRegExp = a instanceof RegExp;
    const bIsRegExp = b instanceof RegExp;
    if (aIsRegExp && bIsRegExp) {
      return a.toString() == b.toString();
    }
    if (aIsRegExp != bIsRegExp) {
      return false;
    }

    const hasOwnProperty = Object.prototype.hasOwnProperty
    for (i = 0; i < keys.length; i++) {
      if (!hasOwnProperty.call(b, keys[i])) {
        return false;
      }
    }

    for (i = 0; i < keys.length; i++) {
      if (!deepEqual(a[keys[i]], b[keys[i]])) {
        return false;
      }
    }
    return true;
  }

  return false;
}

/**
 * Deeply clone the object.
 * https://jsperf.com/deep-copy-vs-json-stringify-json-parse/25 (recursiveDeepCopy)
 */
function deepClone(obj) {
  switch (typeof obj) {
    case "object":
      return JSON.parse(JSON.stringify(obj)); //Faster than ES5 clone - http://jsperf.com/deep-cloning-of-objects/5
    case "undefined":
      return null; //this is how JSON.stringify behaves for array items
    default:
      return obj; //no need to clone primitives
  }
}

/**
 * fast-json-patch
 * Copyright (c) 2017 Joachim Wester
 * MIT License
 * https://github.com/Starcounter-Jack/JSON-Patch
 */

//3x faster than cached /^\d+$/.test(str)
function isInteger(str) {
  let i = 0;
  const len = str.length;
  let charCode;
  while (i < len) {
    charCode = str.charCodeAt(i);
    if (charCode < 48 || charCode > 57) {
      return false;
    }
    i++;
  }
  return true;
}

/**
 * Unescapes a json pointer path
 */
function unescapePathComponent(path) {
  return path.replace(/~1/g, '/').replace(/~0/g, '~');
}

/**
 * We use a Javascript hash to store each
 * function. Each hash entry (property) uses
 * the operation identifiers specified in rfc6902.
 * In this way, we can map each patch operation
 * to its dedicated function in efficient way.
 */

/* The operations applicable to an object */
const objOps = {
  add: function(obj, key, document) {
    obj[key] = this.value;
    return {
      newDocument: document
    };
  },
  remove: function(obj, key, document) {
    const removed = obj[key];
    delete obj[key];
    return {
      newDocument: document,
      removed: removed
    };
  },
  replace: function(obj, key, document) {
    const removed = obj[key];
    obj[key] = this.value;
    return {
      newDocument: document,
      removed: removed
    };
  },
  move: function(obj, key, document) {
    /* in case move target overwrites an existing value,
    return the removed value, this can be taxing performance-wise,
    and is potentially unneeded */
    let removed = getValueByPointer(document, this.path);

    if (removed) {
      removed = deepClone(removed);
    }

    const originalValue = applyOperation(document, {
        op: "remove",
        path: this.from
      })
      .removed;

    applyOperation(document, {
      op: "add",
      path: this.path,
      value: originalValue
    });

    return {
      newDocument: document,
      removed: removed
    };
  },
  copy: function(obj, key, document) {
    const valueToCopy = getValueByPointer(document, this.from);
    // enforce copy by value so further operations don't affect source (see issue #177)
    applyOperation(document, {
      op: "add",
      path: this.path,
      value: deepClone(valueToCopy)
    });
    return {
      newDocument: document
    };
  },
  test: function(obj, key, document) {
    return {
      newDocument: document,
      test: deepEqual(obj[key], this.value)
    };
  },
  _get: function(obj, key, document) {
    this.value = obj[key];
    return {
      newDocument: document
    };
  }
};

/* The operations applicable to an array. Many are the same as for the object */
const arrOps = {
  add: function(arr, i, document) {
    if (isInteger(i)) {
      arr.splice(i, 0, this.value);
    } else { // array props
      arr[i] = this.value;
    }
    // this may be needed when using '-' in an array
    return {
      newDocument: document,
      index: i
    };
  },
  remove: function(arr, i, document) {
    const removedList = arr.splice(i, 1);
    return {
      newDocument: document,
      removed: removedList[0]
    };
  },
  replace: function(arr, i, document) {
    const removed = arr[i];
    arr[i] = this.value;
    return {
      newDocument: document,
      removed: removed
    };
  },
  move: objOps.move,
  copy: objOps.copy,
  test: objOps.test,
  _get: objOps._get
};

/**
 * Retrieves a value from a JSON document by a JSON pointer.
 * Returns the value.
 */
function getValueByPointer(document, pointer) {
  if (pointer == '') {
    return document;
  }
  const getOriginalDestination = {
    op: "_get",
    path: pointer
  };
  applyOperation(document, getOriginalDestination);
  return getOriginalDestination.value;
}
exports.getValueByPointer = getValueByPointer;

/**
 * Apply a single JSON Patch Operation on a JSON document.
 * Returns the {newDocument, result} of the operation.
 * It modifies the `document` and `operation` objects - it gets the values by reference.
 * If you would like to avoid touching your values, clone them:
 * `jsonpatch.applyOperation(document, jsonpatch.deepClone(operation))`.
 */
function applyOperation(document, operation) {
  /* ROOT OPERATIONS */
  if (operation.path === "") {
    const returnValue = {
      newDocument: document
    };
    if (operation.op === 'add') {
      returnValue.newDocument = operation.value;
      return returnValue;
    } else if (operation.op === 'replace') {
      returnValue.newDocument = operation.value;
      returnValue.removed = document; //document we removed
      return returnValue;
    } else if (operation.op === 'move' || operation.op === 'copy') { // it's a move or copy to root
      returnValue.newDocument = getValueByPointer(document, operation.from); // get the value by json-pointer in `from` field
      if (operation.op === 'move') { // report removed item
        returnValue.removed = document;
      }
      return returnValue;
    } else if (operation.op === 'test') {
      returnValue.test = deepEqual(document, operation.value);
      if (returnValue.test === false) {
        throw new Error("Test operation failed");
      }
      returnValue.newDocument = document;
      return returnValue;
    } else if (operation.op === 'remove') { // a remove on root
      returnValue.removed = document;
      returnValue.newDocument = null;
      return returnValue;
    } else if (operation.op === '_get') {
      operation.value = document;
      return returnValue;
    } else { /* bad operation */
      return returnValue;
    }
  } /* END ROOT OPERATIONS */
  else {
    const path = operation.path || "";
    const keys = path.split('/');
    let obj = document;
    let t = 1; //skip empty element - http://jsperf.com/to-shift-or-not-to-shift
    const len = keys.length;
    let key;
    let returnValue;
    // walk path
    while (t < len) {
      key = keys[t];

      t++;
      if (Array.isArray(obj)) {
        if (key === '-') {
          key = obj.length;
        } else {
          // only parse key when it's an integer for `arr.prop` to work
          if (isInteger(key)) {
            key = ~~key;
          }
        }
      } else {
        if (key && key.indexOf('~') != -1) {
          key = unescapePathComponent(key);
        }
      }
      if (t < len) {
        obj = obj[key];
      }
    }
    // Apply patch
    if (Array.isArray(obj)) {
      returnValue = arrOps[operation.op].call(operation, obj, key,
        document);
    } else {
      returnValue = objOps[operation.op].call(operation, obj, key,
        document);
    }

    if (returnValue.test === false) {
      throw new Error("Test operation failed");
    }
    return returnValue;
  }
}
exports.applyOperation = applyOperation;

/**
 * Apply a full JSON Patch array on a JSON document.
 * Returns the {newDocument, result} of the patch.
 * It modifies the `document` object and `patch` - it gets the values by reference.
 * If you would like to avoid touching your values, clone them:
 * `jsonpatch.applyPatch(document, jsonpatch.deepClone(patch))`.
 */
function applyPatch(document, patch) {
  const results = new Array(patch.length);

  for (let i = 0, length = patch.length; i < length; i++) {
    results[i] = applyOperation(document, patch[i]);
    document = results[i].newDocument; // in case root was replaced
  }
  results.newDocument = document;
  return results;
}
exports.applyPatch = applyPatch;
