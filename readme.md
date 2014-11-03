Time Of Day.js
================

A javascript library for alternating classes on a dom
element based on the time of day


Installation
##

            npm install time-of-day --save


Usage
##

Javascript:

            var TimeOfDay = require('time-of-day');

            timeOfDayInstance = new TimeOfDay({

                // required - array of elements who's classes
                // will be modified
                elements: $('.items-to-change').get(),

                // class that gets appended
                // when the timezone on the user's computer
                // matches
                class: 'item-active',

                // optional times of day
                timesOfDay: {
                    morning: {
                        from: '03:00',
                        to: '12:00'
                    },
                    lunch: {
                        from: '12:00',
                        to: '16:00'
                    },
                    dinner: {
                        from: '16:00',
                        to: '23:00',
                    }
                }
            });


HTML:

            <div data-time-of-day="morning">
                <h1>It's Morning</h1>
            </div>
            <div data-time-of-day="lunch">
                <h1>It's Lunch Time</h1>
            </div>


Licence MIT

Copyright Campbell Morgan 2014
