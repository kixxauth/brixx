/*
global expect, BRIXX
*/

/* jshint ignore:start */
if (typeof require === 'function' && typeof window === 'undefined') {
  expect = require('expect.js');
  BRIXX  = require('../index');
}
/* jshint ignore:end */

describe('.factory()', function () {
  'use strict';

  describe('with no arguments', function () {
    var VAL = Object.create(null);

    before(function () {
      VAL.factory = BRIXX.factory();
      BRIXX.deepFreeze(VAL);
    });
    it('creates an object', function () {
      var x = VAL.factory();
      expect(x).to.an.Object;
    });
    it('creates a blank object', function () {
      var x = VAL.factory();
      expect(Object.keys(x).length).to.equal(0);
    });
    it('creates an object with null base prototype', function () {
      var
      x     = VAL.factory(),
      proto = Object.getPrototypeOf(x),
      props = Object.getOwnPropertyNames(proto),
      base  = Object.getPrototypeOf(proto);
      expect(base).to.be(null);
      expect(props).to.contain('initialize');
      expect(props).to.contain('destroy');
      expect(props.length).to.be(2);
    });
  });

  describe('with no dependencies', function () {

    describe('with extension', function () {
      var
      VAL = Object.create(null);
      VAL.extension = {foo: 'bar'};

      before(function () {
        VAL.factory = BRIXX.factory(VAL.extension);
        BRIXX.deepFreeze(VAL);
      });
      it('creates a new object', function () {
        var x = VAL.factory();
        expect(x).not.to.be(VAL.extension);
      });
      it('creates an object with base prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        props = Object.getOwnPropertyNames(proto),
        base  = Object.getPrototypeOf(proto);
        expect(base).to.be(Object.prototype);
        expect(proto).to.be(VAL.extension);
        expect(props).to.contain('initialize');
        expect(props).to.contain('destroy');
        expect(props).to.contain('foo');
        expect(props.length).to.be(3);
      });
      it('creates an object with properties of prototype', function () {
        var x = VAL.factory();
        expect(x.foo).to.equal('bar');
      });
    });

    describe('with null dependencies', function () {
      var
      VAL = Object.create(null);
      VAL.extension = {foo: 'bar'};

      before(function () {
        VAL.factory = BRIXX.factory(null, VAL.extension);
        BRIXX.deepFreeze(VAL);
      });
      it('creates a new object', function () {
        var x = VAL.factory();
        expect(x).not.to.be(VAL.extension);
      });
      it('creates an object with base prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        props = Object.getOwnPropertyNames(proto),
        base  = Object.getPrototypeOf(proto);
        expect(base).to.be(Object.prototype);
        expect(proto).to.be(VAL.extension);
        expect(props).to.contain('initialize');
        expect(props).to.contain('destroy');
        expect(props).to.contain('foo');
        expect(props.length).to.be(3);
      });
      it('creates an object with properties of prototype', function () {
        var x = VAL.factory();
        expect(x.foo).to.equal('bar');
      });
    });

    describe('with empty dependencies', function () {
      var
      VAL = Object.create(null);
      VAL.extension = {foo: 'bar'};

      before(function () {
        VAL.factory = BRIXX.factory([], VAL.extension);
        BRIXX.deepFreeze(VAL);
      });
      it('creates a new object', function () {
        var x = VAL.factory();
        expect(x).not.to.be(VAL.extension);
      });
      it('creates an object with base prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        props = Object.getOwnPropertyNames(proto),
        base  = Object.getPrototypeOf(proto);
        expect(base).to.be(Object.prototype);
        expect(proto).to.be(VAL.extension);
        expect(props).to.contain('initialize');
        expect(props).to.contain('destroy');
        expect(props).to.contain('foo');
        expect(props.length).to.be(3);
      });
      it('creates an object with properties of prototype', function () {
        var x = VAL.factory();
        expect(x.foo).to.equal('bar');
      });
    });

    describe('with constructor', function () {
      var
      VAL = Object.create(null);

      function C() {}
      C.prototype.foo = 'bar';

      VAL.C = C;

      before(function () {
        VAL.factory = BRIXX.factory(VAL.C);
        BRIXX.deepFreeze(VAL);
      });
      it('creates a new object', function () {
        var x = VAL.factory();
        expect(x).not.to.be(C);
        expect(x).not.to.be(C.prototype);
      });
      it('creates an object which responds to instanceof', function () {
        var x = VAL.factory();
        expect(x instanceof C).to.be.ok();
      });
      it('creates an object which has "constructor"', function () {
        var x = VAL.factory();
        expect(x.constructor).to.be(VAL.C);
      });
      it('creates an object with base prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        props = Object.getOwnPropertyNames(proto),
        base  = Object.getPrototypeOf(proto);
        expect(base).to.be(Object.prototype);
        expect(proto).to.be(VAL.C.prototype);
        expect(props).to.contain('constructor');
        expect(props).to.contain('initialize');
        expect(props).to.contain('destroy');
        expect(props).to.contain('foo');
        expect(props.length).to.be(4);
      });
      it('creates an object with properties of prototype', function () {
        var x = VAL.factory();
        expect(x.foo).to.equal('bar');
      });

    });

  });

  describe('with dependencies', function () {

    describe('without extension', function () {
      var
      VAL = Object.create(null);
      VAL.base = {foo: 'bar'};

      before(function () {
        VAL.factory = BRIXX.factory(VAL.base);
        BRIXX.deepFreeze(VAL);
      });
      it('creates a new object', function () {
        var x = VAL.factory();
        expect(x).not.to.be(VAL.base);
      });
      it('creates an object with base prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        props = Object.getOwnPropertyNames(proto),
        base  = Object.getPrototypeOf(proto);
        expect(base).to.be(Object.prototype);
        expect(proto).to.be(VAL.base);
        expect(props).to.contain('initialize');
        expect(props).to.contain('destroy');
        expect(props).to.contain('foo');
        expect(props.length).to.be(3);
      });
      it('creates an object with properties of mixin', function () {
        var x = VAL.factory();
        expect(x.foo).to.equal('bar');
      });
    });

    describe('> 1 mixins without extension', function () {
      var
      VAL = Object.create(null);
      VAL.base = {x: 1, foo: 'baz'};
      VAL.subbase = {y: 2, foo: 'bar'};

      before(function () {
        VAL.factory = BRIXX.factory([VAL.base, VAL.subbase]);
        BRIXX.deepFreeze(VAL);
      });
      it('creates a new object', function () {
        var x = VAL.factory();
        expect(x).not.to.be(VAL.base);
        expect(x).not.to.be(VAL.subbase);
      });
      it('creates an object with base prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        props = Object.getOwnPropertyNames(proto),
        base  = Object.getPrototypeOf(proto);
        expect(base).to.be(Object.prototype);
        expect(proto).to.be(VAL.subbase);
        expect(props).to.contain('initialize');
        expect(props).to.contain('destroy');
        expect(props).to.contain('foo');
        expect(props).to.contain('x');
        expect(props).to.contain('y');
        expect(props.length).to.be(5);
      });
      it('creates an object with properties of mixins', function () {
        var x = VAL.factory();
        expect(x.x).to.equal(1);
        expect(x.y).to.equal(2);
        expect(x.foo).to.equal('bar');
      });
    });

    describe('with single mixin', function () {
      var
      VAL = Object.create(null);
      VAL.base = {x: 'y', foo: 'baz'};
      VAL.extension = {foo: 'bar'};

      before(function () {
        VAL.factory = BRIXX.factory(VAL.base, VAL.extension);
        BRIXX.deepFreeze(VAL);
      });
      it('creates a new object', function () {
        var x = VAL.factory();
        expect(x).not.to.be(VAL.base);
        expect(x).not.to.be(VAL.extension);
      });
      it('creates an object with base prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        props = Object.getOwnPropertyNames(proto),
        base  = Object.getPrototypeOf(proto);
        expect(base).to.be(Object.prototype);
        expect(proto).to.be(VAL.extension);
        expect(props).to.contain('initialize');
        expect(props).to.contain('destroy');
        expect(props).to.contain('foo');
        expect(props).to.contain('x');
        expect(props.length).to.be(4);
      });
      it('creates an object with overridden properties', function () {
        var x = VAL.factory();
        expect(x.x).to.equal('y');
        expect(x.foo).to.equal('bar');
      });
    });

    describe('> 1 mixins', function () {
      var
      VAL = Object.create(null);
      VAL.base = {x: 1, foo: 'baz'};
      VAL.subbase = {y: 2, foo: 'beep'};
      VAL.extension = {foo: 'bar'};

      before(function () {
        VAL.factory = BRIXX.factory([VAL.base, VAL.subbase], VAL.extension);
        BRIXX.deepFreeze(VAL);
      });
      it('creates a new object', function () {
        var x = VAL.factory();
        expect(x).not.to.be(VAL.base);
        expect(x).not.to.be(VAL.subbase);
        expect(x).not.to.be(VAL.extension);
      });
      it('creates an object with base prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        props = Object.getOwnPropertyNames(proto),
        base  = Object.getPrototypeOf(proto);
        expect(base).to.be(Object.prototype);
        expect(proto).to.be(VAL.extension);
        expect(props).to.contain('initialize');
        expect(props).to.contain('destroy');
        expect(props).to.contain('foo');
        expect(props).to.contain('x');
        expect(props).to.contain('y');
        expect(props.length).to.be(5);
      });
      it('creates an object with properties of mixins', function () {
        var x = VAL.factory();
        expect(x.x).to.equal(1);
        expect(x.y).to.equal(2);
        expect(x.foo).to.equal('bar');
      });
    });
  });

});
