var cloneDeep = require('clone-deep');
var deepSetIn = require('..');
var test = require('tape');

var testObj = {
  a: {
    b: {
      c: [
        {id: 1, val: 'test 1'},
        {
          id: 2,
          val: 'test 2',
          k: [{id: 3, val: 'test 3'}]
        }
      ],
      d: 'test'
    }
  }
};

test('do nothing if path is not correct', function (t) {
  var obj = cloneDeep(testObj);
  t.plan(1);

  deepSetIn(obj, ['a', 'b', 'g'], 'test 4');

  t.equal(obj.a.b.g, undefined);
});

test('set nested property', function (t) {
  var obj = cloneDeep(testObj);
  t.plan(2);
  t.equal(obj.a.b.d, 'test');

  deepSetIn(obj, ['a', 'b', 'd'], 'test 4');

  t.equal(obj.a.b.d, 'test 4');
});

test('set nested property and return modified object (doesnt modify original object)', function (t) {
  var obj = cloneDeep(testObj);
  t.plan(3);
  t.equal(obj.a.b.d, 'test');

  var modifiedObj = deepSetIn(obj, ['a', 'b', 'd'], 'test 4', {immutable: true});

  t.equal(obj.a.b.d, 'test');
  t.equal(modifiedObj.a.b.d, 'test 4');
});

test('set nested array property', function (t) {
  var obj = cloneDeep(testObj);
  t.plan(2);
  t.equal(obj.a.b.c[1].k[0].val, 'test 3');

  var path = ['a', 'b', ['c', 'id', 2], ['k', 'id', 3], 'val'];
  deepSetIn(obj, path, 'test 5');

  t.equal(obj.a.b.c[1].k[0].val, 'test 5');
});