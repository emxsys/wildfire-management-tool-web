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
define([
    '../../thirdparty/webworldwind/util/WWMath'],
    function (
        WWMath) {
        "use strict";
        /**
         * Provides useful utilities specicially for WMT.
         * @exports WmtUtil
         */
        var WmtUtil = {
            /**
             * Returns a number formatted as decimal degrees: [+/-]DD.DDDD°.
             * @param {Number} number The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as decimal degrees.
             */
            formatDecimalDegrees: function (number, decimals) {
                return number.toFixed(decimals) + "\u00b0";
            },
            /**
             * Returns a number formatted as decimal minutes: [+/-]DD°MM.MMM'
             * @param {Number} number The value to be formatted.
             * @param {Number} decimals The number decimal places for minutes.
             * @returns {String} The number formatted as decimal degrees.
             */
            formatDecimalMinutes: function (number, decimals) {
                // Truncate degrees, keeping the sign.
                var degrees = Math.floor(number) + (number < 0 ? 1 : 0);
                var minutes = WorldWind.WWMath.fabs(number - degrees) * 60;
                return degrees + "\u00b0" + minutes.toFixed(decimals) + "\'";
            },
            /**
             * Returns a number formatted as degrees-minutes-seconds: [+/-]DD°MM'SS.SS".
             * @param {Number} number The value to be formatted.
             * @param {Number} decimals The number decimal places for seconds.
             * @returns {String} The number formatted as decimal degrees.
             */
            formatDegreesMinutesSeconds: function (number, decimals) {
                // Truncate degrees, keeping the sign.
                var degrees = Math.floor(number) + (number < 0 ? 1 : 0);
                var minutesNum = WorldWind.WWMath.fabs(number - degrees) * 60;
                var minutesInt = Math.floor(minutesNum);
                var seconds = WorldWind.WWMath.fabs(minutesNum - minutesInt) * 60;
                return degrees + "\u00b0" + minutesInt + "\'" + seconds.toFixed(decimals) + "\"";
            },
            /**
             * Returns a number formatted as decimal degrees latitude: DD.DDDD°[N/S].
             * @param {Number} latitude The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as decimal degrees latitude.
             */
            formatDecimalDegreesLat: function (latitude, decimals) {
                var number = WorldWind.WWMath.fabs(latitude);
                return this.formatDecimalDegrees(number, decimals) + (latitude >= 0 ? "N" : "S");
            },
            /**
             * Returns a number formatted as decimal degrees longitude: DD.DDDD°[E/W].
             * @param {Number} longitude The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as decimal degrees longitude.
             */
            formatDecimalDegreesLon: function (longitude, decimals) {
                var number = WorldWind.WWMath.fabs(longitude);
                return this.formatDecimalDegrees(number, decimals) + (longitude >= 0 ? "E" : "W");
            },
            /**
             * Returns a number formatted as decimal minutes latitude: DD°MM.MMM[N/S].
             * @param {Number} latitude The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as decimal degrees latitude.
             */
            formatDecimalMinutesLat: function (latitude, decimals) {
                var number = WorldWind.WWMath.fabs(latitude);
                return this.formatDecimalMinutes(number, decimals) + (latitude >= 0 ? "N" : "S");
            },
            /**
             * Returns a number formatted as decimal minutes longitude: DD°MM.MMM'[E/W].
             * @param {Number} longitude The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as decimal degrees longitude.
             */
            formatDecimalMinutesLon: function (longitude, decimals) {
                var number = WorldWind.WWMath.fabs(longitude);
                return this.formatDecimalMinutes(number, decimals) + (longitude >= 0 ? "E" : "W");
            },
            /**
             * Returns a number formatted as degrees, minutes, seconds latiude: DD°[N/S].
             * @param {Number} latitude The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as decimal degrees longitude.
             */
            formatDMSLatitude: function (latitude, decimals) {
                var number = WorldWind.WWMath.fabs(latitude);
                return this.formatDegreesMinutesSeconds(number, decimals) + (latitude >= 0 ? "N" : "S");
            },
            /**
             * Returns a number formatted as degrees, minutes, seconds longitude: DD°[E/W].
             * @param {Number} longitude The value to be formatted.
             * @param {Number} decimals The number decimal places.
             * @returns {String} The number formatted as decimal degrees longitude.
             */
            formatDMSLongitude: function (longitude, decimals) {
                var number = WorldWind.WWMath.fabs(longitude);
                return this.formatDegreesMinutesSeconds(number, decimals) + (longitude >= 0 ? "E" : "W");
            }
        };
        return WmtUtil;
    }
);