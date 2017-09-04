/* globals define, module */
;(function (root, factory) { // eslint-disable-line no-extra-semi
	'use strict';

	// Support CommonJS, AMD, and global script loading.
	if (typeof define === 'function' && define.amd) {
		define(['brixx'], factory);
	} else if (typeof module === 'object' && module.exports) {
		factory(module.exports);
	} else {
		root.BRIXX = {};
		factory(root.BRIXX);
	}
}(this, function (BRIXX) {
	'use strict';

	//
	// Utilities
	//

	function noop() {}
	BRIXX.noop = noop;

	// Ensures the passed in object is, in fact, an Object.
	// When `null` or `undefined` are passed in, ensure() returns a new Object
	// created with `Object.create(null)`. Otherwise it returns the
	// passed in Object.
	function ensure(obj) {
		return obj == void 0 ? {} : obj; // eslint-disable-line eqeqeq
	}
	BRIXX.ensure = ensure;

	// Calls `Object.freeze()` recursively on the passed in Object.
	// deepFreeze() will skip the `arguemnts`, `caller`, `callee` and `prototype`
	// properties of a Function. deepFreeze() will throw if passed null or
	// undefined just like `Object.freeze()` would.
	function deepFreeze(obj) {
		Object.freeze(obj);
		Object.getOwnPropertyNames(obj).forEach(function (key) {
			if (typeof obj === 'function' &&
					(key === 'arguments' ||
						key === 'caller' ||
						key === 'callee' ||
						key === 'prototype')) {
				return;
			}

			var prop = obj[key];
			if (prop !== null &&
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
		return !(obj == void 0 || typeof obj == 'number' && isNaN(obj)); // eslint-disable-line eqeqeq
	}
	BRIXX.exists = exists;

	return BRIXX;
}));
