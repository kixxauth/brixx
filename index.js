(function(root, factory) {
/*
global define, exports
*/
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['exports'], function(exports) {
      factory(exports);
    });
  } else if (typeof exports !== 'undefined') {
    factory(exports);
  } else {
    root.BRIXX = Object.create(null);
    factory(root.BRIXX);
  }

}(this, function(exports) {
  'use strict';


  function ensure(obj) {
    return (obj == void 0) ? Object.create(null) : obj;
  }


  function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach(function (key) {
      var
      prop = obj[key];
      if ( prop !== null &&
           (typeof prop === 'object' || typeof prop === 'function')) {
        deepFreeze(prop);
      }
    });
    return Object.freeze(obj);
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


  exports.ensure = ensure;
  exports.deepFreeze = deepFreeze;
  exports.exists = exists;
  exports.stringify = stringify;

}));
