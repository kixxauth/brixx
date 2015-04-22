(function(root, factory) {
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

  var BRIXX = {

    ensure: function (obj) {
      return (obj == void 0) ? Object.create(null) : obj;
    },

    deepFreeze: function (obj) {
      Object.getOwnPropertyNames(obj).forEach(function (key) {
        var
        prop = obj[key];
        if ( prop !== null &&
             (typeof prop === 'object' || typeof prop === 'function')) {
          U.deepFreeze(prop);
        }
      });
      return Object.freeze(obj);
    },

    exists: function (obj) {
      // Because isNaN({}) == true
      return !(obj == void 0 || (typeof obj == 'number' && isNaN(obj)));
    },

    toString: function (obj) {
      // Because isNaN({}) == true
      if (obj == void 0 || (typeof obj == 'number' && isNaN(obj))) return '';
      if (typeof obj == 'function') return '[object Function]';
      if (typeof obj.toString == 'function') return obj.toString();
      return Object.prototype.toString.call(obj);
    }

  };


  Object.keys(BRIXX).reduce(function (exports, key) {
    exports[key] = BRIXX[key];
    return exports;
  }, exports);

});
