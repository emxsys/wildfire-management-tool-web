/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports CrosshairsController
 * @version $Id: CrosshairsController.js 3067 2015-05-06 00:17:49Z dcollins $
 */
define(function () {
    "use strict";

    /**
     * Constructs a coordinate controller for a specified {@link WorldWindow}.
     * @alias CrosshairsController
     * @constructor
     * @classdesc Provides a coordinate controller to interactively update DOM elements indicating the eye position
     * and terrain position associated with a World Window.
     * @param {WorldWindow} worldWindow The World Window to associate this coordinate controller with.
     */
    var CrosshairsController = function (worldWindow) {
        /**
         * The World Window associated with this coordinate controller.
         * @type {WorldWindow}
         */
        this.worldWindow = worldWindow;

        // Internal. Intentionally not documented.
        this.updateTimeout = null;
        this.updateInterval = 50;
        this.scratchPos = new WorldWind.Position();

        // Setup to update the coordinate elements each time the World Window is repainted.
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
        // Look for the DOM elements to update, and exit if none exist.
        var crosshairsLat = $("#crosshairsLatitude"),
                crosshairsLon = $("#crosshairsLongitude"),
                crosshairsElev = $("crosshairsElevation"),
                crosshairs2D = $("crosshairsCoord2D"),
                crosshairs3D = $("crosshairsCoord3D");
        if (!crosshairsLat && !crosshairsLon && !crosshairsElev && !crosshairs2D && !crosshairs3D) {
            return;
        }

        // Pick the center of the World Window's canvas.
        var wwd = this.worldWindow,
                centerPoint = new WorldWind.Vec2(wwd.canvas.width / 2, wwd.canvas.height / 2),
                terrainObject;

        terrainObject = wwd.pickTerrain(centerPoint).terrainObject();

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
//        return lat.toFixed(3) + "\u00b0" + lat >= 0 ? " N, " : " S, "
//                + lon.toFixed(3) + "\u00b0" + lon >= 0 ? " E, " : " W, ";
        return "Lat: " + lat.toFixed(3) + "\u00b0, Lon: " +  lon.toFixed(3) + "\u00b0";
    };

    CrosshairsController.prototype.locationFormat = function (number) {
        return number.toFixed(4) + "\u00b0";
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
});