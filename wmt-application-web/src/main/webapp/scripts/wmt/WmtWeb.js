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
 * WMT Application.
 * 
 * Uses the Asynchronous Module Definition (AMD) pattern via RequireJS.
 * AMD addresses these issues by:
 * - Register the factory function by calling define(), instead of immediately executing it.
 * - Pass dependencies as an array of string values, do not grab globals.
 * - Only execute the factory function once all the dependencies have been loaded and executed.
 * - Pass the dependent modules as arguments to the factory function.
 * 
 * @author Bruce Schubert
 */
define([
    '../webworldwind/WorldWind',
    './layermanager/LayerManager',
    './util/Cookie',
    './globe/CoordinateController',
    './globe/CrosshairsLayer',
    './globe/CrosshairsController'],
    function (
        WorldWind,
        LayerManager,
        Cookie,
        CoordinateController,
        CrosshairsLayer,
        CrosshairsController) {
        "use strict";
        var WmtWeb = function () {
            WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);
            // Create the World Window.
            this.wwd = new WorldWind.WorldWindow("canvasOne");
            /**
             * Added imagery layers.
             */
            var layers = [
                {layer: new WorldWind.BMNGLayer(), enabled: true},
                {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
                {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
                {layer: new CrosshairsLayer(), enabled: true},
                {layer: new WorldWind.CompassLayer(), enabled: true},
                {layer: new WorldWind.ViewControlsLayer(this.wwd), enabled: true}
            ];
            for (var l = 0; l < layers.length; l++) {
                layers[l].layer.enabled = layers[l].enabled;
                this.wwd.addLayer(layers[l].layer);
            }
            this.wwd.redraw();

            this.layerManager = new LayerManager(this.wwd);
            // Create mouse coordinate tracker - updates DOM elements
            this.coordinateController = new CoordinateController(this.wwd);
            // Create crosshairs coordinate tracker - updates DOM elements
            this.crosshairsController = new CrosshairsController(this.wwd);

            // Restore the view (eye position) from the last session
            this.restoreSavedState();

            // Save the current view (eye position) when the window closes
            var self = this;
            window.onbeforeunload = function (evt) {
                self.saveCurrentState();
                // Return null to close quietly
                return null;
            };
        };


        /**
         * Restores the application state from a cookie.
         * @returns {undefined}
         */
        WmtWeb.prototype.restoreSavedState = function () {
            if (!navigator.cookieEnabled) {
                return;
            }
            var lat = Cookie.read("latitude"),
                lon = Cookie.read("longitude"),
                alt = Cookie.read("altitude"),
                head = Cookie.read("heading"),
                tilt = Cookie.read("tilt"),
                roll = Cookie.read("roll");

            if (!lat || !lon) {
                // Set the default location to KOXR airport
                lat = 34.2;
                lon = -119.2083;
            }
            if (!alt) {
                // Set default altitude to 1km
                alt = 10000;
            }
            if (!head || !tilt || !roll) {
                // Set defaults to true north, look down.
                head = 0;
                tilt = 0;
                roll = 0;
            }
            this.wwd.navigator.lookAtPosition.latitude = lat;
            this.wwd.navigator.lookAtPosition.longitude = lon;
            this.wwd.navigator.range = alt;
            this.wwd.navigator.heading = head;
            this.wwd.navigator.tilt = tilt;
            this.wwd.navigator.roll = roll;
            
        };


        /**
         * Saves the current view settings in a cookie
         */
        WmtWeb.prototype.saveCurrentState = function () {
            // Store date/time and eye position in a cookie.
            // Precondition: Cookies must be enabled
            if (!navigator.cookieEnabled) {
                return;
            }
            var pos = this.wwd.navigator.lookAtPosition,
                alt = this.wwd.navigator.range,
                heading = this.wwd.navigator.heading,
                tilt = this.wwd.navigator.tilt,
                roll = this.wwd.navigator.roll,
                numDays = 100;

            // Save the eye position
            Cookie.save("latitude", pos.latitude, numDays);
            Cookie.save("longitude", pos.longitude, numDays);
            Cookie.save("altitude", alt, numDays);

            // Save the globe orientation.
            Cookie.save("heading", heading, numDays);
            Cookie.save("tilt", tilt, numDays);
            Cookie.save("roll", roll, numDays);
            
            // TODO: save date/time
        };


        window.WMT = WmtWeb;

        return WmtWeb;
    });
        