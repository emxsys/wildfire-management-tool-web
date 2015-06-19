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

/*global define, WorldWind*/

/**
 * Common utiltities module for WMT.
 * @author Bruce Schubert
 * @module {util/WmtUtil}
 */
define(['../../nasa/WorldWind'],
    function (ww) {
        "use strict";
        var WmtUtil = {
            METERS_TO_FEET: 3.28084,
            METERS_TO_MILES: 0.000621371,
            MILLISECS_TO_MINUTES: 1 / (1000 * 60),
            MILLISECS_TO_HOURS: 1 / (1000 * 60 * 60),
            /**
             * Gets the computed linear distance in meters between two lat/lons.
             * @param {Number} lat1 First latitude in degrees.
             * @param {Number} lon1 First longitude in degrees.
             * @param {Mumber} lat2 Second latitude in degrees.
             * @param {Number} lon2 Second longitude in degrees.
             * @returns {Number} Distance in meters between the two coordinates.
             */
            distanceBetweenLatLons: function (lat1, lon1, lat2, lon2) {
                var angleRad = WorldWind.Location.linearDistance(
                    new WorldWind.Location(lat1, lon1),
                    new WorldWind.Location(lat2, lon2));
                return angleRad * WorldWind.EARTH_RADIUS;
            },
            /**
             * Gets the number of minutes between two times.
             * @param {Date} time1
             * @param {Date} time2
             * @returns {Number} Minutes (floating point).
             */
            minutesBetween: function (time1, time2) {
                return Math.abs(time1.getTime() - time2.getTime()) * this.MILLISECS_TO_MINUTES;
            },
            /**
             * Gets the number of minutes between two times.
             */
            /**
             * Gets the current domain from the active browser window.
             * @returns {String} E.g., returns http://emxsys.com from http://emxsys.com/documentation/index.html
             */
            currentDomain: function () {
                return window.location.protocol + "//" + window.location.host;
            }
        };
        return WmtUtil;
    }
);

