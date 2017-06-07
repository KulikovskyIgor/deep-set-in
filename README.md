# deep-set-in

Sets the value at path of object and array tree

## Installation

    npm install deep-set-in

## Usage

#### Set property in an object

```js
var deepSetIn = require('deep-set-in')

var obj = { one: { two: { three: 'test' } } }

deepSetIn(obj, ['one', 'two', 'three'], 'works')
// { one: { two: { three: 'works' } } }
```

#### Set property in an array

```js
var deepSetIn = require('deep-set-in')

var obj = { one: { two: [{ id: 'test id', val: 'test val' }] } }

deepSetIn(obj, ['one', ['two', 'id', 'test id'], 'val'], 'works')
// { one: { two: [{ id: 'test id', val: 'works' }] } }
```

#### Set property in an array with custom comparator

```js
var deepSetIn = require('deep-set-in')

var obj = { one: { two: [{ id: 1, val: 'test val' }] } }

var comparator = function(a, b) {
  return a > b;
};

deepSetIn(obj, ['one', ['two', 'id', 999], 'val'], 'works')
// { one: { two: [{ id: 1, val: 'works' }] } }
```

### Arguments

`deepSetIn(obj, path, value)`

- `obj - Object`: The original object.
- `path - Array`: The property path, array with keys.
- `value - *`: The new object with set value or undefined.
- `options - Object`: The options object.
- `options.immutable - Boolean`: Specify modify original object or return modified one.
- `options.create - Boolean`: Specify creating of new an object or array if it is not exist.

## Tests

    npm test

## License

MIT

