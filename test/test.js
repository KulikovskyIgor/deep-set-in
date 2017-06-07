var cloneDeep = require('clone-deep');
var deepSetIn = require('../source');
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

test('create new object', function (t) {
  var obj = cloneDeep(testObj);
  t.plan(2);
  t.equal(obj.a.b.g, undefined);

  var path = ['a', 'b', 'g'];
  deepSetIn(obj, path, 'works', {create: true});

  t.equal(obj.a.b.g, 'works');
});

test('create new deep nested object', function (t) {
  var obj = cloneDeep(testObj);
  t.plan(2);
  t.equal(obj.a.b.g, undefined);

  var path = ['a', 'b', 'g', 'h', 'j', 'k'];
  deepSetIn(obj, path, 'works', {create: true});

  t.equal(obj.a.b.g.h.j.k, 'works');
});

test('create new array', function (t) {
  var obj = cloneDeep(testObj);
  t.plan(2);
  t.equal(obj.a.b.g, undefined);

  var path = ['a', 'b', ['g', 'id', 'id value'], 'new-property'];
  deepSetIn(obj, path, 'works', {create: true});

  t.equal(obj.a.b.g[0]['new-property'], 'works');
});

test('create new deep nested array', function (t) {
  var obj = cloneDeep(testObj);
  t.plan(2);
  t.equal(obj.a.b.g, undefined);

  var path = ['a', 'b', ['g', 'id', 'id value'], ['h', 'id', 'id value'], 'new-property'];
  deepSetIn(obj, path, 'works', {create: true});

  t.equal(obj.a.b.g[0].h[0]['new-property'], 'works');
});