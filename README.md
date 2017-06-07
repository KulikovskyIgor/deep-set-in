# deep-set-in

Sets the value at path of object and array tree

## Installation

    npm install deep-set-in

## Usage

```js
var deepSetIn = require('deep-set-in')

var obj = { one: { two: { three: 'test' } } }

deepSetIn(obj, ['one', 'two', 'three'], 'works')
// { one: { two: { three: 'works' } } }

// or

var obj = { one: { two: [{ id: 'test id', val: 'test val' }] } }

deepSetIn(obj, ['one', ['two', 'id', 'test id'], 'val'], 'works')
// { one: { two: [{ id: 'test id', val: 'works' }] } }

```

### Arguments

`deepSetIn(obj, path, value)`

- `obj - Object`: The original object.
- `path - Array`: The property path, array with keys.
- `value - *`: The new object with set value or undefined.

## Tests

    npm test

## License

MIT

