/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017 Joachim Wester
 * MIT license
 */
declare var require: any;

const equalsOptions = { strict: true };
const _equals = require('deep-equal');
const areEquals = (a: any, b: any): boolean => {
  return _equals(a, b, equalsOptions)
}
import { PatchError, _deepClone, isInteger, unescapePathComponent, hasUndefined } from './helpers';

export const JsonPatchError = PatchError;
export const deepClone = _deepClone;

interface HTMLElement {
  attachEvent: Function;
  detachEvent: Function;
}

export type Operation = AddOperation<any> | RemoveOperation | ReplaceOperation<any> | MoveOperation | CopyOperation | TestOperation<any> | GetOperation<any>;

export interface Validator<T> {
  (operation: Operation, index: number, document: T, existingPathFragment: string): void;
}

export interface OperationResult<T> {
  removed?: any,
  test?: boolean,
  newDocument: T;
}

export interface BaseOperation {
  path: string;
}

export interface AddOperation<T> extends BaseOperation {
  op: 'add';
  value: T;
}

export interface RemoveOperation extends BaseOperation {
  op: 'remove';
}

export interface ReplaceOperation<T> extends BaseOperation {
  op: 'replace';
  value: T;
}

export interface MoveOperation extends BaseOperation {
  op: 'move';
  from: string;
}

export interface CopyOperation extends BaseOperation {
  op: 'copy';
  from: string;
}

export interface TestOperation<T> extends BaseOperation {
  op: 'test';
  value: T;
}

export interface GetOperation<T> extends BaseOperation {
  op: '_get';
  value: T;
}
export interface PatchResult<T> extends Array<OperationResult<T>> {
  newDocument: T;
}

export interface Observer<T> {
  object: T;
  patches: Operation[];
  unobserve: () => void;
  callback: (patches: Operation[]) => void;
}

/* We use a Javascript hash to store each
 function. Each hash entry (property) uses
 the operation identifiers specified in rfc6902.
 In this way, we can map each patch operation
 to its dedicated function in efficient way.
 */

/* The operations applicable to an object */
const objOps = {
  add: function (obj, key, document) {
    obj[key] = this.value;
    return { newDocument: document };
  },
  remove: function (obj, key, document) {
    var removed = obj[key];
    delete obj[key];
    return { newDocument: document, removed }
  },
  replace: function (obj, key, document) {
    var removed = obj[key];
    obj[key] = this.value;
    return { newDocument: document, removed };
  },
  move: function (obj, key, document) {
    /* in case move target overwrites an existing value,
    return the removed value, this can be taxing performance-wise,
    and is potentially unneeded */
    let removed = getValueByPointer(document, this.path);

    if (removed) {
      removed = _deepClone(removed);
    }

    const originalValue = applyOperation(document,
      { op: "remove", path: this.from }
    ).removed;

    applyOperation(document,
      { op: "add", path: this.path, value: originalValue }
    );

    return { newDocument: document, removed };
  },
  copy: function (obj, key, document) {
    const valueToCopy = getValueByPointer(document, this.from);
    // enforce copy by value so further operations don't affect source (see issue #177)
    applyOperation(document,
      { op: "add", path: this.path, value: _deepClone(valueToCopy) }
    );
    return { newDocument: document }
  },
  test: function (obj, key, document) {
    return { newDocument: document, test: areEquals(obj[key], this.value) }
  },
  _get: function (obj, key, document) {
    this.value = obj[key];
    return { newDocument: document }
  }
};

/* The operations applicable to an array. Many are the same as for the object */
var arrOps = {
  add: function (arr, i, document) {
    if(isInteger(i)) {
      arr.splice(i, 0, this.value);
    } else { // array props
      arr[i] = this.value;
    }
    // this may be needed when using '-' in an array
    return { newDocument: document, index: i }
  },
  remove: function (arr, i, document) {
    var removedList = arr.splice(i, 1);
    return { newDocument: document, removed: removedList[0] };
  },
  replace: function (arr, i, document) {
    var removed = arr[i];
    arr[i] = this.value;
    return { newDocument: document, removed };
  },
  move: objOps.move,
  copy: objOps.copy,
  test: objOps.test,
  _get: objOps._get
};

/**
 * Retrieves a value from a JSON document by a JSON pointer.
 * Returns the value.
 *
 * @param document The document to get the value from
 * @param pointer an escaped JSON pointer
 * @return The retrieved value
 */
