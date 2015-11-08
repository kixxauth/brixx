var
expect = require('expect.js'),
BRIXX  = require('../index');

describe('.factory()', function () {
  'use strict';

  describe('with no arguments', function () {
    var VAL = Object.create(null);

    before(function () {
      VAL.factory = BRIXX.factory();
      Object.freeze(VAL);
    });
    it('creates a new object', function () {
      var x = VAL.factory();
      expect(x).to.an.Object;
      expect(x).not.to.be(Object.prototype);
    });
    it('creates a blank object', function () {
      var x = VAL.factory();
      expect(Object.keys(x).length).to.equal(0);
    });
    it('creates an object with Object.prototype', function () {
      var
      x     = VAL.factory(),
      proto = Object.getPrototypeOf(x),
      base  = Object.getPrototypeOf(proto);
      expect(base).to.be(Object.prototype);
    });
    it('adds proprietary prototype methods', function () {
      var
      x     = VAL.factory(),
      proto = Object.getPrototypeOf(x),
      props = Object.getOwnPropertyNames(proto);
      expect(props.length).to.be(2);
      expect(props).to.contain('initialize');
      expect(props).to.contain('destroy');
    });
  });

  describe('with 1 Object argument', function () {
    var VAL = Object.create(null);
    VAL.extension = Object.create(null);
    VAL.extension.foo = 'bar';

    before(function () {
      VAL.factory = BRIXX.factory(VAL.extension);
      Object.freeze(VAL);
    });
    it('creates a new object', function () {
      var x = VAL.factory();
      expect(x).to.an.Object;
      expect(x).not.to.be(VAL.extension);
    });
    it('creates a blank object', function () {
      var x = VAL.factory();
      expect(Object.keys(x).length).to.equal(0);
    });
    it('creates an object with Object.prototype', function () {
      var
      x     = VAL.factory(),
      proto = Object.getPrototypeOf(x),
      base  = Object.getPrototypeOf(proto);
      expect(base).to.be(Object.prototype);
    });
    it('adds proprietary prototype and extended methods', function () {
      var
      x     = VAL.factory(),
      proto = Object.getPrototypeOf(x),
      props = Object.getOwnPropertyNames(proto);
      expect(props.length).to.be(3);
      expect(props).to.contain('initialize');
      expect(props).to.contain('destroy');
      expect(props).to.contain('foo');
      expect(x.foo).to.equal('bar');
    });
  });

  describe('with 2 Object arguments', function () {
    var VAL = Object.create(null);
    VAL.mixin = Object.create(null);
    VAL.mixin.bar = 'foo';
    VAL.extension = Object.create(null);
    VAL.extension.foo = 'bar';

    before(function () {
      VAL.factory = BRIXX.factory(VAL.mixin, VAL.extension);
      Object.freeze(VAL);
    });
    it('creates a new object', function () {
      var x = VAL.factory();
      expect(x).to.an.Object;
      expect(x).not.to.be(VAL.mixin);
      expect(x).not.to.be(VAL.extension);
    });
    it('creates a blank object', function () {
      var x = VAL.factory();
      expect(Object.keys(x).length).to.equal(0);
    });
    it('creates an object with Object.prototype', function () {
      var
      x     = VAL.factory(),
      proto = Object.getPrototypeOf(x),
      base  = Object.getPrototypeOf(proto);
      expect(base).to.be(Object.prototype);
    });
    it('adds proprietary prototype and extended methods', function () {
      var
      x     = VAL.factory(),
      proto = Object.getPrototypeOf(x),
      props = Object.getOwnPropertyNames(proto);
      expect(props.length).to.be(4);
      expect(props).to.contain('initialize');
      expect(props).to.contain('destroy');
      expect(props).to.contain('foo');
      expect(x.foo).to.equal('bar');
      expect(props).to.contain('bar');
      expect(x.bar).to.equal('foo');
    });
  });

  describe('with prototype', function () {

    describe('null prototype', function () {
      var VAL = Object.create(null);
      VAL.mixin = Object.create(null);
      VAL.mixin.bar = 'foo';
      VAL.extension = Object.create(null);
      VAL.extension.foo = 'bar';

      before(function () {
        VAL.factory = BRIXX.factory(null, VAL.mixin, VAL.extension);
        Object.freeze(VAL);
      });
      it('creates a new object', function () {
        var x = VAL.factory();
        expect(x).to.an.Object;
        expect(x).not.to.be(VAL.mixin);
        expect(x).not.to.be(VAL.extension);
      });
      it('creates a blank object', function () {
        var x = VAL.factory();
        expect(Object.keys(x).length).to.equal(0);
      });
      it('creates an object with null prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        base  = Object.getPrototypeOf(proto);
        expect(proto).not.to.be(Object.prototype);
        expect(base).to.be(null);
      });
      it('adds proprietary prototype and extended methods', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        props = Object.getOwnPropertyNames(proto);
        expect(props.length).to.be(4);
        expect(props).to.contain('initialize');
        expect(props).to.contain('destroy');
        expect(props).to.contain('foo');
        expect(x.foo).to.equal('bar');
        expect(props).to.contain('bar');
        expect(x.bar).to.equal('foo');
      });
    });

    describe('Function.prototype', function () {
      var
      VAL = Object.create(null);
      VAL.Person = function () {};

      before(function () {
        VAL.factory = BRIXX.factory(VAL.Person.prototype, null, null);
        Object.freeze(VAL);
      });

      it('creates an object with defined prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x);
        expect(proto).to.be(VAL.Person.prototype);
      });

      it('creates an object with defined constructor', function () {
        var
        x     = VAL.factory();
        expect(x.constructor).to.be(VAL.Person);
        expect(x instanceof VAL.Person).to.be(true);
      });

      it('adds proprietary methods', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        props = Object.getOwnPropertyNames(proto);
        expect(props).to.contain('initialize');
        expect(props).to.contain('destroy');
      });
    });

    describe('Object prototype', function () {
      var
      VAL = Object.create(null);
      VAL.proto = { foo: function () {} };

      before(function () {
        VAL.factory = BRIXX.factory(VAL.proto, null, null);
        Object.freeze(VAL);
      });

      it('creates an object with defined prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x);
        expect(proto).to.be(VAL.proto);
      });

      it('adds proprietary and prototype methods', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        props = Object.getOwnPropertyNames(proto);
        expect(props.length).to.be(3);
        expect(props).to.contain('initialize');
        expect(props).to.contain('destroy');
        expect(proto.foo).to.be(VAL.proto.foo);
      });
    });

  });

  describe('with dependencies', function () {

    describe('without extension', function () {
      var
      VAL = Object.create(null);
      VAL.base = {foo: 'bar'};

      before(function () {
        VAL.factory = BRIXX.factory([VAL.base]);
        Object.freeze(VAL);
      });
      it('creates a new object', function () {
        var x = VAL.factory();
        expect(x).to.an.Object;
        expect(x).not.to.be(Object.prototype);
      });
      it('creates a blank object', function () {
        var x = VAL.factory();
        expect(Object.keys(x).length).to.equal(0);
      });
      it('creates an object with Object.prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        base  = Object.getPrototypeOf(proto);
        expect(base).to.be(Object.prototype);
      });
      it('adds proprietary and extended methods', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        props = Object.getOwnPropertyNames(proto);
        expect(props.length).to.be(3);
        expect(props).to.contain('initialize');
        expect(props).to.contain('destroy');
        expect(x.foo).to.equal('bar');
      });
    });

    describe('without extension and null base prototype', function () {
      var
      VAL = Object.create(null);
      VAL.base = Object.create(null);
      VAL.base.x = 'y';
      VAL.base.foo = 'baz';

      before(function () {
        VAL.factory = BRIXX.factory([VAL.base]);
        Object.freeze(VAL);
      });
      it('creates a new object', function () {
        var x = VAL.factory();
        expect(x).to.an.Object;
        expect(x).not.to.be(Object.prototype);
      });
      it('creates a blank object', function () {
        var x = VAL.factory();
        expect(Object.keys(x).length).to.equal(0);
      });
      it('creates an object with Object.prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        base  = Object.getPrototypeOf(proto);
        expect(base).to.be(Object.prototype);
        expect(proto).not.to.be(Object.prototype);
      });
      it('adds proprietary and extended properties', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        props = Object.getOwnPropertyNames(proto);
        expect(props.length).to.be(4);
        expect(props).to.contain('initialize');
        expect(props).to.contain('destroy');
        expect(x.x).to.equal('y');
        expect(x.foo).to.equal('baz');
      });
    });

    describe('> 1 mixins without extension', function () {
      var
      VAL = Object.create(null);
      VAL.base = {x: 1, foo: 'baz'};
      VAL.subbase = {y: 2, foo: 'bar'};

      before(function () {
        VAL.factory = BRIXX.factory([VAL.base, VAL.subbase]);
        Object.freeze(VAL);
      });
      it('creates a new object', function () {
        var x = VAL.factory();
        expect(x).not.to.be(Object.prototype);
        expect(x).not.to.be(VAL.base);
        expect(x).not.to.be(VAL.subbase);
      });
      it('creates a blank object', function () {
        var x = VAL.factory();
        expect(Object.keys(x).length).to.equal(0);
      });
      it('creates an object with Object.prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        base  = Object.getPrototypeOf(proto);
        expect(base).to.be(Object.prototype);
      });
      it('adds proprietary and extended methods', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        props = Object.getOwnPropertyNames(proto);
        expect(props.length).to.be(5);
        expect(props).to.contain('initialize');
        expect(props).to.contain('destroy');
        expect(x.x).to.equal(1);
        expect(x.y).to.equal(2);
        expect(x.foo).to.equal('bar');
      });
    });

    describe('with extension', function () {
      var
      VAL = Object.create(null);
      VAL.base = {x: 'y', foo: 'baz'};
      VAL.extension = Object.create(null);
      VAL.extension.foo = 'bar';

      before(function () {
        VAL.factory = BRIXX.factory(VAL.base, VAL.extension);
        Object.freeze(VAL);
      });
      it('creates a new object', function () {
        var x = VAL.factory();
        expect(x).not.to.be(Object.prototype);
        expect(x).not.to.be(VAL.base);
        expect(x).not.to.be(VAL.extension);
      });
      it('creates a blank object', function () {
        var x = VAL.factory();
        expect(Object.keys(x).length).to.equal(0);
      });
      it('creates an object with Object.prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        base  = Object.getPrototypeOf(proto);
        expect(base).to.be(Object.prototype);
      });
      it('adds proprietary and extended methods', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        props = Object.getOwnPropertyNames(proto);
        expect(props.length).to.be(4);
        expect(props).to.contain('initialize');
        expect(props).to.contain('destroy');
        expect(x.x).to.equal('y');
        expect(x.foo).to.equal('bar');
      });
    });

    describe('> 1 mixins', function () {
      var
      VAL = Object.create(null);
      VAL.base = Object.defineProperties(Object.create(null), {
        x: {
          enumerable : true,
          value      : 1
        },
        z: {
          enumerable : true,
          value      : 'a'
        },
        foo: {
          enumerable : true,
          value      : 'baz'
        },
        bar: {
          enumerable : false,
          value      : 'foo'
        }
      });
      VAL.subbase = Object.defineProperties(Object.create(null), {
        y: {
          enumerable : true,
          value      : 2
        },
        z: {
          enumerable : true,
          value      : 'b'
        },
        foo: {
          enumerable : true,
          value      : 'beep'
        },
        baz: {
          enumerable : false,
          value      : 'foobar'
        }
      });
      VAL.extension = {foo: 'bar'};

      before(function () {
        VAL.baseProps = Object.getOwnPropertyNames(VAL.base);
        VAL.subbaseProps = Object.getOwnPropertyNames(VAL.subbase);
        VAL.factory = BRIXX.factory([VAL.base, VAL.subbase], VAL.extension);
        Object.freeze(VAL);
      });
      it('creates a new object', function () {
        var x = VAL.factory();
        expect(x).not.to.be(VAL.base);
        expect(x).not.to.be(VAL.subbase);
        expect(x).not.to.be(VAL.extension);
      });
      it('does not mutate mixins', function () {
        var
        baseProps = Object.getOwnPropertyNames(VAL.base),
        subbaseProps = Object.getOwnPropertyNames(VAL.subbase);
        expect(VAL.baseProps.length).to.equal(baseProps.length);
        expect(VAL.subbaseProps.length).to.equal(subbaseProps.length);
      });
      it('creates an object with base prototype', function () {
        var
        x     = VAL.factory(),
        proto = Object.getPrototypeOf(x),
        base  = Object.getPrototypeOf(proto);
        expect(base).to.be(Object.prototype);
        expect(proto).not.to.be(Object.prototype);
      });
      it('creates an object with only enumerable props of mixins', function () {
        var x = VAL.factory();
        expect(x.x).to.equal(1);
        expect(x.y).to.equal(2);
        expect(x.foo).to.equal('bar');
        expect(x.z).to.equal('b');

        // Non enumerable props to not get copied to the prototype.
        expect(x.bar).to.be(undefined);
        expect(x.baz).to.be(undefined);
      });
    });
  });

  describe('factory with initialize and destroy chains', function () {
    var
    VAL = Object.create(null);
    VAL.m1 = {
      initialize: function (spec) {
        this.specs.push(spec);
        this.initializers.push('m1');
      },
      destroy: function () {
        this.destroyers.push('m1');
      }
    };
    VAL.m2 = {
    };
    VAL.m3 = {
      initialize: function (spec) {
        this.specs        = [];
        this.initializers = [];
        this.destroyers   = [];
        this.specs.push(spec);
        this.initializers.push('m3');
      },
      destroy: function () {
        this.destroyers.push('m3');
      }
    };
    VAL.extension = {
      initialize: function (spec) {
        this.specs.push(spec);
        this.initializers.push('extension');
      }
    };

    before(function () {
      VAL.factory = BRIXX.factory([VAL.m3, VAL.m2, VAL.m1], VAL.extension);
    });
    it('calls initializers in parent order', function () {
      var x = VAL.factory();
      expect(x.initializers.length).to.be(3);
      expect(x.initializers[0]).to.be('m3');
      expect(x.initializers[1]).to.be('m1');
      expect(x.initializers[2]).to.be('extension');
    });
    it('calls destroyers in parent order', function () {
      var x = VAL.factory();
      x.destroy();
      expect(x.destroyers.length).to.be(2);
      expect(x.destroyers[0]).to.be('m3');
      expect(x.destroyers[1]).to.be('m1');
    });
    it('calls initializers with default spec', function () {
      var x = VAL.factory();
      expect(x.specs.length).to.be(3);
      expect(x.specs[0]).to.be.an('object');
      expect(x.specs[0]).to.be(x.specs[1]);
      expect(x.specs[2]).to.be(x.specs[1]);
    });

  });

  describe('factory with initialize and destroy chains without extension',
    function () {
    var
    VAL = Object.create(null);
    VAL.m1 = {
      initialize: function (spec) {
        this.specs.push(spec);
        this.initializers.push('m1');
      },
      destroy: function () {
        this.destroyers.push('m1');
      }
    };
    VAL.m2 = {
    };
    VAL.m3 = {
      initialize: function (spec) {
        this.specs        = [];
        this.initializers = [];
        this.destroyers   = [];
        this.specs.push(spec);
        this.initializers.push('m3');
      },
      destroy: function () {
        this.destroyers.push('m3');
      }
    };

    before(function () {
      VAL.factory = BRIXX.factory([VAL.m3, VAL.m2, VAL.m1]);
    });
    it('calls initializers in parent order', function () {
      var x = VAL.factory();
      expect(x.initializers.length).to.be(2);
      expect(x.initializers[0]).to.be('m3');
      expect(x.initializers[1]).to.be('m1');
    });
    it('calls destroyers in parent order', function () {
      var x = VAL.factory();
      x.destroy();
      expect(x.destroyers.length).to.be(2);
      expect(x.destroyers[0]).to.be('m3');
      expect(x.destroyers[1]).to.be('m1');
    });
    it('calls initializers with default spec', function () {
      var x = VAL.factory();
      expect(x.specs.length).to.be(2);
      expect(x.specs[0]).to.be.an('object');
      expect(x.specs[0]).to.be(x.specs[1]);
      expect(x.specs[1]).to.be(x.specs[1]);
    });

  });

});
