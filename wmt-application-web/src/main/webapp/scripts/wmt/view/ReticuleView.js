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

/**
 * The ReticuleView displays the position under the crosshairs.
 * 
 * @param {Object} Formatter
 * @param {Object} WorldWind
 * 
 * @author Bruce Schubert
 */
define([
    '../util/Formatter',
    '../../nasa/WorldWind'],
    function (
        Formatter,
        WorldWind) {
        "use strict";
        var ReticuleView = function (worldWindow) {
            //
            this.wwd = worldWindow;
        };

        /**
         * Handles the "reticuleMoved" event event generated by the Model.
         * @param {Terrain} terrain Terrain under the reticule.
         */
        ReticuleView.prototype.handleReticuleMoved = function (terrain) {

            var reticuleLat = $("#reticuleLatitude"),
                reticuleLon = $("#reticuleLongitude"),
                reticuleElev = $("#reticuleElevation"),
                reticuleAspect = $("#reticuleAspect"),
                reticuleSlope = $("#reticuleSlope");

            // Look for the DOM elements to update, and exit if none exist.
            if (!reticuleLat && !reticuleLon && !reticuleElev && !reticuleAspect && !reticuleSlope) {
                return;
            }

            // Update the DOM elements with the current terrain position.
            if (terrain) {
                reticuleLat.html(this.formatCoordinate(terrain.latitude));
                reticuleLon.html(this.formatCoordinate(terrain.longitude));
                reticuleElev.html(this.formatAltitude(terrain.elevation, "m"));
                reticuleAspect.html(Formatter.formatAngle360(terrain.aspect, 0));
                reticuleSlope.html(Formatter.formatAngle360(terrain.slope, 0));
            } else {
                reticuleLat.empty();
                reticuleLon.empty();
                reticuleElev.empty();
                reticuleAspect.empty();
                reticuleSlope.empty();
            }

            // Hide the terrain elevation coordinate and its associated label in 2D mode.
//            if (wwd.globe.is2D()) {
//                reticuleElev.parent().hide();
//                reticuleAspect.parent().hide();
//                reticuleSlope.parent().hide();
//            } else {
//                reticuleElev.parent().show();
//                reticuleAspect.parent().show();
//                reticuleSlope.parent().show();
//            }
        };

        /**
         * Handles the "eyeMoved" event.
         * @param {Position} eyePosition Position of the eye/reticule.
         */
        ReticuleView.prototype.handleEyeMoved = function (eyePosition) {

            var eyeAlt = $("#eyeAltitude");

            // Look for the DOM elements to update, and exit if none exist.
            if (!eyeAlt) {
                return;
            }

            // Update the DOM elements with the current terrain position.
            if (eyePosition) {
                eyeAlt.html(this.formatAltitude(eyePosition.altitude, "m"));
            } else {
                eyeAlt.empty();
            }
        };


        ReticuleView.prototype.formatCoordinate = function (number) {
            return Formatter.formatDegreesMinutesSeconds(number, 1);
        };

        ReticuleView.prototype.formatAltitude = function (number, units) {
            // Convert from meters to the desired units format.
            if (units === "km") {
                number /= 1e3;
            }
            // Round to the nearest integer and place a comma every three digits. See the following Stack Overflow thread
            // for more information:
            // http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
            return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + units;
        };

        return ReticuleView;
    }
);