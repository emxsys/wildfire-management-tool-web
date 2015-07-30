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
        Log,
        WmtUtil,
        Wmt) {
        "use strict";
        var SolarResource = {
            /**
             * Gets the sunlight at the given location for the given time.
             * @param {Number} latitude
             * @param {Number} longitude
             * @param {Date} datetime
             * @param {Function(JSON)} callback Receives sunlight JSON object. JSON Example:
             *  {
             *      "observerTime": "2015-07-04T05:19:51.278-07:00[America/Los_Angeles]",
             *      "observerLatitude": {"type": "Latitude", "value": "34.2", "unit": "deg"},
             *      "observerLongitude": {"type": "Longitude", "value": "-119.2", "unit": "deg"},
             *      "observerAltitude": {"type": "Altitude", "value": "0.0", "unit": "m"},
             *      "subsolarLatitude": {"type": "subsolar_lat:deg", "value": "22.871266284130332", "unit": "deg"},
             *      "subsolarLongitude": {"type": "subsolar_lon:deg", "value": "-3.8697908736235718", "unit": "deg"},
             *      "azimuthAngle": {"type": "azimuth:deg", "value": "56.89353027163992", "unit": "deg"},
             *      "altitudeAngle": {"type": "altitude:deg", "value": "-6.175449369022366", "unit": "deg"},
             *      "zenithAngle": {"type": "zenith:deg", "value": "96.17544936902236", "unit": "deg"},
             *      "localHourAngle": {"type": "hour:deg", "value": "244.66979087362358", "unit": "deg"},
             *      "sunriseHourAngle": {"type": "sunrise_hour:deg", "value": "-107.86718940052833", "unit": "deg"},
             *      "sunsetHourAngle": {"type": "sunset_hour:deg", "value": "107.83565447548936", "unit": "deg"},
             *      "sunriseTime": "05:49:57-07:00",
             *      "sunsetTime": "20:12:25-07:00",
             *      "sunTransitTime": "13:01:13-07:00"
             *  }
             * 
             */
            sunlightAtLatLonTime: function (latitude, longitude, datetime, callback) {

                var url = WmtUtil.currentDomain() + Wmt.SUNLIGHT_REST_SERVICE,
                    query = "mime-type=application/json"
                    + "&time=" + this.toOffsetTime(datetime)
                    + "&latitude=" + latitude
                    + "&longitude=" + longitude;
                console.log(url + '?' + query);
                $.get(url, query, callback);

            },
            /**
             * 
             * @param {Date} date 
             * @returns {String}
             */
            toOffsetTime: function (date) {
                return date.getFullYear() +
                    '-' + this.pad(date.getMonth() + 1) +
                    '-' + this.pad(date.getDate()) +
                    'T' + this.pad(date.getHours()) +
                    ':' + this.pad(date.getMinutes()) +
                    ':' + this.pad(date.getSeconds()) +
                    this.formatOffset(date.getTimezoneOffset());
            },
            /**
             * @param {Number} offset Timezone offset in minutes
             * @returns {String} [+/-]HH:MM string. Note the "+" sign must be encoded
             * as %2b to ensure it is not interpreted as a space at the server.
             */
            formatOffset: function (offset) {
                var total = Math.abs(offset),
                    hours = Math.floor(total / 60),
                    minutes = total - (hours * 60);
                return (offset < 0 ? "%2b" : "-") + this.pad(hours) + ":" + this.pad(minutes);
            },
            pad: function (value) {
                var n = Math.abs(value);
                return (n < 10) ? ("0" + n) : n;
            }
        };
        return SolarResource;
    }
);