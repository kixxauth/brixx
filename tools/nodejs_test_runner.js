#!/usr/bin/env node
'use strict';

var
CP       = require('child_process'),
FilePath = require('filepath').FilePath,
Promise  = require('bluebird');

exports.main = function () {
  return new Promise(function (resolve, reject) {
    var
    proc,
    exec   = FilePath.create().append('node_modules', '.bin', 'mocha'),
    target = FilePath.create().append('test');

    proc = CP.spawn(exec.toString(), [
      '--colors',
      '--recursive',
      target.toString()
    ]);

    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on('close', function (code) {
      if (code === 0) {
        return resolve(0);
      }
      return reject(new Error('Failed mocha tests'));
    });
  });
};


if (require.main === module) {
  exports.main()
    .then(function () {
      console.log('nodejs_test_runner succeeded :)');
    })
    .catch(function (err) {
      console.error('nodejs_test_runner run failed:');
      console.error(err.stack || err.message || err);
    });
}
