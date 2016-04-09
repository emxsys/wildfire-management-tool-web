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

/*global define, $, WorldWind */

/**
 * @param {type} name description
 * @param {FuelMoistureResource} FuelMoistureResource
 * @param {Log} log
 * @param {MarkerManager} MarkerManager
 * @param {Publisher} publisher
 * @param {SolarResource} SolarResource
 * @param {SurfaceFuelResource} SurfaceFuelResource
 * @param {Terrain} Terrain
 * @param {Viewpoint} Viewpoint
 * @param {WeatherScoutManager} WeatherScoutManager
 * @param {WmtUtil} util
 * @param {Wmt} wmt
 * @param {WorldWind} ww
 * @returns {Model_L50.Model}
 */
define([
    'knockout',
    'wmt/util/Log',
    'wmt/model/MarkerManager',
    'wmt/util/Publisher',
    'wmt/resource/SolarResource',
    'wmt/sun/SolarData',
    'wmt/sun/SolarPositionAlgorithm',
    'wmt/sun/SolarPositionAlgorithmTest',
    'wmt/earth/Terrain',
    'wmt/earth/Viewpoint',
    'wmt/model/WeatherScoutManager',
    'wmt/util/WmtUtil',
    'wmt/Wmt',
    'worldwind'],
    function (
        ko,
        log,
        MarkerManager,
        publisher,
        SolarResource,
        SolarData,
        spa,
        spaTest,
        Terrain,
        Viewpoint,
        WeatherScoutManager,
        util,
        wmt,
        ww) {
        "use strict";
        /**
         * Creates a Model object that's assocaited with the given WorldWindow globe.
         * @constructor
         * @param {Globe} globe The earth.
         * @returns {Model}
         */
        var Model = function (globe) {
            // Mix-in Publisher capability (publish/subscribe pattern)
            publisher.makePublisher(this);
            var self = this;
            
            self.globe = globe;

            self.markerManager = new MarkerManager(this);
            self.weatherScoutManager = new WeatherScoutManager();

            // Properties (available for non-subscribers)
            self.viewpoint = new Viewpoint(WorldWind.Position.ZERO, Terrain.ZERO);
            self.terrainAtMouse = new Terrain(0, 0, 0, 0, 0);
            self.applicationTime = new Date(0);
            self.sunlight = {};

            // Internals
            self.lastMousePoint = new WorldWind.Vec2();
            self.lastSolarTarget = new Terrain(0, 0, 0, 0, 0);
            self.lastSolarTime = new Date(0);
            self.SUNLIGHT_DISTANCE_THRESHOLD = 10000; // meters
            self.SUNLIGHT_TIME_THRESHOLD = 15; // minutes

            // Perform initial updates for time and sunlight
            self.updateAppTime(new Date());

            // ==================
            // Knockout ViewModel
            // ==================
            self.viewModel = {
                eyePosLatitude: ko.observable(self.viewpoint.eye.latitude),
                eyePosLongitude: ko.observable(self.viewpoint.eye.longitude),
                eyePosAltitude: ko.observable(self.viewpoint.eye.altitude),
                tgtPosLatitude: ko.observable(self.viewpoint.target.latitude),
                tgtPosLongitude: ko.observable(self.viewpoint.target.longitude),
                tgtPosElevation: ko.observable(self.viewpoint.target.elevation)
            };
        };


        /**
         * 
         * @param {Date} time
         */
        Model.prototype.updateAppTime = function (time) {
            if (this.applicationTime.valueOf() === time.valueOf()) {
                return;
            }
            var self = this;

            // SUNLIGHT: 
            // Update the sunlight angles when the elapsed time has gone past the threshold (15 min)
            if (util.minutesBetween(this.lastSolarTime, time) > this.SUNLIGHT_TIME_THRESHOLD) {
//                if (this.processingSunlight) {
//                    // Cache the latest request. handleSunlight() will process the pending request.
//                    this.pendingSolarTime = time;
//                } else {
//                    // Set the processing flag so that we queue only the latest request.
//                    this.processingSunlight = true;
//                    SolarResource.sunlightAtLatLonTime(
//                        this.lastSolarTarget.latitude,
//                        this.lastSolarTarget.longitude,
//                        time,
//                        function (sunlight) {
//                            self.handleSunlight(sunlight);  // callback
//                        });
//                    this.lastSolarTime = time;
//                }
                this.updateSunlight(this.applicationTime, this.lastSolarTarget.latitude, this.lastSolarTarget.longitude);
            }
            log.info("Model", "updateAppTime", time.toLocaleString());

            this.applicationTime = time;
            this.fire(wmt.EVENT_TIME_CHANGED, time);
        };

        /**
         * Updates model propeties associated with the globe's view.
         */
        Model.prototype.updateEyePosition = function () {
            var self = this,
                viewpoint = this.globe.getViewpoint(),
                target = viewpoint.target;

            // Initate a request to update the sunlight property when we've moved a significant distance
            if (!this.lastSolarTarget || this.lastSolarTarget.distanceBetween(target) > this.SUNLIGHT_DISTANCE_THRESHOLD) {
//                SolarResource.sunlightAtLatLonTime(target.latitude, target.longitude, new Date(),
//                    function (sunlight) {
//                        self.handleSunlight(sunlight);  // callback
//                    });
//                this.lastSolarTarget.copy(target);

                this.updateSunlight(this.applicationTime, target.latitude, target.longitude);
            }

            // Persist a copy of the new position in our model for non-subscribers
            this.viewpoint.copy(viewpoint);
            
            // Update the Knockout view model
//            log.info("Model", "updateEyePosition", viewpoint.eye.latitude.toString()+','+viewpoint.eye.longitude.toString());
            this.viewModel.eyePosLatitude(viewpoint.eye.latitude);
            this.viewModel.eyePosLongitude(viewpoint.eye.longitude);


            // Update viewpointChanged subscribers
            this.fire(wmt.EVENT_VIEWPOINT_CHANGED, viewpoint);
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

            var terrain = this.globe.getTerrainAtScreenPoint(mousePoint);
            // Persist a copy of the terrain in our model for non-subscribers
            this.terrainAtMouse.copy(terrain);
            // Update subscribers
            this.fire(wmt.EVENT_MOUSE_MOVED, terrain);
        };


        /**
         * Callback function that receives sunlight data from a REST resource.
         * 
         * @param {Sunlight} sunlight JSON Sunlight object.
         */
        Model.prototype.handleSunlight = function (sunlight) {
            this.sunlight = sunlight;
            // Reset our "processing flag"
            this.processingSunlight = false;
            //log.info("Model", "handleSunlight", "Sunrise: " + sunlight.sunriseTime + ", Sunset: " + sunlight.sunsetTime);

            // Update sunlightChanged subscribers
            this.fire(wmt.EVENT_SUNLIGHT_CHANGED, sunlight);

            // If there's a pending request, initiate another update
            if (this.pendingSolarTime) {
                var time = this.pendingSolarTime;
                delete this.pendingSolarTime;
                this.updateAppTime(time);
            }
        };

        Model.prototype.updateSunlight = function (time, latitude, longitude) {
            var observer = {latitude: latitude, longitude: longitude, elevation: 0},
            sd = new SolarData(time, -(time.getTimezoneOffset() / 60), observer);

            spa.calculate(sd);

            // Topocentric local hour angle
            this.sunlight.azimuthAngle = {value: sd.azimuth.toString()};
            this.sunlight.localHourAngle = {value: sd.h_prime.toString()};
            this.sunlight.sunriseHourAngle = {value: sd.srha.toString()};
            this.sunlight.sunsetHourAngle = {value: sd.ssha.toString()};
            this.sunlight.sunriseTime = sd.sunrise;
            this.sunlight.sunsetTime = sd.sunset;

            this.lastSolarTime = time;
            this.lastSolarTarget.latitude = latitude;
            this.lastSolarTarget.longitude = longitude;
        }

        return Model;
    }
);