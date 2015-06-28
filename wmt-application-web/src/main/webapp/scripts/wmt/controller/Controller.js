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

define([
    'wmt/view/CoordinatesView',
    'wmt/controller/FuelModelManager',
    'wmt/controller/LocationManager',
    'wmt/util/Log',
    'wmt/util/Messenger',
    'wmt/model/Model',
    'wmt/view/ReticuleView',
    'wmt/util/Settings',
    'wmt/view/SolarView',
    'wmt/controller/TimeManager',
    'wmt/controller/WeatherManager',
    'wmt/Wmt',
    'worldwind'],
    function (
        CoordinatesView,
        FuelModelManager,
        LocationManager,
        Log,
        Messenger,
        Model,
        ReticuleView,
        Settings,
        SolarView,
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
                this.fuelModelManager = new FuelModelManager(this);
                this.weatherManager = new WeatherManager(this);

                this.goToAnimator = new WorldWind.GoToAnimator(this.wwd);
                this.isAnimating = false;

                // Create the MVC Model on the primary globe
                this.model = new Model(this.wwd);

                // Create MVC Views
                this.coordinatesView = new CoordinatesView(this.wwd);
                this.reticuleView = new ReticuleView(this.wwd);

                // MVC: Assemble the associations between the model and views
                this.model.on(Wmt.EVENT_MOUSE_MOVED, this.coordinatesView.handleMouseMoved, this.coordinatesView);
                this.model.on(Wmt.EVENT_VIEWPOINT_CHANGED, this.reticuleView.handleViewpointChanged, this.reticuleView);
                this.model.on(Wmt.EVENT_SUNLIGHT_CHANGED, SolarView.handleSunlightChanged, SolarView);
                this.model.on(Wmt.EVENT_TIME_CHANGED, SolarView.handleTimeChanged, SolarView);
                this.model.on(Wmt.EVENT_TIME_CHANGED, SolarView.handleTimeChanged, SolarView);


                // Internal. Intentionally not documented.
                this.updateTimeout = null;
                this.updateInterval = 50;

                // Counter used to display conditional messages
                this.markerDnDCount = 0;

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
             * Starts a drag-n-drop operation that creates the given marker on the globe at the drop point.
             * 
             * @param {Object} markerTemplate A marker template containing name:String and type:String properties.
             */
            addMarkerToGlobe: function (markerTemplate) {
                var self = this,
                    onDropCallback;

                if (this.markerDnDCount < 2) {
                    this.markerDnDCount++;
                    Messenger.infoGrowl("Click on the globe to place the marker.", "Instructions");
                }
                // This callback function is invoked when the DnD drop is completed.
                // The DnD controller will add/update the marker lat/lon properties
                // at the drop point prior to invoking this function.
                onDropCallback = function (markerTemplate) {
                    self.model.markerManager.addMarker(
                        markerTemplate.name,
                        markerTemplate.type,
                        markerTemplate.latitude,
                        markerTemplate.longitude);
                };
                // Start the DnD for the marker
                this.wwd.dndController.armDrop(markerTemplate, onDropCallback);
            },
            /**
             * Creates a weather lookout on the globe at the user's drop point.
             * 
             * @param {WeatherLookout} wxLookout A weather lookout containing name and rules[] properties.
             */
            addWeatherLookoutToGlobe: function (wxLookout) {
                var self = this,
                    onDropCallback = function (wxLookout) {
                        // This callback function is invoked when the DnD drop is completed.
                        // The DnD controller will add/update the lookout object lat/lon properties
                        // at the drop point prior to invoking this function.
                        self.model.weatherLookoutManager.addLookout(wxLookout);
                    };
                // Start the DnD for the lookout
                this.wwd.dndController.armDrop(wxLookout, onDropCallback);
            },
            /**
             * Updates the globe view.
             * @param {Number} latitude
             * @param {Number} longitude
             */
            lookAtLatLon: function (latitude, longitude) {
                if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
                    Log.error("Controller", "lookAtLatLon", "Invalid Latitude and/or Longitude.");
                    return;
                }
                // TODO: Make AGL and MSL elevations a function of the model
                // TODO: Eye Position a property of the model
                // 
                var self = this,
                    eyeAltMsl = this.model.viewpoint.eye.altitude,
                    eyePosGrdElev = this.model.terrainProvider.elevationAtLatLon(this.model.viewpoint.eye.latitude, this.model.viewpoint.eye.longitude),
                    eyeAltAgl = Math.max(eyeAltMsl - eyePosGrdElev, 100),
                    tgtPosElev = this.model.terrainProvider.elevationAtLatLon(latitude, longitude),
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
             * Finds the World Wind Layer in the layer list with the given display name.
             * @param {String} name Display name of the layer
             * @returns {Layer}
             */
            findLayer: function (name) {
                return this.globe.findLayer(name);
            },
            /**
             * Returns the terrain at the reticule.
             * @returns {Terrain} Controller.model.viewpoint.target}
             */
            getTargetTerrain: function () {
                return this.model.viewpoint.target;
            },
            /** 
             * Redraws the World Window.
             */
            redrawGlobe: function () {
                this.wwd.redraw();
            },
            /**
             * Resets the viewpoint to the startup configuration settings.
             */
            resetGlobe: function () {
                this.globe.reset();
            },
            /**
             * Resets the viewpoint to north up.
             */
            resetHeading: function () {
                this.globe.resetHeading();
            },
            /**
             * Resets the viewpoint to north up and nadir.
             */
            resetHeadingAndTilt: function () {
                // Tilting the view will change the location due to a bug in 
                // the early release of WW.  So we set the location to the 
                // current crosshairs position (viewpoint) to resolve this issue
                var lat = this.model.viewpoint.target.latitude,
                    lon = this.model.viewpoint.target.longitude;

                this.wwd.navigator.heading = 0;
                this.wwd.navigator.tilt = 0;
                this.wwd.redraw();  // calls applyLimits which changes the location

                this.lookAtLatLon(lat, lon);
            },
            restoreSession: function () {
                this.model.markerManager.restoreMarkers();
                this.model.weatherLookoutManager.restoreLookouts();
                this.restoreSessionView();
            },
            restoreSessionView: function () {
                Settings.restoreSessionSettings(this);
            },
            saveSession: function () {
                this.saveSessionView();
                this.model.markerManager.saveMarkers();
                this.model.weatherLookoutManager.saveLookouts();
            },
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

