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

/*global define, $, WorldWind*/

/**
 * The MouseCoordinates displays the position under the mouse.
 * 
 * @param {Object} Formatter
 * @param {Object} Terrain
 * @param {Object} WorldWind
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/util/Formatter',
    'wmt/globe/Terrain',
    'worldwind'],
    function (
        Formatter,
        Terrain,
        ww) {
        "use strict";
        var CoordinatesView = function (worldWindow) {
            //
            this.wwd = worldWindow;
        };

        /**
         * Model "mouseMoved" event handler.
         * @param {Object} terrain Terrain under the mouse cursor.
         */
        CoordinatesView.prototype.handleMouseMoved = function (terrain) {
            var terrainLat = $("#terrainLatitude"),
                terrainLon = $("#terrainLongitude"),
                terrainElev = $("#terrainElevation");

            // Look for the DOM elements to update, and exit if none exist.
            if (!terrainLat && !terrainLon && !terrainElev) {
                return;
            }

            // Update the DOM elements with the current terrain position.
            if (terrain && !terrain.equals(Terrain.INVALID)) {
                terrainLat.html(this.locationFormat(terrain.latitude));
                terrainLon.html(this.locationFormat(terrain.longitude));
                terrainElev.html(this.altitudeFormat(terrain.elevation, "m"));
            } else {
                terrainLat.empty();
                terrainLon.empty();
                terrainElev.empty();
            }

            // Hide the terrain elevation coordinate and its associated label in 2D mode.
            if (this.wwd.globe.is2D()) {
                terrainElev.parent().hide();
            } else {
                terrainElev.parent().show();
            }
        };


        CoordinatesView.prototype.locationFormat = function (number) {
            return Formatter.formatDecimalMinutes(number, 3);
        };

        CoordinatesView.prototype.altitudeFormat = function (number, units) {
            // Convert from meters to the desired units format.
            if (units === "km") {
                number /= 1e3;
            }

            // Round to the nearest integer and place a comma every three digits. See the following Stack Overflow thread
            // for more information:
            // http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
            return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + units;
        };

        return CoordinatesView;
    }
);