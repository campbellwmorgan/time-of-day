moment = require 'moment'
TimeOfDay = require '../lib/timeOfDay'

class TimeOfDayMock extends TimeOfDay
  constructor: ->


describe "TimeOfDay", ->

  tOD = false

  beforeEach ->
   tOD = new TimeOfDayMock()


  describe "extendConfig", ->

    it "should merge config with the defaults and add to opts", ->

      tOD._extendConfig
        elements: ['item2']

      expect(tOD.opts.elements[0])
        .toBe 'item2'

      expect(tOD.opts.timesOfDay.night.from)
       .toBe '22:30'


  describe "_inPeriod", ->

    it "should correctly match a given time with a period", ->
      time = moment("2012-03-10 12:00", "YYYY-MM-DD hh:mm")

      period1=
        from: '08:00'
        to: '10:00'

      expect(tOD._inPeriod(time, period1))
        .toBe false

      period2 =
        from: '08:00'
        to: '12:01'

      expect(tOD._inPeriod(time, period2))
        .toBe true

      period3 =
        from: '13:00'
        to: '16:00'

      expect(tOD._inPeriod(time, period3))
        .toBe false

      period4 =
        from: '22:00'
        to: '13:00'

      expect(tOD._inPeriod(time, period4))
        .toBe true

      period5 =
        from: '22:00'
        to: '11:00'

      expect(tOD._inPeriod(time, period5))
        .toBe false



  describe "_evaluateElements", ->

    it "should call add class on all elements where period matches", ->

      elements = ['one', 'two', 'three']
      classContr =
        addClass: (className) ->

      spyOn classContr, 'addClass'
      tOD.elementClass = (el) ->
        classContr

      tOD._getPeriod = (el) ->
        if el is 'one'
          return name: 'testa', period: 'one'
        if el is 'two'
          return name: 'testb', period: 'two'
        return false

      tOD._inPeriod = (time, period)->
        return true if period is 'one'
        false

      tOD.opts =
        elements: elements
        class: 'item-active'

      tOD._evaluateElements()

      expect(classContr.addClass)
        .toHaveBeenCalledWith 'item-active'

      expect(classContr.addClass)
        .toHaveBeenCalledWith 'testa-active'

      expect(classContr.addClass)
        .not
        .toHaveBeenCalledWith 'testb-active'


  describe "_getPeriod", ->
    it "should return false if attribute is null", ->
      el =
        getAttribute : ->
          null

      expect(tOD._getPeriod(el))
        .toBe false

    it "Should throw an error if attribute time of day not in definitions", ->

      el =
        getAttribute: ->
          'morning'

      tOD.opts =
        timesOfDay :
          afternoon:
            from: '12:00'
            to: '15:00'

      try
        expect(tOD._getPeriod(el))
          .toBe false
      catch e
        expect(e.message).toBe(
          'morning not found in available periods'
        )

    it "should return an object of correct element", ->

      el=
        getAttribute: ->
          'morning'

      tOD.opts =
        timesOfDay :
          morning:
            from: '08:00'
            to: '10:00'

      res = tOD._getPeriod(el)

      expect(res.name)
        .toBe 'morning'

      expect(res.period.from)
        .toBe '08:00'

