/* global define */
;(function (global, factory) {
  'use strict';

  // Support CommonJS, AMD, and global script loading.
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    factory(exports);
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.BRIXX = factory();
  }
}(this, function (BRIXX) {
  'use strict';
  BRIXX = BRIXX || {};

  //
  // Utilities
  //

  function noop() {}

  function extend(target, source) {
    return Object.keys(source).reduce(function (target, key) {
      target[key] = source[key];
      return target;
    }, target);
  }

  // Ensures the passed in object is, in fact, an Object.
  // When `null` or `undefined` are passed in, ensure() returns a new Object
  // created with `Object.create(null)`. Otherwise it returns the
  // passed in Object.
  function ensure(obj) {
    return (obj == void 0) ? Object.create(null) : obj;
  }
  BRIXX.ensure = ensure;


  // Calls `Object.freeze()` recursively on the passed in Object.
  // deepFreeze() will skip the `arguemnts`, `caller`, `callee` and `prototype`
  // properties of a Function. deepFreeze() will throw if passed null or
  // undefined just like `Object.freeze()` would.
  function deepFreeze(obj) {
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach(function (key) {
      if ( typeof obj === 'function' &&
           ( key === 'arguments' ||
             key === 'caller' ||
             key === 'callee' ||
             key === 'prototype')) {
        return;
      }

      var prop = obj[key];
      if ( prop !== null &&
           (typeof prop === 'object' || typeof prop === 'function')) {
        deepFreeze(prop);
      }
    });
    return obj;
  }
  BRIXX.deepFreeze = deepFreeze;


  // Check to see if the passed in Object exists.
  // Returns false for null, undefined, or NaN.
  // Returns true for everything else.
  function exists(obj) {
    // Because isNaN({}) == true
    return !(obj == void 0 || (typeof obj == 'number' && isNaN(obj)));
  }
  BRIXX.exists = exists;


  // A different way to stringify an Object, other than .toString().
  // 1) Returns an empty string for null, undefined or NaN.
  // 2) Returns the special '[object Function]' String for Functions.
  // 3) Returns the result of .toString() for anything else if it exists.
  // 4) Returns the result of Object.prototype.toString if .toString()
  //    is not present.
  function stringify(obj) {
    // Because isNaN({}) == true
    if (obj == void 0 || (typeof obj == 'number' && isNaN(obj))) return '';
    if (typeof obj == 'function') return '[object Function]';
    if (typeof obj.toString == 'function') return obj.toString();
    return Object.prototype.toString.call(obj);
  }
  BRIXX.stringify = stringify;

  //
  // BRIXX.factory() helpers
  //

  function extendPrototype(proto, mixins) {
    var initializers = [];
    var destroyers = [];

    proto = mixins.reduce(function (proto, mixin) {
      initializers.push(getMethod(mixin, 'initialize'));
      destroyers.push(getMethod(mixin, 'destroy'));
      return extend(proto, mixin);
    }, proto);

    function chainMethods(methods) {
      return function (args) {
        var i = 0;
        for (i; i < methods.length; i += 1) {
          methods[i].call(this, args);
        }
      };
    }

    Object.defineProperties(proto, {
      initialize: {
        value: chainMethods(initializers)
      },
      destroy: {
        value: chainMethods(destroyers)
      }
    });

    return proto;
  }


  function getMethod(obj, name) {
    return typeof obj[name] === 'function' ? obj[name] : noop;
  }


  // An object factory which uses the mixin pattern.
  // Pass it some mixins and it will return an Object factory Function for you.
  // Returns a Function which will create new Objects using a prototype composed
  // of the mixins passed in. The returned Object factory will call initialize()
  // on your object instance. If there is an initialize() function defined on
  // any of the mixins, they will be called before your mixin.
  //
  // Example:
  //
  // var createWidget = BRIXX.factory(BRIXX.Model, {
  //   type: 'Widget',
  //   idAttribute: '_id',
  //
  //   defaults: {
  //     _id    : null,
  //     width  : 5,
  //     height : 2
  //   },
  //
  //   initialize: function () {
  //     this.cid = randomString();
  //   },
  //
  //   area: function () {
  //     return this.width * this.height;
  //   }
  // });
  function factory(prototype, mixins, extension) {
    if (arguments.length === 0) {
      prototype = {};
      mixins    = [];
    } else if (arguments.length === 1) {
      mixins    = prototype;
      prototype = {};
    } else if (arguments.length === 2) {
      extension = mixins;
      mixins    = prototype;
      prototype = {};
    }

    prototype = prototype === null ? Object.create(null) : prototype;
    mixins    = Array.isArray(mixins) ? mixins : [mixins];
    if (extension) {
      mixins.push(extension);
    }
    mixins = mixins.filter(function (mixin) {
      return mixin != void 0;
    });

    prototype = extendPrototype(prototype, mixins);

    function Constructor(spec) {
      spec = (spec == void 0) ? Object.create(null) : spec;
      var obj = Object.create(prototype);
      obj.initialize(spec);
      return obj;
    }

    Constructor.prototype = prototype;
    Constructor.extend = function (mixins, extension) {
      return factory(Object.create(prototype), mixins, extension);
    };
    return Constructor;
  }
  BRIXX.factory = factory;


  // An Object mixin for creating Immutable models.
  // Designed to be uses in BRIXX.factory(see above). Define a set of default
  // values in your definition and the keys will be used to enforce assignment
  // rules on the instance. Includes a mechnanism for naming the type for your
  // model, as well as assigning an ID.
  //
  // Example:
  //
  // var createWidget = BRIXX.factory(BRIXX.Model, {
  //   type: 'Widget',
  //   idAttribute: '_id',
  //
  //   defaults: {
  //     _id    : null,
  //     width  : 5,
  //     height : 2
  //   },
  //
  //   area: function () {
  //     return this.width * this.height;
  //   }
  // });
  BRIXX.Model = {
    idAttribute: 'id',

    initialize: function (spec) {
      var self = this;
      var defaults = this.defaults;
      var type = this.type || (defaults || {}).type;
      var keys;
      var values = Object.create(null);

      try {
        keys = Object.keys(defaults);
      } catch (err) {
        throw new Error('Invalid "defaults" attribute on prototype.');
      }

      if (keys.indexOf(this.idAttribute) < 0) {
        throw new Error(type +
                        ' defaults must contain idAttribute "' +
                        this.idAttribute + '"');
      }

      values = keys.reduce(function (values, k) {
        values[k] = Object.prototype.hasOwnProperty.call(spec, k) ?
                    spec[k] : defaults[k];
        return values;
      }, values);

      keys.unshift('type');
      Object.freeze(keys);
      values.type = type;

      Object.defineProperties(this, {
        _keys: {
          value: keys
        }
      });

      keys.forEach(function (key) {
        Object.defineProperty(self, key, {
          enumerable: true,
          get: function () {
            return values[key];
          },
          set: function () {
            throw new Error('Cannot set by reference on an immutable record.');
          }
        });
      });
    },

    toString: function () {
      var self = this;
      var keyString = this._keys.map(function (k) {
        var val = self[k];
        return k + ': ' + (typeof val === 'string' ? ('"' + val + '"') : val);
      }).join(', ');
      return this.type + ' { ' + keyString + ' }';
    },

    has: function (key) {
      return this._keys.indexOf(key) >= 0;
    },

    hasId: function () {
      var id = this[this.idAttribute];
      return !!(id || typeof id === 'number');
    },

    set: function (values) {
      var i, keys, newModel;
      if (!values || typeof values !== 'object') {
        throw new Error('Model.set() must be called with an Object');
      }
      keys = Object.keys(values);
      for (i = 0; i < keys.length; i += 1) {
        if (!this.has(keys[i])) {
          throw new Error('Cannot set undefined key "' +
                          keys[i] + '" on ' + this.type);
        }
      }
      newModel = Object.create(this);
      newModel.initialize(extend(this.toJSON(), values));
      return newModel;
    },

    diff: function (other) {
      if (this === other) {
        return null;
      }

      var self = this;
      var diff = [];

      this._keys.forEach(function (k) {
        if (self[k] !== other[k]) {
          diff.push([k, self[k], other[k]]);
        }
      });

      if (!diff.length) {
        return null;
      }
      return diff;
    },

    toJSON: function () {
      var self = this;
      return this._keys.reduce(function (attrs, k) {
        attrs[k] = self[k];
        return attrs;
      }, Object.create(null));
    },

    valueOf: function () {
      return this.toJSON();
    }
  };

  // Object property pattern matcher. This best explained by an example:
  // ```JS
  // var pm = BRIXX.PatternMatcher.create()
  //       .add({a:1}, 'A')
  //       .add({b:2}, 'B');
  //
  // console.log(pm.find({a:1}));
  // // ["A"]
  //
  // console.log(pm.find({a:2}));
  // // [] Empty Array
  //
  // console.log(pm.find({a:1,b:1}));
  // // ["A"]
  //
  // console.log(pm.find({b:2,c:3}));
  // // ["B"]
  //
  // console.log(pm.find({a:1,b:2}));
  // // ["A", "B"]
  // ```
  function PatternMatcher() {}

  BRIXX.PatternMatcher = PatternMatcher;

  extend(PatternMatcher.prototype, {
    initialize: function () {
      this.index = Object.create(null);
    },

    // Registers a pattern/object pair. The pattern could be any JavaScript
    // type, but an Object hash is most useful. The object could be any value.
    // Returns the PatternMatcher instance for method chaining.
    add: function (objectPattern, object) {
      var stringPattern = this.patternToString(objectPattern);
      var list = this.index[stringPattern];
      if (!list) {
        list = this.index[stringPattern] = [];
      }
      list.push(object);
      return this;
    },

    // Find a registered value by the given pattern. The pattern could be any
    // JavaScript type, but an Object hash usually what is used. Always returns
    // an Array, and in the case that no values are found, an empty Array.
    find: function (objectPattern) {
      var stringPattern = this.patternToString(objectPattern);
      var index = this.index;

      return Object.keys(index).reduce(function (matches, pattern) {
        if (stringPattern.indexOf(pattern) > -1) {
          matches = matches.concat(index[pattern]);
        }
        return matches;
      }, []);
    },

    // Check to see if there are any values registered for a particular pattern.
    // This is more efficient than calling #find().
    exists: function (objectPattern) {
      var stringPattern = this.patternToString(objectPattern);
      return Boolean(this.index[stringPattern]);
    },

    // Unregister a value, or all values by the given pattern. If `object` is
    // provided only that object will be removed if it is found to be
    // registered on the given pattern. If no `object` is provided then
    // the entire pattern will be unregistered. Returns true if anything was
    // unregistered and false if not.
    remove: function (objectPattern, object) {
      var stringPattern = this.patternToString(objectPattern);
      var matches;
      var i;

      if (typeof object === 'undefined') {
        if (this.index[stringPattern]) {
          delete this.index[stringPattern];
          return true;
        }
        return false;
      }

      matches = this.index[stringPattern];
      i = matches.indexOf(object);
      if (i >= 0) {
        matches.splice(i, 1);
        return true;
      }

      return false;
    },

    patternToString: function (objectPattern) {
      var self = this;
      if (objectPattern && typeof objectPattern === 'object') {
        return Object.keys(objectPattern).sort().map(function (key) {
          return key + ':' + self.objectToString(objectPattern[key]);
        }).join();
      }
      return this.objectToString(objectPattern);
    },

    objectToString: function (object) {
      if (typeof object === 'string') {
        return object;
      }
      if ( typeof object === 'boolean' ||
           (typeof object === 'number' && !isNaN(object))) {
        return object.toString();
      }
      if ( object &&
           (typeof object === 'object' || typeof object === 'function')) {
        return Object.prototype.call(object);
      }
      if ( object === null ||
           typeof object === 'undefined' || isNaN(object)) {
        return 'null';
      }
      return Object.prototype.toString.call(object);
    }
  });

  PatternMatcher.create = factory(PatternMatcher.prototype);

  return BRIXX;
}));
