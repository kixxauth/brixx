/* jshint globalstrict: true */
/* global exports */
'use strict';


function ensure(obj) {
  return (obj == void 0) ? Object.create(null) : obj;
}


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


function exists(obj) {
  // Because isNaN({}) == true
  return !(obj == void 0 || (typeof obj == 'number' && isNaN(obj)));
}


function stringify(obj) {
  // Because isNaN({}) == true
  if (obj == void 0 || (typeof obj == 'number' && isNaN(obj))) return '';
  if (typeof obj == 'function') return '[object Function]';
  if (typeof obj.toString == 'function') return obj.toString();
  return Object.prototype.toString.call(obj);
}


function extendPrototype(proto, mixins) {
  var
  initializers = [],
  destroyers   = [];

  proto = mixins.reduce(function (proto, mixin) {

    initializers.push(getMethod(mixin, 'initialize'));
    destroyers.push(getMethod(mixin, 'destroy'));

    return Object.keys(mixin).reduce(function (proto, key) {
      proto[key] = mixin[key];
      return proto;
    }, proto);

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


function noop() {}



exports.ensure = ensure;
exports.deepFreeze = deepFreeze;
exports.factory = factory;
exports.exists = exists;
exports.stringify = stringify;
