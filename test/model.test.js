/*
global expect, BRIXX
*/

/* jshint ignore:start */
if (typeof require === 'function' && typeof window === 'undefined') {
  expect = require('expect.js');
  BRIXX  = require('../index');
}
/* jshint ignore:end */

describe('.Model', function () {
  'use strict';

  describe('with default values', function () {
    var VAL = Object.create(null);

    before(function () {
      VAL.createWidget = BRIXX.factory(BRIXX.Model, {
        name: 'Widget',
        idAttribute: '_id',

        defaults: {
          _id    : null,
          width  : 5,
          height : 2
        },

        area: function () {
          return this.width * this.height;
        }
      });

      VAL.widget = VAL.createWidget();

      Object.freeze(VAL);
    });
    it('has a name', function () {
      expect(VAL.widget.name).to.be('Widget');
    });
    it('has custom toString()', function () {
      expect(VAL.widget.toString())
        .to.be('Widget { name: "Widget", _id: null, width: 5, height: 2 }');
    });
    it('does not have an id', function () {
      expect(VAL.widget._id).to.be(null);
      expect(VAL.widget.hasId()).to.be(false);
    });
    it('can set id', function () {
      var widget = VAL.createWidget({
        _id: 0
      });
      expect(widget._id).to.be(0);
      expect(widget.hasId()).to.be(true);
    });
    it('has default properties', function () {
      expect(VAL.widget.width).to.be(5);
      expect(VAL.widget.height).to.be(2);
    });
    it('can define properties on initialization', function () {
      var widget = VAL.createWidget({
        width: 4,
        height: 4,
        depth: 4
      });

      expect(widget.width).to.be(4);
      expect(widget.height).to.be(4);

      // Undefined properties are ignored
      expect(typeof widget.depth).to.be('undefined');

      // After setting a new value
      widget = widget.set({height: 8});
      expect(widget.width).to.be(4);
      expect(widget.height).to.be(8);
    });
    it('is mostly immutable', function () {
      expect(VAL.widget.width).to.be(5);
      var widget2 = VAL.widget.set({width: 2});
      expect(VAL.widget.width).to.be(5);
      expect(VAL.widget).not.to.be(widget2);
      expect(function () {
        widget2.height = 10;
      }).to.throwException(/Cannot set by reference on an immutable record/);
    });
    it('can set properties with setter', function () {
      expect(VAL.widget.width).to.be(5);
      expect(VAL.widget.set({width: 2}).width).to.be(2);
    });
    it('cannot set undefined property keys', function () {
      expect(function () {
        VAL.widget.set({area: 45});
      }).to.throwException(/Cannot set undefined key "area" on Widget/);
    });
    it('can get a diff', function () {
      var widget2 = VAL.widget.set({height: 10});
      var widget3 = VAL.createWidget({
        width: 16,
        depth: 2
      });

      expect(VAL.widget.diff(VAL.widget)).to.be(null);
      expect(VAL.widget.diff({name: 'Widget', _id: null, width: 5, height: 2}))
        .to.be(null);

      var diff1 = VAL.widget.diff(widget2);
      expect(diff1.length).to.be(1);
      expect(diff1[0][0]).to.be('height');
      expect(diff1[0][1]).to.be(2);
      expect(diff1[0][2]).to.be(10);

      var diff2 = VAL.widget.diff(widget3);
      expect(diff2.length).to.be(1);
      expect(diff2[0][0]).to.be('width');
      expect(diff2[0][1]).to.be(5);
      expect(diff2[0][2]).to.be(16);
    });
    it('can have defined methods', function () {
      expect(VAL.widget.area()).to.be(10);
      var widget2 = VAL.widget.set({height: 10});
      expect(widget2.area()).to.be(50);
    });
    it('has toJSON() method', function () {
      var attrs = VAL.widget.toJSON();
      expect(attrs.width).to.be(5);
      expect(attrs.height).to.be(2);
      expect(typeof attrs.area).to.be('undefined');
    });
    it('can be used as POJO', function () {
      var widget = VAL.createWidget({
        width: 4,
        height: 4,
        depth: 4
      });
      widget = widget.set({height: 6});
      var keys = Object.keys(widget);
      expect(widget.width).to.be(4);
      expect(widget.height).to.be(6);
      expect(typeof widget.depth).to.be('undefined');
      expect(keys.length).to.be(4);
      expect(keys.indexOf('name') >= 0).to.be.ok();
      expect(keys.indexOf('_id') >= 0).to.be.ok();
      expect(keys.indexOf('width') >= 0).to.be.ok();
      expect(keys.indexOf('height') >= 0).to.be.ok();
      expect(widget.hasOwnProperty('name')).to.be.ok();
      expect(widget.hasOwnProperty('_id')).to.be.ok();
      expect(widget.hasOwnProperty('width')).to.be.ok();
      expect(widget.hasOwnProperty('height')).to.be.ok();
    });
    it('has a JSON representation', function () {
      var widget = VAL.widget.set({height: 6});
      widget.foo = 'bar';
      expect(JSON.stringify(widget))
        .to.be('{"name":"Widget","_id":null,"width":5,"height":6}');
    });
  });
});
