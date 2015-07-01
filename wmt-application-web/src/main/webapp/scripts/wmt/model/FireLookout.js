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

define([
    'wmt/util/Openable',
    'wmt/util/Log',
    'wmt/util/Messenger',
    'wmt/util/Movable',
    'wmt/resource/PlaceResource',
    'wmt/util/Removable',
    'wmt/resource/WeatherResource',
    'wmt/model/WeatherScout',
    'wmt/util/WmtUtil',
    'wmt/Wmt'],
    function (
        openable,
        log,
        messenger,
        movable,
        PlaceResource,
        removable,
        WeatherResource,
        WeatherScout,
        util,
        wmt) {
        "use strict";

        var FireLookout = function (name, latitude, longitude, id) {
            
            // Inherit the weather forecasting capabilites of the WeatherScout
            WeatherScout.call(this, name, 24, null, latitude, longitude, id);

             // Override the WeatherScout name set by the parent
            this.name = name || 'Fire Lookout';

        };
        FireLookout.prototype = Object.create(WeatherScout.prototype);
        

        /**
         * Updates the weather lookout's weather forecast and location. 
         */
        FireLookout.prototype.refresh = function () {
            this.refreshForecast();
            this.refreshPlace();
        };

        /**
         * Updates this object's weather attribute. 
         */
        FireLookout.prototype.requestFireBehavior = function () {
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
                    self.processFireBehavior(json);
                    self.fire(wmt.EVENT_WEATHER_CHANGED, self);
                }
            );
        };


        /**
         * 
         * @param {type} json
         */
        FireLookout.prototype.processFireBehavior = function (json) {
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

        return FireLookout;

    }

);

