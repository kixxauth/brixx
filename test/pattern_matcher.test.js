var
expect = require('expect.js'),
BRIXX  = require('../index');

describe('.PatternMatcher', function () {
  'use strict';

  describe('with several registered matches', function () {
    var VAL = Object.create(null);

    before(function () {
      VAL.a = {a: 0};
      VAL.x = {x: 1};
      VAL.y = {y: 2};
      VAL.z = {z: 3};
      VAL.matcher = BRIXX.PatternMatcher.create();

      Object.freeze(VAL);

      VAL.matcher.add({foo: 'bar'}, VAL.a);
      VAL.matcher.add({foo: 'bar'}, VAL.x);
      VAL.matcher.add({baz: 'zee'}, VAL.y);
      VAL.matcher.add({foo: 'bar', baz: 'zee'}, VAL.z);
    });
    it('registers many per pattern', function () {
      var res = VAL.matcher.find({foo: 'bar'});
      expect(res.length).to.be(2);
      expect(res).to.contain(VAL.a);
      expect(res).to.contain(VAL.x);
    });
    it('can register only one', function () {
      var res = VAL.matcher.find({baz: 'zee'});
      expect(res.length).to.be(1);
      expect(res[0]).to.be(VAL.y);
    });
    it('finds by decreasing specificity', function () {
      var res = VAL.matcher.find({baz: 'zee', foo: 'bar'});
      expect(res).to.contain(VAL.a);
      expect(res).to.contain(VAL.x);
      expect(res).to.contain(VAL.y);
      expect(res).to.contain(VAL.z);
    });
    it('can remove by pattern', function () {
      VAL.matcher.remove({foo: 'bar'}, VAL.a);
      var res = VAL.matcher.find({foo: 'bar'});
      expect(res.length).to.be(1);
      expect(res[0]).to.be(VAL.x);
    });
  });
});
