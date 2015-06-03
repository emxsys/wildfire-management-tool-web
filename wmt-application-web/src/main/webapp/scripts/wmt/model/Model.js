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

/*global define, $ */

/**
 * @module Model
 * 
 * @param {Object} Publisher - Mixin module providing publish/subscribe pattern.
 * @param {Object} Terrain
 * @param {Object} TerrainProvider
 * @param {Object} WorldWind
 * 
 * @author Bruce Schubert
 */
define([
    '../util/Log',
    '../util/Publisher',
    '../resource/FuelMoistureResource',
    '../resource/SolarResource',
    '../resource/SurfaceFuelResource',
    '../globe/Terrain',
    '../globe/TerrainProvider',
    '../globe/Viewpoint',
    '../resource/WeatherResource',
    '../util/WmtUtil',
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        Log,
        Publisher,
        FuelMoistureResource,
        SolarResource,
        SurfaceFuelResource,
        Terrain,
        TerrainProvider,
        Viewpoint,
        WeatherResource,
        WmtUtil,
        Wmt,
        WorldWind) {
        "use strict";
        /**
         * Creates a Model object that's assocaited with the given WorldWindow globe.
         * @constructor
         * @param {WorldWindo} worldWindow The canvas and globe.
         * @returns {Model}
         */
        var Model = function (worldWindow) {
            // Mix-in Publisher capability (publish/subscribe pattern)
            Publisher.makePublisher(this);

            this.wwd = worldWindow;
            this.terrainProvider = new TerrainProvider(worldWindow);

            // Properties available for non-subscribers
            this.viewpoint = new Viewpoint(WorldWind.Position.ZERO, Terrain.ZERO);
            this.terrainAtMouse = new Terrain(0, 0, 0, 0, 0);
            this.applicationTime = new Date();
            this.sunlight = {};
            this.fuelModel = null;
            this.fuelMoisture = null;
            this.surfaceFuel = null;
            this.weather = null;

            // Internals
            this.lastEyePoint = new WorldWind.Vec3();
            this.lastMousePoint = new WorldWind.Vec2();
            this.lastSolarTarget = new Terrain(0, 0, 0, 0, 0);
            this.lastSolarTime = new Date(0);
            this.SUNLIGHT_DISTANCE_THRESHOLD = 10000; // meters
            this.SUNLIGHT_TIME_THRESHOLD = 15; // minutes
        };

        /**
         * 
         * @param {FuelModel} fuelModel
         */
        Model.prototype.updateFuelModel = function (fuelModel) {
            if (!fuelModel) {
                throw new Error(Log.error("Model", "updateFuelModel", "missingFuelModel"));
            }
            Log.info("Model", "updateFuelModel", fuelModel.modelName);
            this.fuelModel = fuelModel;

            // Testing fuel moisture and surface fuel.
            this.updateFuelMoisture("hot_and_dry");
        };

        /**
         * 
         * @param {String} conditions
         */
        Model.prototype.updateFuelMoisture = function (conditions) {
            // TODO: Assert conditions
            var self = this;

            // Update the surface fuel property when the fuel model changes
            FuelMoistureResource.fuelMoistureTuple(conditions, function (fuelMoisture) {
                self.handleFuelMoisture(fuelMoisture);  // callback
            });
        };

        /**
         * 
         * @param {Date} time
         */
        Model.prototype.updateAppTime = function (time) {
            var self = this;

            // Update the sunlight property when the elapsed time has gone past the threshold
            if (WmtUtil.minutesBetween(this.lastSolarTime, time) > this.SUNLIGHT_TIME_THRESHOLD) {
                SolarResource.sunlightAtLatLonTime(this.lastSolarTarget.latitude, this.lastSolarTarget.longitude, time,
                    function (sunlight) {
                        self.handleSunlight(sunlight);  // callback
                    });
                this.lastSolarTime = time;
            }
            // Update the weather property when the elapsed time has gone past the threshold
            if (WmtUtil.minutesBetween(this.lastSolarTime, time) > this.SUNLIGHT_TIME_THRESHOLD) {
                WeatherResource.sunlightAtLatLonTime(this.lastSolarTarget.latitude, this.lastSolarTarget.longitude, time,
                    function (sunlight) {
                        self.handleSunlight(sunlight);  // callback
                    });
                this.lastSolarTime = time;
            }
            Log.info("Model", "updateAppTime", time.toLocaleString());

            this.applicationTime = time;
            this.fire(Wmt.EVENT_TIME_CHANGED, time);
        };

        /**
         * Updates model propeties associated with the globe's view.
         */
        Model.prototype.updateEyePosition = function () {
            // Compute the World Window's current eye position.
            var wwd = this.wwd,
                self = this,
                centerPoint = new WorldWind.Vec2(wwd.canvas.width / 2, wwd.canvas.height / 2),
                navigatorState = wwd.navigator.currentState(),
                eyePoint = navigatorState.eyePoint,
                eyePos = new WorldWind.Position(),
                target,
                viewpoint;

            // Avoid costly computations if nothing changed
            if (eyePoint.equals(this.lastEyePoint)) {
                return;
            }
            this.lastEyePoint.copy(eyePoint);

            // Get the attributes for eye position and the target (the point under the reticule)
            wwd.globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], eyePos);
            //eyeGroundElev = wwd.globe.elevationAtLocation(eyePos.latitude, eyePos.longitude);
            target = this.terrainAtScreenPoint(centerPoint);
            viewpoint = new Viewpoint(eyePos, target);

            // Initate a request to update the sunlight property when we've moved a significant distance
            if (!this.lastSolarTarget || this.lastSolarTarget.distanceBetween(target) > this.SUNLIGHT_DISTANCE_THRESHOLD) {
                SolarResource.sunlightAtLatLonTime(target.latitude, target.longitude, new Date(),
                    function (sunlight) {
                        self.handleSunlight(sunlight);  // callback
                    });
                this.lastSolarTarget.copy(target);
            }
            // Persist a copy of the new position in our model for non-subscribers
            this.viewpoint.copy(viewpoint);
            // Update viewpointChanged subscribers
            this.fire(Wmt.EVENT_VIEWPOINT_CHANGED, viewpoint);
        };


        /**
         * Updates the terrainAtMouse property and fires a "mousedMoved" event.
         * 
         * @param {Vec2} mousePoint Mouse point or touchpoint coordiantes.
         */
        Model.prototype.updateMousePosition = function (mousePoint) {
            if (mousePoint.equals(this.lastMousePoint)) {
                return;
            }
            this.lastMousePoint.copy(mousePoint);

            var terrain = this.terrainAtScreenPoint(mousePoint);
            // Persist a copy of the terrain in our model for non-subscribers
            this.terrainAtMouse.copy(terrain);
            // Update subscribers
            this.fire(Wmt.EVENT_MOUSE_MOVED, terrain);
        };


        /**
         * Gets terrain at the screen point.
         * 
         * @param {Vec2} screenPoint Point in screen coordinates for which to get terrain.
         */
        Model.prototype.terrainAtScreenPoint = function (screenPoint) {
            var wwd = this.wwd,
                terrainObject,
                terrain;

            // Get the WW terrain at the screen point, it supplies the lat/lon
            terrainObject = wwd.pickTerrain(screenPoint).terrainObject();
            if (terrainObject) {
                // Get the WMT terrain at the picked lat/lon
                terrain = this.terrainProvider.terrainAtLatLon(
                    terrainObject.position.latitude,
                    terrainObject.position.longitude);
            } else {
                // Probably above the horizon.
                terrain = new Terrain();
                terrain.copy(Terrain.INVALID);
            }
            return terrain;
        };


        /**
         * Callback function that receives sunlight data from a REST resource.
         * 
         * @param {Sunlight} sunlight JSON Sunlight object.
         */
        Model.prototype.handleSunlight = function (sunlight) {
            this.sunlight = sunlight;
            Log.info("Model", "handleSunlight", "Sunrise: " + sunlight.sunriseTime + ", Sunset: " + sunlight.sunsetTime);
            // Update sunlightChanged subscribers
            this.fire(Wmt.EVENT_SUNLIGHT_CHANGED, sunlight);
        };

        /**
         * Callback function that receives fuel moisture data from a REST resource.
         * 
         * @param {FuelMoistureTuple} fuelMoisture JSON FuelMoistureTuple object.
         */
        Model.prototype.handleFuelMoisture = function (fuelMoisture) {
            var self = this;

            this.fuelMoisture = fuelMoisture;
            Log.info("Model", "handleFuelMoisture", "FuelMoistureTuple: " + JSON.stringify(fuelMoisture));
            // Update fuelMoistureChanged subscribers
            this.fire(Wmt.EVENT_FUELMOISTURE_CHANGED, fuelMoisture);

            if (this.fuelModel && this.fuelMoisture) {
                // Update the surface fuel property when the fuel model changes
                SurfaceFuelResource.surfaceFuel(this.fuelModel, this.fuelMoisture, function (surfaceFuel) {
                    self.handleSurfaceFuel(surfaceFuel);  // callback
                });

            }
        };


        /**
         * Callback function that receives surface fuel data from a REST resource.
         * 
         * @param {SurfaceFuel} surfaceFule JSON SurfaceFuel object.
         */
        Model.prototype.handleSurfaceFuel = function (surfaceFuel) {
            this.surfaceFuel = surfaceFuel;
            Log.info("Model", "handleSurfaceFuel", "SurfaceFuel: " + JSON.stringify(surfaceFuel));
            // Update surfaceFuelChanged subscribers
            this.fire(Wmt.EVENT_SURFACEFUEL_CHANGED, surfaceFuel);
        };

        return Model;
    }
);