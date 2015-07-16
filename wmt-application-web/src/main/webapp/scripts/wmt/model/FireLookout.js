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
                deferredSunlight = $.Deferred(),
                deferredFuel = $.Deferred(),
                weatherTuple,
                terrainTuple,
                shaded = 'false';

            // Create a weather tuple for the current applciation time
            this.activeWeather = this.getForecastAtTime(model.applicationTime);
            weatherTuple = weatherResource.makeTuple(self.activeWeather);
            // Refresh Terrain
            this.terrain = globe.getTerrainAtLatLon(this.latitude, this.longitude);
            terrainTuple = terrainResource.makeTuple(this.terrain.aspect, this.terrain.slope, this.terrain.elevation);

            // Get the sunlight at this time and place,
            // resolving deferredSunlight when done.
            this.refreshSunlight(deferredSunlight);

            // Get conditioned fuel using current environmental values
            // when the deferred sunlight is resolved
            $.when(deferredSunlight).done(function (resolvedSunlight) {
                // Get conditioned fuel at this location,
                // resolving deferredFuel when complete
                self.refreshSurfaceFuel(
                    self.fuelModel,
                    resolvedSunlight,
                    weatherTuple,
                    terrainTuple,
                    shaded,
                    self.fuelMoisture, 
                    deferredFuel);
            });
            
            // Compute the fire behaivor after the 
            // conditioned fuel is resolved.
            $.when(deferredFuel).done(function (resolvedFuel) {
                // Retrieve the computed fire behavior using 
                // conditioned fuel, weather and terrain.
                surfaceFireResource.surfaceFire(
                    resolvedFuel, weatherTuple, terrainTuple,
                    function (json) { 
                        //Callback to process JSON result
                        //log.info('FireLookout', 'refresh-deferred', JSON.stringify(json));
                        self.surfaceFire = json;

                        log.info('FireLookout', 'refreshFireBehavior', self.name + ': EVENT_FIRE_BEHAVIOR_CHANGED');
                        self.fire(wmt.EVENT_FIRE_BEHAVIOR_CHANGED, self);

                        // Fire off another refresh if a request was queued 
                        // while this request was being fullfilled.
                        self.refreshInProgress = false;
                        if (self.refreshPending) {
                            self.refreshPending = false;
                            setTimeout(self.refreshFireBehavior(), 0);
                        }
                    }
                );
            });
        };


        /**
         * Retrieves a Sunlight object from the REST service. Resolves the
         * optional Deferred object with this object's sunlight property.
         * 
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
         * Retrieves a SurfaceFuel object from the REST service. Resolves the optional 
         * Deferred object with this object's surfaceFuel property.
         * 
         * @param {type} fuelModel
         * @param {type} sunlight
         * @param {type} weatherTuple
         * @param {type} terrainTuple
         * @param {type} shaded
         * @param {type} fuelMoisture
         * @param {$.Deferred} deferredFuel Deferred object that is resolved with the surface fuel 
         * when the query and processing are complete.
         */
        FireLookout.prototype.refreshSurfaceFuel = function (fuelModel, sunlight, weatherTuple, terrainTuple, shaded,
            fuelMoisture, deferredFuel) {
            var self = this;
            // Get the conditioned fuel at this location
            surfaceFuelResource.conditionedSurfaceFuel(
                fuelModel, sunlight, weatherTuple, terrainTuple, shaded, fuelMoisture,
                function (json) { // Callback to process JSON result
                    //log.info('FireLookout', 'processSurfaceFuel', JSON.stringify(json));
                    self.surfaceFuel = json;
                    if (deferredFuel) {
                        deferredFuel.resolve(self.surfaceFuel);
                    }
                });

        };

        return FireLookout;

    }

);

