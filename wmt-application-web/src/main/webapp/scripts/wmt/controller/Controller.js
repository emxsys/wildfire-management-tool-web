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
    './LayerManager',
    './LocationManager',
    '../util/Log',
    '../model/Model',
    '../view/ReticuleView',
    '../view/SolarView',
    './TimeManager',
    './WeatherManager',
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        CoordinatesView,
        FuelModelManager,
        LayerManager,
        LocationManager,
        Log,
        Model,
        ReticuleView,
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
            this.layerManager = new LayerManager(this.wwd);
            this.timeManager = new TimeManager(this);
            this.locationManager = new LocationManager(this);
            this.fuelModelManager = new FuelModelManager(this);
            this.weatherManager = new WeatherManager(this);

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

            // Add menu event handlers
            $("#resetGlobe").on("click", function (event) {
                self.resetGlobe(event);
            });
            $("#resetHeading").on("click", function (event) {
                self.resetHeading(event);
            });
            $("#resetView").on("click", function (event) {
                self.resetHeadingAndTilt(event);
            });

        };


        /**
         * Updates the globe view.
         * @param {Number} latitude
         * @param {Number} longitude
         */
        Controller.prototype.lookAtLatLon = function (latitude, longitude) {
            this.wwd.navigator.lookAtLocation.latitude = latitude;
            this.wwd.navigator.lookAtLocation.longitude = longitude;
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
            this.wwd.navigator.heading = 0;
            this.wwd.navigator.tilt = 0;
            this.wwd.redraw();
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
            this.model.updateEyePosition();
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
        Controller.prototype.handleTouchEvent = function (event) {
            this.isTouchDevice = true; // suppress simulated mouse events in mobile browsers
            this.mousePoint = null;
        };

        return Controller;
    }
);

