/* 
 * Copyright (c) 2015, Bruce Schubert <bruce@emxsys.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     - Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *
 *     - Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 *     - Neither the name of Bruce Schubert, Emxsys nor the names of its 
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*global define*/

/**
 * The WeatherScout module.
 * 
 * @param {ContextSensitive} constextSensitive Adds context menu capability.
 * @param {Openable} openable Adds open capability.
 * @param {Log} log Logger.
 * @param {Messenger} messenger UI notifications.
 * @param {Movable} movable Adds move capabilities.
 * @param {PlaceResource} PlaceResource Gets place names.
 * @param {Removable} removable Adds remove capability.
 * @param {WeatherResource} WeatherResource Gets weather forecasts.
 * @param {WmtUtil} util Utilities.
 * @param {Wmt} wmt Constants.
 * @returns {WeatherScout}
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/util/ContextSensitive',
    'wmt/util/Openable',
    'wmt/util/Log',
    'wmt/util/Messenger',
    'wmt/util/Movable',
    'wmt/resource/PlaceResource',
    'wmt/util/Removable',
    'wmt/resource/WeatherResource',
    'wmt/util/WmtUtil',
    'wmt/Wmt'],
    function (
        contextSensitive,
        openable,
        log,
        messenger,
        movable,
        PlaceResource,
        removable,
        WeatherResource,
        util,
        wmt) {
        "use strict";

        var WeatherScout = function (name, duration, rules, latitude, longitude, id) {

            // Make movable by the SelectController: Fires the EVENT_OBJECT_MOVE... events.
            movable.makeMovable(this);

            // Make openable via menus: Fires the EVENT_OBJECT_OPENED event on success.
            openable.makeOpenable(this, function () {
                messenger.infoGrowl("The open feature has not been implemented yet.", "Sorry");
                return false;
            });
            // Make deletable via menu: Fires the EVENT_OBJECT_REMOVED event on success.
            removable.makeRemovable(this, function () {
                // TODO: Ask for confirmation; return false if veto'd
                return true;    // return true to fire a notification that allows the delete to proceed.
            });
            // Make context sensiive by the SelectController: shows the context menu.
            contextSensitive.makeContextSenstive(this, function() {
                messenger.infoGrowl("Show menu with delete, open, and lock/unlock", "TODO");                
            });

            /**
             * The unique id used to identify this particular weather object
             */
            this.id = id || util.guid();
            /**
             * The display name
             */
            this.name = name || 'Wx Scout';
            this.duration = duration || wmt.configuration.wxForecastDurationHours;
            this.latitude = latitude;
            this.longitude = longitude;

            this.rules = [];

            // Self subscribe to move operations so we can update the forecast and place
            // when the move is finished. We don't want to update during the move itself.
            this.on(wmt.EVENT_OBJECT_MOVE_FINISHED, this.refresh);

            // Perform initial update
            this.refresh();
        };

        WeatherScout.prototype.getFirstForecast = function () {
            return this.getForecastAt(null);
        };

        /**
         * Returns the forecast nearest the given time.
         * @param {Date} time The date/time used to select the forecast. If null, the first forecast is returned.
         * @returns {Object} The 
         *   {
         *       forecastTime: Date,
         *       airTempF: Number,
         *       relHumidityPct: Number,
         *       windSpdKts: Number,
         *       windDirDeg: Number,
         *       skyCoverPct: Number
         *   }
         */
        WeatherScout.prototype.getForecastAt = function (time) {
            if (!this.temporalWx || this.temporalWx.length === 0) {
                throw new Error(log.error('WeatherScout', 'getForecastAt', 'missingWeatherData'));
            }
            var wxTime,
                wxTimeNext,
                minutesSpan,
                minutesElapsed,
                forecast,
                i, max;

            // Use the earliest forecast if time arg is not provided
            if (!time) {
                forecast = this.temporalWx[0];
            }
            else {
                for (i = 0, max = this.temporalWx.length; i < max; i++) {
                    wxTime = this.temporalWx[i].time;
                    if (time.getTime() < wxTime.getTime()) {    // compare millisecs from epoch
                        break;
                    }
                    if (i === max - 1) {
                        // This is the last wx entry. Use it!
                        break;
                    }
                    // Take a peek at the next entry's time 
                    wxTimeNext = this.temporalWx[i + 1].time;
                    minutesSpan = util.minutesBetween(wxTime, wxTimeNext);
                    minutesElapsed = util.minutesBetween(wxTime, time);
                    if (minutesElapsed < (minutesSpan / 2)) {
                        break;
                    }
                }
                forecast = this.temporalWx[i];
            }
            return {
                time: forecast.time,
//                types: this.range,
//                values: forecast.values
                airTemperatureF: forecast.values[0],
                relaltiveHumidityPct: forecast.values[1],
                windSpeedKts: forecast.values[2],
                windDirectionDeg: forecast.values[3],
                skyCoverPct: forecast.values[4]
            };
        };

        /**
         * Updates the weather lookout's weather forecast and location. 
         */
        WeatherScout.prototype.refresh = function () {
            this.refreshForecast();
            this.refreshPlace();
        };

        /**
         * Updates this object's weather attribute. 
         */
        WeatherScout.prototype.refreshForecast = function () {
            if (!this.latitude || !this.longitude || !this.duration) {
                return;
            }
            var self = this;

            // Get the weather forecast at this location
            WeatherResource.pointForecast(
                this.latitude,
                this.longitude,
                this.duration,
                function (json) { // Callback to process JSON result
                    self.processForecast(json);
                    self.fire(wmt.EVENT_WEATHER_CHANGED, self);
                }
            );
        };

        /**
         * Updates this object's place attributes. 
         */
        WeatherScout.prototype.refreshPlace = function () {
            if (!this.latitude || !this.longitude || !this.duration) {
                return;
            }
            var self = this,
                i, max, item, place = [];

            // Get the place name(s) at this location
            PlaceResource.places(
                this.latitude,
                this.longitude,
                function (json) { // Callback to process YQL Geo.Places result

                    // Load all the places into a place object array
                    for (i = 0, max = json.query.results.place.length; i < max; i++) {
                        item = json.query.results.place[i];
                        place[i] = {"name": item.name, "type": item.placeTypeName.content};
                    }
                    self.place = place;

                    // Apply the first place name (ordered by granularity) that's not a zip code
                    for (i = 0, max = place.length; i < max; i++) {
                        if (place[i].type !== "Zip Code") {
                            self.placeName = place[i].name;
                            
                            // Until we have an editor, use the placename for the name
                            self.name = self.placeName;
                            break;
                        }
                    }
                    self.fire(wmt.EVENT_PLACE_CHANGED, self);
                }
            );
        };

        /**
         * 
         * @param {type} json
         */
        WeatherScout.prototype.processForecast = function (json) {
            //Log.info('WeatherScout', 'processForecast', JSON.stringify(json));

            var isoTime, i, max;

            this.wxForecast = json;
            this.temporalWx = this.wxForecast.spatioTemporalWeather.spatialDomain.temporalDomain.temporalWeather;
            this.range = this.wxForecast.spatioTemporalWeather.range;

            // Add a Date object to each temporal entry
            for (i = 0, max = this.temporalWx.length; i < max; i++) {
                // .@time doesn't work because of the '@', so we use ['@time']
                isoTime = this.temporalWx[i]['@time'];
                this.temporalWx[i].time = new Date(isoTime);
            }
        };

        return WeatherScout;

    }

);

