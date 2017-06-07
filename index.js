var cloneDeep = require('clone-deep');

/**
 * @param  {object} obj          The object.
 * @param  {string} path         The property path, array with keys.
 * @param  {*}      value        The new value.
 * @return {object}              The object with set value or undefined.
 */

module.exports = function deepSetIn(obj, path, value, options) {
  validateAttrs.apply(this, arguments);
  return set.apply(this, arguments);
};

function validateAttrs(obj, path, value, options) {
  if (typeof obj !== 'object') {
    throw new Error('First argument must be an object');
  }

  if (!(path instanceof Array)) {
    throw new Error('Second argument must be an array');
  } else if (!path.length) {
    throw new Error('Path must not be empty');
  }

  if (!value) {
    throw new Error('Value must be specified');
  }

  if (options && typeof options !== 'object') {
    throw new Error('Options must be an object');
  }
}

function set(obj, path, value, options) {
  var rootObj = getRootObj(obj, options);
  var targetObj = rootObj;

  for (var i = 0; i < path.length; i++) {

    if (typeof path[i] === 'string') {

      if (!targetObj.hasOwnProperty(path[i])) return;

      if ((i + 1) === path.length) {
        targetObj[path[i]] = value;
        return rootObj;
      } else {
        targetObj = targetObj[path[i]];
      }
    } else if (path[i] instanceof Array) {
      var key = path[i][0];
      var compareKey = path[i][1];
      var compareValue = path[i][2];

      if (!targetObj.hasOwnProperty(key) || !targetObj[key] instanceof Array) return;

      const foundIndex = findIndex(targetObj[key], compareKey, compareValue);

      if (typeof foundIndex !== 'number') return;

      if ((i + 1) === path.length) {
        targetObj[key][foundIndex] = value;
        return rootObj;
      } else {
        targetObj = targetObj[key][foundIndex];
      }
    }
  }
}

function findIndex(array, compareKey, compareValue) {
  for (var i = 0; i < array.length; i++) {
    if (typeof array[i] === 'object'
      && array[i].hasOwnProperty(compareKey)
      && array[i][compareKey] === compareValue
    ) {
      return i;
    }
  }
}

function getRootObj(obj, options) {
  if (options && options.immutable) {
    return cloneDeep(obj);
  } else {
    return obj;
  }
}