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

/**
 * Based on CoordinateController.js by dcollins.
 * @exports CrosshairsController
 */
define([
    '../util/WmtUtil'],
    function (
        WmtUtil) {
        "use strict";

        /**
         * Constructs a crosshairs controller for a specified {@link WorldWindow}.
         * @alias CrosshairsController
         * @constructor
         * @classdesc Provides a crosshairs controller to interactively update DOM elements indicating the
         * cooridinates under the crosshairs.
         * @param {WorldWindow} worldWindow The World Window to associate this coordinate controller with.
         */
        var CrosshairsController = function (worldWindow) {
            /**
             * The World Window associated with this coordinate controller.
             * @type {WorldWindow}
             */
            this.worldWindow = worldWindow;

            /**
             * The current position under the crosshairs.
             * @type {Position}
             */
            this.crosshairsPosition = new WorldWind.Position();

            // Internal. Intentionally not documented.
            this.updateTimeout = null;
            this.updateInterval = 50;

            // Setup to update the crosshairs elements each time the World Window is repainted.
            var self = this;
            worldWindow.redrawCallbacks.push(function () {
                self.handleRedraw();
            });

        };

        CrosshairsController.prototype.handleRedraw = function () {
            var self = this;
            if (self.updateTimeout) {
                return; // we've already scheduled an update; ignore redundant redraw events
            }

            self.updateTimeout = window.setTimeout(function () {
                self.update();
                self.updateTimeout = null;
            }, self.updateInterval);
        };

        CrosshairsController.prototype.update = function () {
            this.updateTerrainPosition();
        };


        CrosshairsController.prototype.updateTerrainPosition = function () {
            // Pick the center of the World Window's canvas.
            var wwd = this.worldWindow,
                centerPoint = new WorldWind.Vec2(wwd.canvas.width / 2, wwd.canvas.height / 2),
                terrainObject;

            terrainObject = wwd.pickTerrain(centerPoint).terrainObject();
            this.crosshairsPosition = terrainObject.position;

            // Look for the DOM elements to update, and exit if none exist.
            var crosshairsLat = $("#crosshairsLatitude"),
                crosshairsLon = $("#crosshairsLongitude"),
                crosshairsElev = $("#crosshairsElevation"),
                crosshairs2D = $("#crosshairsCoord2D"),
                crosshairs3D = $("#crosshairsCoord3D");
            if (!crosshairsLat && !crosshairsLon && !crosshairsElev && !crosshairs2D && !crosshairs3D) {
                return;
            }

            // Update the DOM elements with the current terrain position.
            if (terrainObject) {
                crosshairs2D.html(this.coord2DFormat(terrainObject.position.latitude, terrainObject.position.longitude));
                crosshairs3D.html(this.coord2DFormat(terrainObject.position.latitude, terrainObject.position.longitude));
                crosshairsLat.html(this.locationFormat(terrainObject.position.latitude));
                crosshairsLon.html(this.locationFormat(terrainObject.position.longitude));
                crosshairsElev.html(this.altitudeFormat(terrainObject.position.altitude, "m"));
            } else {
                crosshairs2D.empty();
                crosshairs3D.empty();
                crosshairsLat.empty();
                crosshairsLon.empty();
                crosshairsElev.empty();
            }

            // Hide the terrain elevation coordinate and its associated label in 2D mode.
            if (wwd.globe.is2D()) {
                crosshairsElev.parent().hide();
            } else {
                crosshairsElev.parent().show();
            }
        };

        CrosshairsController.prototype.coord2DFormat = function (lat, lon) {
            return "Location: " + WmtUtil.formatDMSLatitude(lat, 0) + ", " + WmtUtil.formatDMSLongitude(lon, 0);
        };

        CrosshairsController.prototype.locationFormat = function (number) {
            return WmtUtil.formatDegreesMinutesSeconds(number, 1);
        };

        CrosshairsController.prototype.altitudeFormat = function (number, units) {
            // Convert from meters to the desired units format.
            if (units === "km") {
                number /= 1e3;
            }

            // Round to the nearest integer and place a comma every three digits. See the following Stack Overflow thread
            // for more information:
            // http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
            return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + units;
        };

        return CrosshairsController;
    }
);