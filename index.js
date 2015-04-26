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


/*
function createPrototype(mixins) {
  var
  // Use the final mixin (extension) as the prototype so that we
  // can get a useful instanceof
  proto = mixins[mixins.length - 1];
  if (typeof proto === 'function') {
    proto = proto.prototype;
  }
  proto.initialize = noop;
  proto.destroy = noop;

  proto = mixins.reduce(function (proto, mixin) {
    var
    childInitialize,
    childDestroy = typeof mixin.destroy === 'function' ? mixin.destroy : noop,
    parentInitialize = proto.initialize,
    parentDestroy = proto.destroy;

    if (typeof mixin === 'function') {
      childInitialize = mixin;
      mixin = mixin.prototype;
    } else {
      childInitialize = typeof mixin.initialize === 'function' ?
                      mixin.initialize : noop;
    }

    mixin.initialize = function (spec) {
      spec = (spec == void 0) ? Object.create(null) : spec;
      parentInitialize.call(this, spec);
      childInitialize.call(this, spec);
    };

    mixin.destroy = function () {
      parentDestroy.call(this);
      childDestroy.call(this);
    };

    return Object.keys(mixin).reduce(function (proto, key) {
      proto[key] = mixin[key];
      return proto;
    }, proto);
  }, proto);

  return Object.freeze(proto);
}
*/


function extendPrototype(proto, mixins) {
  proto = mixins.reduce(function (proto, mixin) {
    return Object.keys(mixin).reduce(function (proto, key) {
      if (!proto.hasOwnProperty(key)) {
        proto[key] = mixin[key];
      }
      return proto;
    }, proto);
  }, proto);

  Object.defineProperties(proto, {
    initialize: {
      value: function () {
      }
    },
    destroy: {
      value: function () {
      }
    }
  });

  return Object.freeze(proto);
}


function factory(mixins, extension) {
  var proto;
  mixins = Array.isArray(mixins) ? mixins.slice() : [ensure(mixins)];

  if (extension && typeof extension === 'object') {
    proto = extension;
  } else if (typeof extension === 'function') {
    proto = extension.prototype;
  } else {
    proto = mixins.pop();
    if (typeof proto === 'function') {
      proto = proto.prototype;
    }
  }

  proto = extendPrototype(proto, mixins);

  return function (spec) {
    spec = (spec == void 0) ? Object.create(null) : copy(spec);
    var obj = Object.create(proto);
    obj.initialize(spec);
    return obj;
  };
}


function copy(obj) {
  return Object.keys(obj).reduce(function (rv, key) {
    rv[key] = obj[key];
    return rv;
  }, Object.create(null));
}


//function noop() {}


exports.ensure = ensure;
exports.deepFreeze = deepFreeze;
exports.factory = factory;
exports.exists = exists;
exports.stringify = stringify;
