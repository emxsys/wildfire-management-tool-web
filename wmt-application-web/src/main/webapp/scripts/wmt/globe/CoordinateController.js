/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

/*global $, define*/

/**
 * The CoordinateController tracks the mouse coordinates.
 * @exports CoordinateController
 * @param {Object} WorldWind
 */
define(['../../webworldwind/WorldWind'],
    function (WorldWind) {
        "use strict";

        /**
         * Constructs a coordinate controller for a specified {@link WorldWindow}.
         * @alias CoordinateController
         * @constructor
         * @classdesc Provides a coordinate controller to interactively update DOM elements indicating the eye position
         * and terrain position associated with a World Window.
         * @param {WorldWindow} worldWindow The World Window to associate this coordinate controller with.
         */
        var CoordinateController = function (worldWindow) {
            /**
             * The World Window associated with this coordinate controller.
             * @type {WorldWindow}
             */
            this.worldWindow = worldWindow;

            // Internal. Intentionally not documented.
            this.updateTimeout = null;
            this.updateInterval = 50;
            this.mousePoint = null;
            this.isTouchDevice = false;
            this.scratchPos = new WorldWind.Position();

            // Setup to update the coordinate elements each time the World Window is repainted.
            var self = this;
            worldWindow.redrawCallbacks.push(function () {
                self.handleRedraw();
            });

            // Setup to track the cursor position relative to the World Window's canvas. Listen to touch events in order
            // to recognize and ignore simulated mouse events in mobile browsers.
            window.addEventListener("mousemove", function (event) {
                self.handleMouseEvent(event);
            });
            window.addEventListener("touchstart", function (event) {
                self.handleTouchEvent(event);
            });
        };

        CoordinateController.prototype.handleRedraw = function () {
            var self = this;
            if (self.updateTimeout) {
                return; // we've already scheduled an update; ignore redundant redraw events
            }

            self.updateTimeout = window.setTimeout(function () {
                self.update();
                self.updateTimeout = null;
            }, self.updateInterval);
        };

        CoordinateController.prototype.update = function () {
            this.updateEyePosition();
            this.updateTerrainPosition();
        };

        CoordinateController.prototype.updateEyePosition = function () {
            // Look for the DOM element to update, and exit if none exists.
            var eyeAlt = $("#eyeAltitude"),
                wwd = this.worldWindow,
                navigatorState,
                eyePoint,
                eyePos;

            if (!eyeAlt) {
                return;
            }
            // Compute the World Window's current eye position.
            navigatorState = wwd.navigator.currentState();
            eyePoint = navigatorState.eyePoint;
            eyePos = wwd.globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], this.scratchPos);

            // Update the DOM element with the current eye altitude.
            eyeAlt.html(this.altitudeFormat(eyePos.altitude, eyePos.altitude < 1000 ? "m" : "km"));
        };

        CoordinateController.prototype.updateTerrainPosition = function () {
            // Look for the DOM elements to update, and exit if none exist.
            var wwd = this.worldWindow,
                terrainLat = $("#terrainLatitude"),
                terrainLon = $("#terrainLongitude"),
                terrainElev = $("#terrainElevation"),
                mousePoint,
                centerPoint,
                terrainObject;
            
            if (!terrainLat && !terrainLon && !terrainElev) {
                return;
            }
            // Pick the terrain at the mouse point when we've received at least one mouse event. Otherwise assume that we're
            // on a touch device and pick at the center of the World Window's canvas.
            mousePoint = this.mousePoint;
            centerPoint = new WorldWind.Vec2(wwd.canvas.width / 2, wwd.canvas.height / 2);

            if (!mousePoint) {
                terrainObject = wwd.pickTerrain(centerPoint).terrainObject();
            } else if (wwd.viewport.containsPoint(mousePoint)) {
                terrainObject = wwd.pickTerrain(mousePoint).terrainObject();
            }

            // Update the DOM elements with the current terrain position.
            if (terrainObject) {
                terrainLat.html(this.locationFormat(terrainObject.position.latitude));
                terrainLon.html(this.locationFormat(terrainObject.position.longitude));
                terrainElev.html(this.altitudeFormat(terrainObject.position.altitude, "m"));
            } else {
                terrainLat.empty();
                terrainLon.empty();
                terrainElev.empty();
            }

            // Hide the terrain elevation coordinate and its associated label in 2D mode.
            if (wwd.globe.is2D()) {
                terrainElev.parent().hide();
            } else {
                terrainElev.parent().show();
            }
        };

        CoordinateController.prototype.locationFormat = function (number) {
            return number.toFixed(4) + "\u00b0";
        };

        CoordinateController.prototype.altitudeFormat = function (number, units) {
            // Convert from meters to the desired units format.
            if (units === "km") {
                number /= 1e3;
            }

            // Round to the nearest integer and place a comma every three digits. See the following Stack Overflow thread
            // for more information:
            // http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
            return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + units;
        };

        CoordinateController.prototype.handleMouseEvent = function (event) {
            if (this.isTouchDevice) {
                return; // ignore simulated mouse events in mobile browsers
            }

            this.mousePoint = this.worldWindow.canvasCoordinates(event.clientX, event.clientY);
            this.worldWindow.redraw();
        };

        //noinspection JSUnusedLocalSymbols
        CoordinateController.prototype.handleTouchEvent = function (event) {
            this.isTouchDevice = true; // suppress simulated mouse events in mobile browsers
            this.mousePoint = null;
        };

        return CoordinateController;
    });