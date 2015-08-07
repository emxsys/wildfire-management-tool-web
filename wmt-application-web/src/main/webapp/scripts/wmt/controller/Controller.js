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

/*global define, $, WorldWind*/

/**
 * 
 * @param {type} FuelModelManager
 * @param {type} LocationManager
 * @param {type} log
 * @param {type} messenger
 * @param {type} Model
 * @param {type} Settings
 * @param {type} SolarView
 * @param {type} TimeManager
 * @param {type} WeatherManager
 * @param {type} Wmt
 * @param {type} ww
 * @returns {Controller_L50.Controller}
 */
define([
    'wmt/controller/LocationManager',
    'wmt/util/Log',
    'wmt/util/Messenger',
    'wmt/model/Model',
    'wmt/util/Settings',
    'wmt/controller/TimeManager',
    'wmt/controller/WeatherManager',
    'wmt/Wmt',
    'worldwind'],
    function (
        LocationManager,
        log,
        messenger,
        Model,
        Settings,
        TimeManager,
        WeatherManager,
        Wmt,
        ww) {
        "use strict";
        var Controller = {
            /**
             * Prepares the singleton Controller object for use.
             * @param {Globe} globe
             */
            initialize: function (globe) {
                // The WorldWindow (globe) provides the spatial input 
                this.globe = globe;
                this.wwd = globe.wwd;

                // Create the other input managers
                this.timeManager = new TimeManager(this);
                this.locationManager = new LocationManager(this);
                this.weatherManager = new WeatherManager(this);

                this.goToAnimator = new WorldWind.GoToAnimator(this.wwd);
                this.isAnimating = false;

                // Create the MVC Model on the primary globe
                this.model = new Model(this.globe);

                // Internal. Intentionally not documented.
                this.updateTimeout = null;
                this.updateInterval = 50;

                // Counters used to display conditional messages
                this.lookoutDnDCount = 0;
                this.markerDnDCount = 0;
                this.scoutDnDCount = 0;

                // Setup to update each time the World Window is repainted.
                var self = this;
                this.wwd.redrawCallbacks.push(function () {
                    self.handleRedraw();
                });

                // Initialize the model with current time
                this.changeDateTime(new Date());

                // Setup to track the cursor position relative to the World Window's canvas. Listen to touch events in order
                // to recognize and ignore simulated mouse events in mobile browsers.
                window.addEventListener("mousemove", function (event) {
                    self.handleMouseEvent(event);
                });
                window.addEventListener("touchstart", function (event) {
                    self.handleTouchEvent(event);
                });

            },
            /**
             * Creates a fire lookout on the globe at the user's drop point.
             * @param {FireLookout} fireLookout A fire lookout containing name and rules[] properties.
             */
            dropFireLookoutOnGlobe: function (fireLookout) {
                var self = this,
                    onDropCallback;

                if (this.lookoutDnDCount < 2) {
                    this.lookoutDnDCount++;
                    messenger.infoGrowl("Click on the globe to place the fire lookout.", "Instructions");
                }
                onDropCallback = function (fireLookout) {
                    // This callback function is invoked when the DnD drop is completed.
                    // The DnD controller will add/update the scout object lat/lon properties
                    // at the drop point prior to invoking this function.
                    self.model.fireLookoutManager.addLookout(fireLookout);
                };
                // Start the DnD for the lookout
                this.globe.dndController.armDrop(fireLookout, onDropCallback);
            },
            /**
             * Starts a drag-n-drop operation that creates the given marker on the globe at the drop point.
             * @param {Object} marker A marker node.
             */
            dropMarkerOnGlobe: function (marker) {
                var self = this,
                    onDropCallback;

                if (this.markerDnDCount < 2) {
                    this.markerDnDCount++;
                    messenger.infoGrowl("Click on the globe to place the marker.", "Instructions");
                }
                // This callback function is invoked when the DnD drop is completed. DnD updates the marker's lat/lon
                onDropCallback = function (marker) {
                    self.model.markerManager.addMarker(marker);
                };
                // Start the DnD for the marker with the callback
                this.globe.dndController.armDrop(marker, onDropCallback);
            },
            /**
             * Creates a weather scout on the globe at the user's drop point.
             * @param {WeatherScout} wxScout A weather scout containing name and rules[] properties.
             */
            dropWeatherScoutOnGlobe: function (wxScout) {
                var self = this,
                    onDropCallback;

                if (this.scoutDnDCount < 2) {
                    this.scoutDnDCount++;
                    messenger.infoGrowl("Click on the globe to place the weather scout.", "Instructions");
                }
                onDropCallback = function (wxScout) {
                    // This callback function is invoked when the DnD drop is completed.
                    // The DnD controller will add/update the scout object lat/lon properties
                    // at the drop point prior to invoking this function.
                    self.model.weatherScoutManager.addScout(wxScout);
                };
                // Start the DnD for the scout
                this.globe.dndController.armDrop(wxScout, onDropCallback);
            },
            /**
             * Updates the globe view.
             * @param {Number} latitude
             * @param {Number} longitude
             */
            lookAtLatLon: function (latitude, longitude, eyeAltitude) {
                if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
                    log.error("Controller", "lookAtLatLon", "Invalid Latitude and/or Longitude.");
                    return;
                }
                // TODO: Make AGL and MSL elevations a function of the model
                // TODO: Eye Position a property of the model
                // 
                var self = this,
                    eyeAltMsl = this.model.viewpoint.eye.altitude,
                    eyePosGrdElev = this.globe.terrainProvider.elevationAtLatLon(this.model.viewpoint.eye.latitude, this.model.viewpoint.eye.longitude),
                    tgtPosElev = this.globe.terrainProvider.elevationAtLatLon(latitude, longitude),
                    eyeAltAgl = eyeAltitude ||Math.max(eyeAltMsl - eyePosGrdElev, 100),
                    tgtEyeAltMsl = Math.max(tgtPosElev + eyeAltAgl, 100);

                // HACK: Force the view to nadir to avoid bug where navigator looks at target at 0 MSL.
                // This will establish the crosshairs on the target.
                this.wwd.navigator.range = eyeAltMsl;
                this.wwd.navigator.tilt = 0;
                this.wwd.redraw();

                this.globe.goto(latitude, longitude, tgtEyeAltMsl, function () {
                    self.updateSpatialData();
                });
            },
            /**
             * Updates the model with the given time.
             * @param {Date} date
             */
            changeDateTime: function (date) {
                this.model.updateAppTime(date);
            },
            /**
             * Updates the model with the an adjusted time (+/- minutues).
             * @param {Number} minutes The number of minutes (+/-) added or subtracted from the current application time. 
             */
            incrementDateTime: function (minutes) {
                var msCurrent = this.model.applicationTime.valueOf(),
                    msNew = msCurrent + (minutes * 60000);
                this.changeDateTime(new Date(msNew));
            },
            /**
             * Changes the current fuel model.
             * @param {FuelModel} fuelModel A JSON FuelModel.
             */
            changeFuelModel: function (fuelModel) {
                this.model.updateFuelModel(fuelModel);
            },
            /**
             * Returns the terrain at the reticule.
             * @returns {Terrain} Controller.model.viewpoint.target}
             */
            getTargetTerrain: function () {
                return this.model.viewpoint.target;
            },
            /**
             * Restores all the persistant data from a previous session.
             * This method must be called after World Wind has finished 
             * updating. See the use Pace.on("done",...) in WmtClient.
             */
            restoreSession: function () {
                log.info('Controller','restoreSession','Restoring the model and view.');
                this.model.markerManager.restoreMarkers();
                this.model.weatherScoutManager.restoreScouts();
                this.model.fireLookoutManager.restoreLookouts();
                this.restoreSessionView();
                // Update all time sensitive objects
                this.changeDateTime(new Date());
                
                // Force a refresh now that everything is setup.
                this.globe.redraw();
            },
            // Internal method
            restoreSessionView: function () {
                Settings.restoreSessionSettings(this);
            },
            /**
             * Saves the current session to the persistent store.
             * See the call to window.onUnload(...) in WmtClient.
             */
            saveSession: function () {
                log.info('Controller','saveSession','Saving the model and view.');
                this.saveSessionView();
                this.model.markerManager.saveMarkers();
                this.model.weatherScoutManager.saveScouts();
                this.model.fireLookoutManager.saveLookouts();
            },
            // Internal method.
            saveSessionView: function () {
                Settings.saveSessionSettings(this);
            },
            /**
             * Updates the model with current globe viewpoint.
             */
            updateSpatialData: function () {
                var wwd = this.wwd,
                    mousePoint = this.mousePoint,
                    centerPoint = new WorldWind.Vec2(wwd.canvas.width / 2, wwd.canvas.height / 2);

                // Use the mouse point when we've received at least one mouse event. Otherwise assume that we're
                // on a touch device and use the center of the World Window's canvas.
                if (!mousePoint) {
                    this.model.updateMousePosition(centerPoint);
                } else if (wwd.viewport.containsPoint(mousePoint)) {
                    this.model.updateMousePosition(mousePoint);
                }
                // Update the viewpoint
                if (!this.isAnimating) {
                    this.model.updateEyePosition();
                }
            },
            handleRedraw: function () {
                var self = this;
                if (self.updateTimeout) {
                    return; // we've already scheduled an update; ignore redundant redraw events
                }

                self.updateTimeout = window.setTimeout(function () {
                    self.updateSpatialData();
                    self.updateTimeout = null;
                }, self.updateInterval);
            },
            handleMouseEvent: function (event) {
                if (this.isTouchDevice) {
                    return; // ignore simulated mouse events in mobile browsers
                }
                this.mousePoint = this.wwd.canvasCoordinates(event.clientX, event.clientY);
                this.wwd.redraw();
            },
            //noinspection JSUnusedLocalSymbols
            handleTouchEvent: function () {
                this.isTouchDevice = true; // suppress simulated mouse events in mobile browsers
                this.mousePoint = null;
            }

        };
        return Controller;
    }
);

