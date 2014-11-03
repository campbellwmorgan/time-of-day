###
#
# TimeOfDay.js
#
# Licence MIT : http://opensource.org/licenses/MIT
# Copyright Campbell Morgan <campbellmorgan@gmail.com> 2014
#
# github.com/campbellwmorgan/time-of-day
#
###
moment = require 'moment'
elementClass = require 'element-class'

class TimeOfDay
  defs:
    elements: []

    class: 'item-active'

    timesOfDay:
      night:
        from: '22:30'
        to: '06:30'
      morning:
        from: '06:30'
        to: '12:00'
      lunch:
        from: '12:00'
        to: '14:30'
      afternoon:
        from: '14:30'
        to: '17:30'
      evening:
        from: '17:30'
        to: '22:30'

  #override for testing
  elementClass: elementClass

  constructor: (config) ->
    @_extendConfig config

    # evaluate each element
    @_evaluateElements()


  _extendConfig: (config) =>
    @opts = {}
    config = {} unless config?
    for setting, value of @defs
      @opts[setting] = if setting of config
      then config[setting]
      else value
    @opts

  ###
  Are we in the current time period
  @param {Moment} current time
  @param {Object} Time Range
  ###
  _inPeriod: (time, period)=>
    # get the current day
    day = time.format 'YYYY-MM-DD'

    from = @_createMoment day, period.from

    to = @_createMoment day, period.to

    return false if time > to

    # reject if start time is
    # less than end time (ie start time is
    # same day as end time) and time is
    # before start time
    return false if (from < to) and (
      time < from
    )

    true


  ###
  Creates a moment
  from an hour
  @param {string} day '2014-11-05'
  @param {string} hour 'hh:mm'
  @return {Moment}
  ###
  _createMoment: (dayString, hour) ->
    moment(
      "#{dayString} #{hour}",
      "YYYY-MM-DD hh:mm"
    )


  ###
  Cycles through each element
  and adds active class to any
  element where time matches
  ###
  _evaluateElements: =>
    return unless @opts.elements.length

    now = moment()

    for el in @opts.elements
      period = @_getPeriod el
      continue unless period
      # ignore if period not in list
      continue unless @_inPeriod now, period.period

      # add the active class to the element
      @elementClass(el).addClass @opts.class
      # add a class with the active timeperiod
      # to the element
      @elementClass(el).addClass period.name + "-active"


  ###
  Checks the list of options
  and returns the matching period
  or false if period not found
  @param {DOM Element}
  @return {Object}
  ###
  _getPeriod : (el) =>
    # get time of day setting
    timeOfDay = el.getAttribute 'data-time-of-day'
    # ignore if no timeOfDay tag
    return false unless timeOfDay

    unless timeOfDay of @opts.timesOfDay
      throw new Error( timeOfDay +
        " not found in available periods"
      )
      return false

    time =
      period: @opts.timesOfDay[timeOfDay]
      name: timeOfDay


module.exports = TimeOfDay
