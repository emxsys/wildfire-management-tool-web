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
 *     - Neither the name of Bruce Schubert,  nor the names of its 
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

/*global define, $ */

define([
    'wmt/util/Log',
    'wmt/util/WmtUtil',
    'wmt/Wmt'],
    function (
        log,
        util,
        wmt) {
        "use strict";
        var WeatherResource = {
            /**
             * Creates a weather tuple that is compatible with the SurfaceFireResource.
             * 
             * @param {Object} wx A weather object from the WeatherScout
             * @return {JSON} Example: 
             *  {
             *      "airTemperature":{"type":"air_temp:F","value":"65.0","unit":"fahrenheit"},
             *      "relativeHumidity":{"type":"rel_humidity:%","value":"20.0","unit":"%"},
             *      "windSpeed":{"type":"wind_speed:kts","value":"15.0","unit":"kt"},
             *      "windDirection":{"type":"wind_dir:deg","value":"270.0","unit":"deg"},
             *      "cloudCover":{"type":"cloud_cover:%","value":"10.0","unit":"%"}
             *  }
             */
            makeTuple: function (wx) {
                return JSON.parse('{' +
                    '"airTemperature":{"type":"air_temp:F","value":"' + wx.airTemperatureF + '","unit":"fahrenheit"},' +
                    '"relativeHumidity":{"type":"rel_humidity:%","value":"' + wx.relaltiveHumidityPct + '","unit":"%"},' +
                    '"windSpeed":{"type":"wind_speed:kts","value":"' + wx.windSpeedKts + '","unit":"kt"},' +
                    '"windDirection":{"type":"wind_dir:deg","value":"' + wx.windDirectionDeg + '","unit":"deg"},' +
                    '"cloudCover":{"type":"cloud_cover:%","value":"' + wx.skyCoverPct + '","unit":"%"}' +
                    '}');
            },
            /**
             * Gets a weather tuple that is compatible with the SurfaceFireResource.
             * 
             * @param {Number} airTempF Air temperature in Fahrenheit.
             * @param {Number} relHum Relative Humidity in percent.
             * @param {Number} windSpdKts Wind speed in knots.
             * @param {Number} windDir Wind direction in degrees
             * @param {Number} clouds Cloud/sky cover in percent
             * @param {Function(JSON)} callback Receives a WeatherTuple JSON object. 
             * Example: 
             *  {
             *      "airTemperature":{"type":"air_temp:F","value":"65.0","unit":"fahrenheit"},
             *      "relativeHumidity":{"type":"rel_humidity:%","value":"20.0","unit":"%"},
             *      "windSpeed":{"type":"wind_speed:kts","value":"15.0","unit":"kt"},
             *      "windDirection":{"type":"wind_dir:deg","value":"270.0","unit":"deg"},
             *      "cloudCover":{"type":"cloud_cover:%","value":"10.0","unit":"%"}
             *  }
             */
            weatherTuple: function (airTempF, relHum, windSpdKts, windDir, clouds, callback) {
                // TODO: assert input values
                var url = util.currentDomain() + wmt.WEATHER_REST_SERVICE,
                    query = "mime-type=application/json"
                    + "&airTemperature=" + airTempF
                    + "&relativeHumidity=" + relHum
                    + "&windSpeed=" + windSpdKts
                    + "&windDirection=" + windDir
                    + "&cloudCover=" + clouds;
                console.log(url + '?' + query);
                $.get(url, query, callback);
            },
            /**
             * 
             * @param {Number} latitude
             * @param {Number} longitude
             * @param {Number} duration
             * @param {Function(JSON)} callback Receives a weather forecast JSON object.
             */
            pointForecast: function (latitude, longitude, duration, callback) {
                // TODO: assert input values
                var url = util.currentDomain() + wmt.WEATHER_REST_SERVICE + '/pointforecast',
                    query = "mime-type=application/json"
                    + "&latitude=" + latitude
                    + "&longitude=" + longitude
                    + "&duration=" + duration;
                console.log(url + '?' + query);
                $.get(url, query, callback);
            }
        };
        return WeatherResource;
    }
);