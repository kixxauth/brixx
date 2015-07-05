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
  initializer      = noop,
  destroyer        = noop,
  protoInitializer = typeof proto.initialize === 'function' ?
                     proto.initialize : noop,
  protoDestroyer   = typeof proto.destroy === 'function' ?
                     proto.destroy : noop;

  proto = mixins.reduce(function (proto, mixin) {
    var
    childInitializer = typeof mixin.initialize === 'function' ?
                       mixin.initialize : noop,
    childDestroyer   = typeof mixin.destroy === 'function' ?
                       mixin.destroy : noop;

    initializer = createMethodChain(initializer, childInitializer);
    destroyer   = createMethodChain(destroyer, childDestroyer);

    return Object.keys(mixin).reduce(function (proto, key) {
      if (!Object.prototype.hasOwnProperty.call(proto, key)) {
        proto[key] = mixin[key];
      }
      return proto;
    }, proto);
  }, proto);

  Object.defineProperties(proto, {
    initialize: {
      value: createMethodChain(initializer, protoInitializer)
    },
    destroy: {
      value: createMethodChain(destroyer, protoDestroyer)
    }
  });

  return Object.freeze(proto);
}


function createMethodChain(parent, child) {
  return function (spec) {
    parent.call(this, spec);
    child.call(this, spec);
  };
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

  proto = extendPrototype(proto, mixins.reverse());

  return function (spec) {
    spec = (spec == void 0) ? Object.create(null) : spec;
    var obj = Object.create(proto);
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
