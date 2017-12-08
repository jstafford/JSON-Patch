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

    // No need to special case Date or RegExp,
    // since these classes will never be found in a JSON object.

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
    return document;
  },
  remove: function(obj, key, document) {
    delete obj[key];
    return document;
  },
  replace: function(obj, key, document) {
    obj[key] = this.value;
    return document;
  },
  move: function(obj, key, document) {
    const originalValue = getValueByPointer(document, this.from);
    document = applyOperation(document, {
        op: "remove",
        path: this.from
      })
    document = applyOperation(document, {
      op: "add",
      path: this.path,
      value: originalValue
    });
    return document;
  },
  copy: function(obj, key, document) {
    const value = getValueByPointer(document, this.from);
    // enforce copy by value so further operations don't affect source (see issue #177)
    // https://jsperf.com/deep-copy-vs-json-stringify-json-parse/25 (recursiveDeepCopy)
    const valueType = typeof value;
    const clonedValue = valueType === "object" ?
      JSON.parse(JSON.stringify(value)) //Faster than ES5 clone - http://jsperf.com/deep-cloning-of-objects/5
      : valueType === "undefined" ?
        null //this is how JSON.stringify behaves for array items
        : value; //no need to clone primitives

    document = applyOperation(document, {
      op: "add",
      path: this.path,
      value: clonedValue
    });
    return document;
  },
  test: function(obj, key, document) {
    if (deepEqual(obj[key], this.value) === false) {
      throw new Error("Test operation failed");
    }
    return document;
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
    return document;
  },
  remove: function(arr, i, document) {
    arr.splice(i, 1);
    return document;
  },
  replace: function(arr, i, document) {
    arr[i] = this.value;
    return document;
  },
  move: objOps.move,
  copy: objOps.copy,
  test: objOps.test,
};

/**
 * Walks an RFC-6901 JSON Pointer into a JSON document to
 * find the final Object and key in the path.
 * Returns the target object and key as {obj, key}.
 */
function pathToTarget(document, path) {
  if (path) {
    const keys = path.split('/');
    const len = keys.length;
    let obj = document;
    let t = 1; //skip empty element - http://jsperf.com/to-shift-or-not-to-shift
    let key;
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
          // un-escape path component
          key = key.replace(/~1/g, '/').replace(/~0/g, '~');
        }
      }
      if (t < len) {
        obj = obj[key];
      }
    }
    return {
      obj: obj,
      key: key
    }
  } else {
    return {
      obj: document,
      key: void 0
    }
  }
}

/**
 * Retrieves a value from a JSON document by a JSON pointer.
 * Returns the value.
 */
function getValueByPointer(document, pointer) {
  if (pointer == '') {
    return document;
  }
  const target = pathToTarget(document, pointer)
  return target.obj[target.key];
}

/**
 * Apply a single JSON Patch Operation on a JSON document.
 * Returns the patched JSON document.
 * It modifies the `document` and `operation` objects - it gets the values by reference.
 */
function applyOperation(document, operation) {
  /* ROOT OPERATIONS */
  if (operation.path === "") {
    if (operation.op === 'add') {
      return operation.value;
    } else if (operation.op === 'replace') {
      return operation.value;
    } else if (operation.op === 'move' || operation.op === 'copy') { // it's a move or copy to root
      return getValueByPointer(document, operation.from);
    } else if (operation.op === 'test') {
      if (deepEqual(document, operation.value) === false) {
        throw new Error("Test operation failed");
      }
      return document;
    } else if (operation.op === 'remove') { // a remove on root
      return null;
    } else { /* bad operation */
      return document;
    }
  } /* END ROOT OPERATIONS */
  else {
    const target = pathToTarget(document, operation.path)
    // Apply patch
    if (Array.isArray(target.obj)) {
      return arrOps[operation.op].call(operation, target.obj, target.key, document);
    } else {
      return objOps[operation.op].call(operation, target.obj, target.key, document);
    }
  }
}

/**
 * Apply a full JSON Patch array on a JSON document.
 * Returns the patched JSON document.
 * It modifies the `document` object and `patch` - it gets the values by reference.
 */
function applyPatch(document, patch) {
  for (let i = 0, length = patch.length; i < length; i++) {
    document = applyOperation(document, patch[i]);
  }
  return document;
}
exports.applyPatch = applyPatch;
