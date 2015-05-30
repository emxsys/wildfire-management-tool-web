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

/*global define*/

/**
 * WMT Client Application.
 * 
 * @module {WmtClient}
 * @param {Object} Cookie
 * @param {Object} Controller
 * @param {Object} EnhancedViewControlsLayer
 * @param {Object} Logger
 * @param {Object} ReticuleLayer
 * @param {Object} Wmt
 * @param {Object} WorldWind
 * @author Bruce Schubert
 */
define([
    './util/Cookie',
    './controller/Controller',
    './globe/KeyboardControls',
    './globe/EnhancedLookAtNavigator',
    './globe/EnhancedViewControlsLayer',
    './util/Log',
    './util/Messenger',
    './globe/ReticuleLayer',
    './Wmt',
    '../nasa/WorldWind'],
    function (
        Cookie,
        Controller,
        KeyboardControls,
        EnhancedLookAtNavigator,
        EnhancedViewControlsLayer,
        Log,
        Messenger,
        ReticuleLayer,
        Wmt,
        WorldWind) {
        "use strict";
        var WmtClient = function () {
            Log.info("WmtClient", "constructor", "started");
            // Specify the where the World Wind resources are located.
            WorldWind.configuration.baseUrl = Wmt.WORLD_WIND_PATH;
            // Set the logging level for the World Wind library
            WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);
            // Make ready our general purpose notification
            Messenger.initialize();

            // Create the World Window with a custom navigator object
            this.wwd = new WorldWind.WorldWindow("canvasOne");
            this.wwd.navigator = new EnhancedLookAtNavigator(this.wwd);
            this.keyboardControls = new KeyboardControls(this.wwd);

            var self = this,
                layer,
                layers = [
                    {layer: new WorldWind.BMNGLayer(), enabled: true},
                    {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
                    {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
                    {layer: new ReticuleLayer(), enabled: true},
                    {layer: new EnhancedViewControlsLayer(this.wwd), enabled: true}
                ];
            // Add imagery layers to WorldWindow
            for (layer = 0; layer < layers.length; layer++) {
                layers[layer].layer.enabled = layers[layer].enabled;
                this.wwd.addLayer(layers[layer].layer);
            }
            // Restore the globe (eye position) from the last session
            this.restoreSavedState();
            this.wwd.redraw();

            // Now that the globe is setup, initialize the Model-View-Controller framework.
            // The controller will create model and the views
            this.controller = new Controller(this.wwd);

            // Add event handler to save the current view (eye position) when the window closes
            window.onbeforeunload = function (evt) {
                self.saveCurrentState();
                // Return null to close quietly
                return null;
            };
            Log.info("WmtClient", "constructor", "finished.");
        };



        /**
         * Restores the application state from a cookie.
         * @returns {undefined}
         */
        WmtClient.prototype.restoreSavedState = function () {
            try {
                if (!navigator.cookieEnabled) {
                    Log.warning("WmtClient", "restoreSavedState", "Cookies not enabled!");
                    return;
                }
                var latStr = Cookie.read("latitude"),
                    lonStr = Cookie.read("longitude"),
                    altStr = Cookie.read("altitude"),
                    headStr = Cookie.read("heading"),
                    tiltStr = Cookie.read("tilt"),
                    rollStr = Cookie.read("roll");

                if (!latStr || !lonStr || isNaN(latStr) || isNaN(lonStr)) {
                    Log.warning("WmtClient", "restoreSavedState", "Previous state invalid: Using default lat/lon.");
                    latStr = Wmt.configuration.startupLatitude;
                    lonStr = Wmt.configuration.startupLongitude;
                }
                if (!altStr || isNaN(altStr)) {
                    Log.warning("WmtClient", "restoreSavedState", "Previous state invalid: Using default altitude.");
                    altStr = Wmt.configuration.startupAltitude;
                }
                if (!headStr || !tiltStr || !rollStr || isNaN(headStr) || isNaN(tiltStr) || isNaN(rollStr)) {
                    Log.warning("WmtClient", "restoreSavedState", "Previous state invalid: Using default view angles.");
                    headStr = Wmt.configuration.startupHeading;
                    tiltStr = Wmt.configuration.startupTilt;
                    rollStr = Wmt.configuration.startupRoll;
                }
                this.wwd.navigator.lookAtLocation.latitude = Number(latStr);
                this.wwd.navigator.lookAtLocation.longitude = Number(lonStr);
                this.wwd.navigator.range = Number(altStr);
                this.wwd.navigator.heading = Number(headStr);
                this.wwd.navigator.tilt = Number(tiltStr);
                this.wwd.navigator.roll = Number(rollStr);

            } catch (e) {
                Log.error("WmtClient", "restoreSavedState",
                    "Exception occurred processing cookie: " + e.toString());
            }
        };


        /**
         * Saves the current view settings in a cookie
         */
        WmtClient.prototype.saveCurrentState = function () {
            // Store date/time and eye position in a cookie.
            // Precondition: Cookies must be enabled
            if (!navigator.cookieEnabled) {
                Log.warning("WmtClient", "saveCurrentState", "Cookies not enabled!");
                return;
            }
            var pos = this.wwd.navigator.lookAtLocation,
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

            //TODO: save date/time
        };

        return WmtClient;
    }
);
        