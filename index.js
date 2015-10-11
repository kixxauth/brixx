/* jshint globalstrict: true */
/* global exports */
'use strict';


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
exports.ensure = ensure;


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
exports.deepFreeze = deepFreeze;


// Check to see if the passed in Object exists.
// Returns false for null, undefined or NaN, and true for everything else.
function exists(obj) {
  // Because isNaN({}) == true
  return !(obj == void 0 || (typeof obj == 'number' && isNaN(obj)));
}
exports.exists = exists;


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
exports.stringify = stringify;


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


// An object factory that uses the mixin pattern.
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

  return function (spec) {
    spec = (spec == void 0) ? Object.create(null) : spec;
    var obj = Object.create(prototype);
    obj.initialize(spec);
    return obj;
  };
}
exports.factory = factory;


exports.Model = {
  idAttribute: 'id',

  initialize: function (spec) {
    var self = this;
    var defaults = this.defaults;
    var name = this.name || defaults.name;
    var keys = Object.keys(defaults);
    var values = Object.create(null);

    if (keys.indexOf(this.idAttribute) < 0) {
      throw new Error(name +
                      ' defaults must contain idAttribute "' +
                      this.idAttribute + '"');
    }

    values = keys.reduce(function (values, k) {
      values[k] = Object.prototype.hasOwnProperty.call(spec, k) ?
                  spec[k] : defaults[k];
      return values;
    }, values);

    keys.unshift('name');
    Object.freeze(keys);
    values.name = name;

    Object.defineProperties(this, {
      keys: {
        value: keys
      },
      size: {
        value: keys.length
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
    var keyString = this.keys.map(function (k) {
      var val = self[k];
      return k + ': ' + (typeof val === 'string' ? ('"' + val + '"') : val);
    }).join(', ');
    return this.name + ' { ' + keyString + ' }';
  },

  has: function (key) {
    return this.keys.indexOf(key) >= 0;
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
                        keys[i] + '" on ' + this.name);
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

    this.keys.forEach(function (k) {
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
    return this.keys.reduce(function (attrs, k) {
      attrs[k] = self[k];
      return attrs;
    }, Object.create(null));
  }
};

