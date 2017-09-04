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

  return BRIXX;
}));
