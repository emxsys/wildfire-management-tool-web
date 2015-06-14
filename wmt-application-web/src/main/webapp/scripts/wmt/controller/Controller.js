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

/*global define, $ */

define([
    '../view/CoordinatesView',
    './FuelModelManager',
    './LocationManager',
    '../util/Log',
    '../model/Model',
    '../view/ReticuleView',
    '../util/Settings',
    '../view/SolarView',
    './TimeManager',
    './WeatherManager',
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        CoordinatesView,
        FuelModelManager,
        LocationManager,
        Log,
        Model,
        ReticuleView,
        Settings,
        SolarView,
        TimeManager,
        WeatherManager,
        Wmt,
        WorldWind) {
        "use strict";
        var Controller = function (worldWindow) {
            // The WorldWindow (globe) provides the spatial input 
            this.wwd = worldWindow;
            // Create the other input managers
            this.timeManager = new TimeManager(this);
            this.locationManager = new LocationManager(this);
            this.fuelModelManager = new FuelModelManager(this);
            this.weatherManager = new WeatherManager(this);

            this.goToAnimator = new WorldWind.GoToAnimator(this.wwd);
            this.isAnimating = false;

            // Create the MVC Model
            this.model = new Model(worldWindow);

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

        };

        /**
         * 
         * @param {type} latitude
         * @param {type} longitude
         */
        Controller.prototype.createWeatherLookout = function (latitude, longitude) {
            // Open a model dialog to obtain the Weather Lookout properties
            
            // On OK, create the lookout
            //this.model.weatherLookoutManager.addWeatherLookout(name, latitude, longitude, rules);
        };

        /**
         * Updates the globe view.
         * @param {Number} latitude
         * @param {Number} longitude
         */
        Controller.prototype.lookAtLatLon = function (latitude, longitude) {
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

            if (this.isAnimating) {
                this.goToAnimator.cancel();
            }
            this.isAnimating = true;
            this.goToAnimator.goTo(new WorldWind.Position(latitude, longitude, tgtEyeAltMsl), function () {
                self.isAnimating = false;
                self.updateSpatialData();
            });
//            this.wwd.navigator.lookAtLocation.latitude = latitude;
//            this.wwd.navigator.lookAtLocation.longitude = longitude;
        };

        /**
         * Updates the model with the given time.
         * @param {Date} date
         */
        Controller.prototype.changeDateTime = function (date) {
            this.model.updateAppTime(date);
        };

        /**
         * Changes the current fuel model.
         * @param {FuelModel} fuelModel A JSON FuelModel.
         */
        Controller.prototype.changeFuelModel = function (fuelModel) {
            this.model.updateFuelModel(fuelModel);
        };

        /**
         * Finds the World Wind Layer in the layer list with the given display name.
         * @param {String} name Display name of the layer
         * @returns {Layer}
         */
        Controller.prototype.findLayer = function (name) {
            var layer,
                i,
                len;

            // Find the Markers layer in the World Window's layer list.
            for (i = 0, len = this.wwd.layers.length; i < len; i += 1) {
                layer = this.wwd.layers[i];
                if (layer.displayName === name) {
                    return layer;
                }
            }
        };

        /**
         * Returns the terrain at the reticule.
         * @returns {Terrain} Controller.model.viewpoint.target}
         */
        Controller.prototype.getTargetTerrain = function () {
            return this.model.viewpoint.target;
        };

        /** 
         * Redraws the World Window.
         */
        Controller.prototype.redrawGlobe = function () {
            this.wwd.redraw();
        };


        /**
         * Resets the viewpoint to the startup configuration settings.
         */
        Controller.prototype.resetGlobe = function () {
            this.wwd.navigator.lookAtLocation.latitude = Number(Wmt.configuration.startupLatitude);
            this.wwd.navigator.lookAtLocation.longitude = Number(Wmt.configuration.startupLongitude);
            this.wwd.navigator.range = Number(Wmt.configuration.startupAltitude);
            this.wwd.navigator.heading = Number(Wmt.configuration.startupHeading);
            this.wwd.navigator.tilt = Number(Wmt.configuration.startupTilt);
            this.wwd.navigator.roll = Number(Wmt.configuration.startupRoll);
            this.wwd.redraw();
        };


        /**
         * Resets the viewpoint to north up.
         */
        Controller.prototype.resetHeading = function () {
            this.wwd.navigator.heading = Number(0);
            this.wwd.redraw();
        };


        /**
         * Resets the viewpoint to north up and nadir.
         */
        Controller.prototype.resetHeadingAndTilt = function () {
            // Tilting the view will change the location due to a bug in 
            // the early release of WW.  So we set the location to the 
            // current crosshairs position (viewpoint) to resolve this issue
            var lat = this.model.viewpoint.target.latitude,
                lon = this.model.viewpoint.target.longitude;

            this.wwd.navigator.heading = 0;
            this.wwd.navigator.tilt = 0;
            this.wwd.redraw();  // calls applyLimits which changes the location

            this.lookAtLatLon(lat, lon);
        };

        Controller.prototype.restoreSession = function () {
            this.model.markerManager.restoreMarkers();
            this.restoreSessionView();
        };

        Controller.prototype.restoreSessionView = function () {
            Settings.restoreSessionSettings(this);
        };

        Controller.prototype.saveSession = function () {
            this.saveSessionView();
            this.model.markerManager.saveMarkers();
        };

        Controller.prototype.saveSessionView = function () {
            Settings.saveSessionSettings(this);
        };



        /**
         * Updates the model with current globe viewpoint.
         */
        Controller.prototype.updateSpatialData = function () {
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
        };

        Controller.prototype.handleRedraw = function () {
            var self = this;
            if (self.updateTimeout) {
                return; // we've already scheduled an update; ignore redundant redraw events
            }

            self.updateTimeout = window.setTimeout(function () {
                self.updateSpatialData();
                self.updateTimeout = null;
            }, self.updateInterval);
        };

        Controller.prototype.handleMouseEvent = function (event) {
            if (this.isTouchDevice) {
                return; // ignore simulated mouse events in mobile browsers
            }
            this.mousePoint = this.wwd.canvasCoordinates(event.clientX, event.clientY);
            this.wwd.redraw();
        };

        //noinspection JSUnusedLocalSymbols
        Controller.prototype.handleTouchEvent = function () {
            this.isTouchDevice = true; // suppress simulated mouse events in mobile browsers
            this.mousePoint = null;
        };

        return Controller;
    }
);

