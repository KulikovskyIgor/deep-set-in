/**
 * @param  {object} obj          The object.
 * @param  {string} path         The property path, array with keys.
 * @param  {*}      value        The new value.
 * @return {object}              The new object with set value or undefined.
 */

module.exports = function deepSetIn(obj, path, value) {
  validateAttrs.apply(this, arguments);
  return set.apply(this, arguments);
};

function validateAttrs(obj, path, value) {
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

function set(obj, path, value) {
  var rootObj = obj;
  var modifiedObj = rootObj;

  for (var i = 0; i < path.length; i++) {

    if (typeof path[i] === 'string') {

      if (!modifiedObj.hasOwnProperty(path[i])) return;

      if ((i + 1) === path.length) {
        modifiedObj[path[i]] = value;
        return rootObj;
      } else {
        modifiedObj = modifiedObj[path[i]];
      }
    } else if (path[i] instanceof Array) {
      var key = path[i][0];
      var compareKey = path[i][1];
      var compareValue = path[i][2];

      if (!modifiedObj.hasOwnProperty(key) || !modifiedObj[key] instanceof Array) return;

      const foundIndex = findIndex(modifiedObj[key], compareKey, compareValue);

      if (typeof foundIndex !== 'number') return;

      if ((i + 1) === path.length) {
        modifiedObj[key][foundIndex] = value;
        return rootObj;
      } else {
        modifiedObj = modifiedObj[key][foundIndex];
      }
    }
  }
}