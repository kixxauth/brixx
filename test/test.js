'use strict';

if (typeof require === 'function' && typeof process === 'object') {
  expect = require('expect.js'),
  sinon  = require('sinon'),
  BRIXX  = require('../index');
}


describe('BRIXX', function () {

  describe('.ensure()', function () {
    it('returns a blank object if the given value is undefined', function () {
      var x = BRIXX.ensure();
      expect(x).to.be.an('object');
      expect(Object.getPrototypeOf(x)).to.be(null);
    });
    it('returns a blank object if the given value is null', function () {
      var x = BRIXX.ensure(null);
      expect(x).to.be.an('object');
      expect(Object.getPrototypeOf(x)).to.be(null);
    });
    it('returns false when given false', function () {
      var x = BRIXX.ensure(false);
      expect(x).to.be.a('boolean');
      expect(x).to.be(false);
    });
    it('returns 0 when given 0', function () {
      var x = BRIXX.ensure(0);
      expect(x).to.be.a('number');
      expect(x).to.be(0);
    });
    it('returns NaN when given NaN', function () {
      var x = BRIXX.ensure(NaN);
      expect(x).to.be.a('number');
      expect(isNaN(NaN)).to.be.ok();
    });
    it('returns an empty string when given an empty string', function () {
      var x = BRIXX.ensure('');
      expect(x).to.be.a('string');
      expect(x).to.be('');
    });
    it('returns a function when given a function', function () {
      var
      f = function () {},
      x = BRIXX.ensure(f);
      expect(x).to.be.a('function');
      expect(x).to.be(f);
    });
  });

  describe('.exists()', function () {
    it('returns false when passed undefined', function () {
      expect(BRIXX.exists()).to.be(false);
    });
    it('returns false when passed null', function () {
      expect(BRIXX.exists(null)).to.be(false);
    });
    it('returns false when passed NaN', function () {
      expect(BRIXX.exists(NaN)).to.be(false);
    });
    it('returns true when passed false', function () {
      expect(BRIXX.exists(false)).to.be(true);
    });
    it('returns true when passed 0', function () {
      expect(BRIXX.exists(0)).to.be(true);
    });
    it('returns true when passed ""', function () {
      expect(BRIXX.exists('')).to.be(true);
    });
    it('returns true when passed function() {}', function () {
      expect(BRIXX.exists(function () {})).to.be(true);
    });
    it('returns true when passed an Object', function () {
      expect(BRIXX.exists({})).to.be(true);
    });
    it('returns true when passed an Array', function () {
      expect(BRIXX.exists([])).to.be(true);
    });
  });

  describe('.toString()', function () {
    it('returns an empty string for undefined', function () {
      expect(BRIXX.toString()).to.be('');
    });
    it('returns an empty string for null', function () {
      expect(BIXX.toString(null)).to.be('');
    });
    it('returns an empty string for NaN', function () {
      expect(BRIXX.toString(NaN)).to.be('');
    });
    it('returns "false" for false', function () {
      expect(BRIXX.toString(false)).to.be('false');
    });
    it('return "0" for 0', function () {
      expect(BRIXX.toString(0)).to.be('0');
    });
    it('returns "[object Function]" for function', function () {
      var f = function () {};
      expect(BRIXX.toString(f)).to.be('[object Function]');
    });
    it('returns "[object Object]" for blank Object', function () {
      expect(BRIXX.toString({})).to.be('[object Object]');
      expect(BRIXX.toString(Object.create(null))).to.be('[object Object]');
    });
    it('returns the value of .toString() if it exists', function () {
      var x = Object.create(null);
      x.toString = function () {
        return 'foo';
      };
      expect(BRIXX.toString(x)).to.be('foo');
    });
  });
});