export function getValueByPointer(document: any, pointer: string): any {
  if (pointer == '') {
    return document;
  }
  var getOriginalDestination = <GetOperation<any>>{ op: "_get", path: pointer };
  applyOperation(document, getOriginalDestination);
  return getOriginalDestination.value;
}
/**
 * Apply a single JSON Patch Operation on a JSON document.
 * Returns the {newDocument, result} of the operation.
 * It modifies the `document` and `operation` objects - it gets the values by reference.
 * If you would like to avoid touching your values, clone them:
 * `jsonpatch.applyOperation(document, jsonpatch._deepClone(operation))`.
 *
 * @param document The document to patch
 * @param operation The operation to apply
 * @return `{newDocument, result}` after the operation
 */
export function applyOperation<T>(document: T, operation: Operation): OperationResult<T> {
  /* ROOT OPERATIONS */
  if (operation.path === "") {
    let returnValue: OperationResult<T> = { newDocument: document };
    if (operation.op === 'add') {
      returnValue.newDocument = operation.value;
      return returnValue;
    } else if (operation.op === 'replace') {
      returnValue.newDocument = operation.value;
      returnValue.removed = document; //document we removed
      return returnValue;
    }
    else if (operation.op === 'move' || operation.op === 'copy') { // it's a move or copy to root
      returnValue.newDocument = getValueByPointer(document, operation.from); // get the value by json-pointer in `from` field
      if (operation.op === 'move') { // report removed item
        returnValue.removed = document;
      }
      return returnValue;
    } else if (operation.op === 'test') {
      returnValue.test = areEquals(document, operation.value);
      if (returnValue.test === false) {
        throw new JsonPatchError("Test operation failed", 'TEST_OPERATION_FAILED', 0, operation, document);
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
    let len = keys.length;
    let existingPathFragment = undefined;
    let key: string | number;
    while (true) {
      key = keys[t];

      t++;
      if (Array.isArray(obj)) {
        if (key === '-') {
          key = obj.length;
        }
        else {
          // only parse key when it's an integer for `arr.prop` to work
          if(isInteger(key)) {
            key = ~~key;
          }
        }
        if (t >= len) {
          const returnValue = arrOps[operation.op].call(operation, obj, key, document); // Apply patch
          if (returnValue.test === false) {
            throw new JsonPatchError("Test operation failed", 'TEST_OPERATION_FAILED', 0, operation, document);
          }
          return returnValue;
        }
      }
      else {
        if (key && key.indexOf('~') != -1) {
          key = unescapePathComponent(key);
        }
        if (t >= len) {
          const returnValue = objOps[operation.op].call(operation, obj, key, document); // Apply patch
          if (returnValue.test === false) {
            throw new JsonPatchError("Test operation failed", 'TEST_OPERATION_FAILED', 0, operation, document);
          }
          return returnValue;
        }
      }
      obj = obj[key];
    }
  }
}

/**
 * Apply a full JSON Patch array on a JSON document.
 * Returns the {newDocument, result} of the patch.
 * It modifies the `document` object and `patch` - it gets the values by reference.
 * If you would like to avoid touching your values, clone them:
 * `jsonpatch.applyPatch(document, jsonpatch._deepClone(patch))`.
 *
 * @param document The document to patch
 * @param patch The patch to apply
 * @return An array of `{newDocument, result}` after the patch
 */
export function applyPatch<T>(document: T, patch: Operation[]): PatchResult<T> {
  const results = new Array(patch.length) as PatchResult<T>;

  for (let i = 0, length = patch.length; i < length; i++) {
    results[i] = applyOperation(document, patch[i]);
    document = results[i].newDocument; // in case root was replaced
  }
  results.newDocument = document;
  return results;
}

/**
 * Apply a single JSON Patch Operation on a JSON document.
 * Returns the updated document.
 * Suitable as a reducer.
 *
 * @param document The document to patch
 * @param operation The operation to apply
 * @return The updated document
 */
export function applyReducer<T>(document: T, operation: Operation): T {
  const operationResult: OperationResult<T> = applyOperation(document, operation)
  if (operationResult.test === false) { // failed test
    throw new JsonPatchError("Test operation failed", 'TEST_OPERATION_FAILED', 0, operation, document);
  }
  return operationResult.newDocument;
}
