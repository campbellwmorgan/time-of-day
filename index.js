
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

(function() {
  var TimeOfDay, elementClass, moment,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  moment = require('moment');

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
    @param {Moment} current time
    @param {Object} Time Range
     */

    TimeOfDay.prototype._inPeriod = function(time, period) {
      var day, from, to;
      day = time.format('YYYY-MM-DD');
      from = this._createMoment(day, period.from);
      to = this._createMoment(day, period.to);
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
    Creates a moment
    from an hour
    @param {string} day '2014-11-05'
    @param {string} hour 'hh:mm'
    @return {Moment}
     */

    TimeOfDay.prototype._createMoment = function(dayString, hour) {
      return moment("" + dayString + " " + hour, "YYYY-MM-DD hh:mm");
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
      now = moment();
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

    return TimeOfDay;

  })();

  module.exports = TimeOfDay;

}).call(this);
