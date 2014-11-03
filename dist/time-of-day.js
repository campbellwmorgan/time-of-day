(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*
Build for standalone library
 */
window.TimeOfDay = require('../lib/timeOfDay.coffee');



},{"../lib/timeOfDay.coffee":2}],2:[function(require,module,exports){

/*
 *
 * TimeOfDay.js
 *
 * Licence MIT : http://opensource.org/licenses/MIT
 * Copyright Campbell Morgan <campbellmorgan@gmail.com> 2014
 *
 * github.com/campbellwmorgan/time-of-day
 *
 */
var TimeOfDay, elementClass,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

elementClass = require('element-class');

TimeOfDay = (function() {
  TimeOfDay.prototype.defs = {
    elements: [],
    className: 'item-active',
    timesOfDay: {
      night: {
        from: '22:30',
        to: '06:30'
      },
      morning: {
        from: '06:30',
        to: '12:00'
      },
      lunch: {
        from: '12:00',
        to: '14:30'
      },
      afternoon: {
        from: '14:30',
        to: '17:30'
      },
      evening: {
        from: '17:30',
        to: '22:30'
      }
    }
  };

  TimeOfDay.prototype.elementClass = elementClass;

  function TimeOfDay(config) {
    this._getMinutesSinceMidnight = __bind(this._getMinutesSinceMidnight, this);
    this._getPeriod = __bind(this._getPeriod, this);
    this._evaluateElements = __bind(this._evaluateElements, this);
    this._inPeriod = __bind(this._inPeriod, this);
    this._extendConfig = __bind(this._extendConfig, this);
    this._extendConfig(config);
    this._evaluateElements();
  }

  TimeOfDay.prototype._extendConfig = function(config) {
    var setting, value, _ref;
    this.opts = {};
    if (config == null) {
      config = {};
    }
    _ref = this.defs;
    for (setting in _ref) {
      value = _ref[setting];
      this.opts[setting] = setting in config ? config[setting] : value;
    }
    return this.opts;
  };


  /*
  Are we in the current time period
  @param {Date} current time
  @param {Object} Time Range
   */

  TimeOfDay.prototype._inPeriod = function(timeNow, period) {
    var from, time, to;
    time = this._getMinutesSinceMidnight(timeNow);
    from = this._getMinutesSinceMidnight(period.from);
    to = this._getMinutesSinceMidnight(period.to);
    if (from < to) {
      if (time > to) {
        return false;
      }
      if (time < from) {
        return false;
      }
    } else {
      if (time > to && time < from) {
        return false;
      }
    }
    return true;
  };


  /*
  Cycles through each element
  and adds active class to any
  element where time matches
   */

  TimeOfDay.prototype._evaluateElements = function() {
    var el, now, period, _i, _len, _ref, _results;
    if (!this.opts.elements.length) {
      return;
    }
    now = new Date();
    _ref = this.opts.elements;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      period = this._getPeriod(el);
      if (!period) {
        continue;
      }
      if (!this._inPeriod(now, period.period)) {
        continue;
      }
      this.elementClass(el).add(this.opts.className);
      _results.push(this.elementClass(el).add(period.name + "-active"));
    }
    return _results;
  };


  /*
  Checks the list of options
  and returns the matching period
  or false if period not found
  @param {DOM Element}
  @return {Object}
   */

  TimeOfDay.prototype._getPeriod = function(el) {
    var time, timeOfDay;
    timeOfDay = el.getAttribute('data-time-of-day');
    if (!timeOfDay) {
      return false;
    }
    if (!(timeOfDay in this.opts.timesOfDay)) {
      throw new Error(timeOfDay + " not found in available periods");
      return false;
    }
    return time = {
      period: this.opts.timesOfDay[timeOfDay],
      name: timeOfDay
    };
  };

  TimeOfDay.prototype._getMinutesSinceMidnight = function(time) {
    var hoursMins, matches;
    if (time == null) {
      time = new Date();
    }
    matches = time.toString().match(/\d\d\:\d\d[^ ]?/);
    if (!matches.length) {
      return 0;
    }
    hoursMins = matches[0];
    return this._convertHoursMinsToMins(hoursMins);
  };

  TimeOfDay.prototype._convertHoursMinsToMins = function(hoursMins) {
    var hours, mins;
    hours = parseInt(hoursMins.replace(/\:.*$/, ''));
    mins = parseInt(hoursMins.replace(/^[^\:]+\:/, ''));
    return (hours * 60) + mins;
  };

  return TimeOfDay;

})();

module.exports = TimeOfDay;



},{"element-class":3}],3:[function(require,module,exports){
module.exports = function(opts) {
  return new ElementClass(opts)
}

function ElementClass(opts) {
  if (!(this instanceof ElementClass)) return new ElementClass(opts)
  var self = this
  if (!opts) opts = {}

  // similar doing instanceof HTMLElement but works in IE8
  if (opts.nodeType) opts = {el: opts}

  this.opts = opts
  this.el = opts.el || document.body
  if (typeof this.el !== 'object') this.el = document.querySelector(this.el)
}

ElementClass.prototype.add = function(className) {
  var el = this.el
  if (!el) return
  if (el.className === "") return el.className = className
  var classes = el.className.split(' ')
  if (classes.indexOf(className) > -1) return classes
  classes.push(className)
  el.className = classes.join(' ')
  return classes
}

ElementClass.prototype.remove = function(className) {
  var el = this.el
  if (!el) return
  if (el.className === "") return
  var classes = el.className.split(' ')
  var idx = classes.indexOf(className)
  if (idx > -1) classes.splice(idx, 1)
  el.className = classes.join(' ')
  return classes
}

ElementClass.prototype.has = function(className) {
  var el = this.el
  if (!el) return
  var classes = el.className.split(' ')
  return classes.indexOf(className) > -1
}

},{}]},{},[1])