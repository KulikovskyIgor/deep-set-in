const cloneDeep = require('clone-deep');
const kindOf = require('kind-of');

/**
 * @param  {object} obj                     The object.
 * @param  {string} path                    The property path, array with keys.
 * @param  {*}      value                   The new value.
 * @param  {object} options                 The options object.
 * @param  {boolean} options.immutable      Specify modify original object or return modified one.
 * @param  {boolean} options.create         Specify creating of new an object or array if it is not exist.
 * @return {object}                         The object with _set value or undefined.
 */

module.exports = function deepSetIn(obj, path, value, options) {
  _validateAttrs.call(this, obj, path, value, options);
  return _set.call(this, obj, path, value, options);
};

function _validateAttrs(obj, path, value, options) {
  if (kindOf(obj) !== 'object') {
    throw new Error('First argument must be an object');
  }

  if (kindOf(path) !== 'array') {
    throw new Error('Second argument must be an array');
  } else if (!path.length) {
    throw new Error('Path must not be empty');
  }

  if (!value) {
    throw new Error('Value must be specified');
  }

  if (kindOf(options) !== 'undefined' && kindOf(options) !== 'object') {
    throw new Error('Options must be an object');
  }
}

function _set(obj, path, value, options) {
  let rootObj = _getRootObj(obj, options);
  let targetObj = rootObj;

  for (let i = 0; i < path.length; i++) {

    _manageCreateEntity(targetObj, path[i], options);

    if (kindOf(path[i]) === 'string') {

      if (!targetObj.hasOwnProperty(path[i])) return;

      if ((i + 1) === path.length) {
        targetObj[path[i]] = value;
        return rootObj;
      } else {
        targetObj = targetObj[path[i]];
      }
    } else if (kindOf(path[i]) === 'array') {
      const key = path[i][0];
      const compareKey = path[i][1];
      const compareValue = path[i][2];
      const compareFunc = path[i][3];

      if (!targetObj.hasOwnProperty(key) || kindOf(targetObj[key]) !== 'array') return;

      const foundIndex = _findIndex(targetObj[key], compareKey, compareValue, compareFunc);

      if (kindOf(foundIndex) !== 'number') return;

      if ((i + 1) === path.length) {
        targetObj[key][foundIndex] = value;
        return rootObj;
      } else {
        targetObj = targetObj[key][foundIndex];
      }
    }
  }
}

function _findIndex(array, compareKey, compareValue, compareFunc) {

  if (kindOf(compareFunc) !== 'undefined' && kindOf(compareFunc) !== 'function') {
    throw new Error('Comparator mast be a function');
  }

  for (let i = 0; i < array.length; i++) {
    if (kindOf(array[i]) === 'object'
      && array[i].hasOwnProperty(compareKey)
    ) {
      const value = array[i][compareKey];
      const isEqual = compareFunc ? compareFunc(compareValue, value) : _isEqual(compareValue, value);

      if (isEqual) {
        return i;
      }
    }
  }
}

function _isEqual(a, b) {
  return a === b;
}

function _getRootObj(obj, options) {
  if (options && options.immutable) {
    return cloneDeep(obj);
  } else {
    return obj;
  }
}

function _manageCreateEntity(obj, key, options) {
  if (options && options.create) {

    if (kindOf(key) === 'string') {

      if (!obj.hasOwnProperty(key)) {
        obj[key] = {};
      }
    } else if (kindOf(key) === 'array') {
      const targetKey = key[0];
      const compareKey = key[1];
      const compareValue = key[2];

      if (!obj.hasOwnProperty(targetKey) || kindOf(obj[targetKey]) !== 'array') {
        obj[targetKey] = [];
      }

      const foundIndex = _findIndex(obj[targetKey], compareKey, compareValue);

      if (kindOf(foundIndex) !== 'number') {
        obj[targetKey].push({[compareKey]: compareValue});
      }
    }
  } else {
    return obj;
  }
}