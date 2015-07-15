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

/*global define, $*/

define(["require",
    'wmt/view/FireLookoutViewer',
    'wmt/model/FuelModelCatalog',
    'wmt/model/FuelMoistureCatalog',
    'wmt/util/Log',
    'wmt/util/Messenger',
    'wmt/resource/SolarResource',
    'wmt/resource/SurfaceFireResource',
    'wmt/resource/SurfaceFuelResource',
    'wmt/globe/Terrain',
    'wmt/resource/TerrainResource',
    'wmt/resource/WeatherResource',
    'wmt/model/WeatherScout',
    'wmt/util/WmtUtil',
    'wmt/Wmt'],
    function (
        require,
        fireLookoutViewer,
        fuelModelCatalog,
        fuelMoistureCatalog,
        log,
        messenger,
        solarResource,
        surfaceFireResource,
        surfaceFuelResource,
        Terrain,
        terrainResource,
        weatherResource,
        WeatherScout,
        util,
        wmt) {
        "use strict";


        /**
         * Creates a FireLookout.
         * @constructor
         * @param {String} name
         * @param {String} latitude
         * @param {String} longitude
         * @param {String} id
         * @returns {FireLookout}
         */
        var FireLookout = function (params) {
            var arg = params || {},
                self = this,
                model = require("wmt/controller/Controller").model;

            // Inherit the weather forecasting capabilites of the WeatherScout
            WeatherScout.call(this, arg.name, 24, null, arg.latitude, arg.longitude, arg.id);

            /**
             * Override the WeatherScout name set by the parent
             */
            this.name = arg.name || 'Fire Lookout';
            this.toponym = arg.toponym;

            /**
             * Override the parent WeatherScout's Openable implementation with a FireLookoutDialog
             */
            this.openMe = function () {
                fireLookoutViewer.show(self);
            };

            // Persistent properties
            this.fuelModelNo = arg.fuelModelNo || wmt.configuration.defaultFuelModelNo;
            this.moistureScenarioName = arg.moistureScenarioName || wmt.configuration.defaultFuelMoistureScenario;
            this.isMovable = arg.isMovable === undefined ? true : arg.isMovable;

            // Dynamic properties
            this.sunlight = model.sunlight;
            this.terrain = Terrain.ZERO;
            this.terrainTuple = terrainResource.makeTuple(0, 0, 0);
            this.surfaceFuel = null;

            // Internals
            this.refreshInProgress = false;
            this.refreshPending = false;


            // Self subscribe to weather updates generated by parent so we can update the fire behavior
            this.on(wmt.EVENT_WEATHER_CHANGED, this.refreshFireBehavior, this);
            // Subscribe to applicaiton time events so we can update the fire behavior.
            model.on(wmt.EVENT_TIME_CHANGED, this.refreshFireBehavior, this);

        };
        FireLookout.prototype = Object.create(WeatherScout.prototype);

        Object.defineProperties(FireLookout.prototype, {
            /**
             * The fuel model number determines the fuel model object.
             */
            fuelModelNo: {
                get: function () {
                    return this.fuelModel.modelNo;
                },
                set: function (value) {
                    this.fuelModel = fuelModelCatalog.getFuelModel(value);
                }
            },
            /**
             * The fuel moisture scenario determines the fuel moisture object.
             */
            moistureScenarioName: {
                get: function () {
                    return this.moistureScenario.name;
                },
                set: function (value) {
                    this.moistureScenario = fuelMoistureCatalog.getScenario(value);
                    this.fuelMoisture = this.moistureScenario.fuelMoisture;
                }
            }
        });


        /**
         * Updates the weather lookout's weather forecast and location, 
         * Then updates this derived object's fire behavior.
         */
        FireLookout.prototype.refreshFireBehavior = function () {
            if (!this.fuelModel || !this.fuelMoisture) {
                log.error('FireLookout', 'refresh', 'fuelModel and/or fuelMoisture is null.');
                return;
            }
            // Don't queue multiple requests. If a request comes in then 
            // just fire an immediate refresh after the current one finishes.
            if (this.refreshInProgress) {
                this.refreshPending = true;
                return;
            }
            this.refreshInProgress = true;

            // Note: using require() to get around circular dependency with Controller.
            var self = this,
                model = require("wmt/controller/Controller").model,
                globe = model.globe,
                d1 = $.Deferred(),
                d2 = $.Deferred(),
                weatherTuple;

            // Refresh Terrain
            this.terrain = globe.getTerrainAtLatLon(this.latitude, this.longitude);
            this.terrainTuple = terrainResource.makeTuple(this.terrain.aspect, this.terrain.slope, this.terrain.elevation);

            // Wait for async fuel conditioning updates to finish before computing fire behavior.
            // When the other "refresh" methods below "resolve" their deferred objects (d1 an d2),
            // then the .done() function will be executed, with v1 and v2 receiving the resolved 
            // objects. Note: the "when" and "done" arguments are position senstive (thus the numbering)
            $.when(d1, d2).done(function (v1, v2) {
                
                // Create a weather tuple for the current applciation time
                self.activeWeather = self.getForecastAtTime(model.applicationTime);
                weatherTuple = weatherResource.makeTuple(self.activeWeather);

                // Compute fire behavior
                surfaceFireResource.surfaceFire(
                    self.surfaceFuel, weatherTuple, self.terrainTuple,
                    function (json) { // Callback to process JSON result
                        //log.info('FireLookout', 'refresh-deferred', JSON.stringify(json));
                        self.surfaceFire = json;
                        log.info('FireLookout','refreshFireBehavior',self.name + ': EVENT_FIRE_BEHAVIOR_CHANGED');
                        self.fire(wmt.EVENT_FIRE_BEHAVIOR_CHANGED, self);

                        // Fire off another refresh if a request was queued while
                        // this request was being fullfilled.
                        self.refreshInProgress = false;
                        if (self.refreshPending) {
                            self.refreshPending = false;
                            setTimeout(self.refreshFireBehavior(), 0);
                        }
                    }
                );
            });
            
            // Coordinated refresh of sunlight and fuel using Deferred objects
            this.refreshSunlight(d1);
            this.refreshSurfaceFuel(d2);
        };


        /**
         * Retrieves a Sunlight object from the REST service. Resolves the given
         * Deferred object with this object's sunlight property.
         * @param {$.Deferred} deferred Deferred object that resolves with a sunlight object 
         * when the query and processing is complete.
         */
        FireLookout.prototype.refreshSunlight = function (deferred) {
            var self = this,
                model = require("wmt/controller/Controller").model;
            
            // Get the sunlight at this time and location
            solarResource.sunlightAtLatLonTime(this.latitude, this.longitude, model.applicationTime,
                function (json) { // Callback to process JSON result
                    self.sunlight = json;
                    if (deferred) {
                        deferred.resolve(self.sunlight);
                    }
                });

        };
        /**
         * Retrieves a SurfaceFuel object from the REST service. Resolves the given
         * Deferred object with this object's surfaceFuel property.
         * @param {$.Deferred} deferred Deferred object that resolves when the query and processing are complete.
         */
        FireLookout.prototype.refreshSurfaceFuel = function (deferred) {
            var self = this;
            // Get the conditioned fuel at this location
            surfaceFuelResource.surfaceFuel(
                this.fuelModel, this.fuelMoisture,
                function (json) { // Callback to process JSON result
                    //log.info('FireLookout', 'processSurfaceFuel', JSON.stringify(json));
                    self.processSurfaceFuel(json);
                    if (deferred) {
                        deferred.resolve(self.surfaceFuel);
                    }
                });

        };

        /**
         * Assigns the processed JSON data to this object's surfaceFuel property.
         * @param {JSON} json SurfaceFuel JSON object to be processed
         */
        FireLookout.prototype.processSurfaceFuel = function (json) {
            //log.info('FireLookout', 'processSurfaceFuel', JSON.stringify(json));
            this.surfaceFuel = json;
        };

        return FireLookout;

    }

);

