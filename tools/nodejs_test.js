#!/usr/bin/env node
'use strict';

var
Promise          = require('bluebird'),
LintRunner       = require('./lint_runner'),
NodeJSTestRunner = require('./nodejs_test_runner');


exports.main = function () {
  return Promise.resolve(Object.create(null))
    .then(LintRunner.main)
    .then(NodeJSTestRunner.main);
};

if (require.main === module) {
  exports.main()
    .then(function () {
      console.log('nodejs_test run succeeded :)');
    })
    .catch(function (err) {
      console.error('nodejs_test run failed due to an upstream error.');
      console.error(err.stack || err.message || err);
    });
}
