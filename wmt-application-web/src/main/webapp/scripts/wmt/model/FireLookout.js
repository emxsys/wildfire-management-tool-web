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

/*global define*/

define([
    'wmt/view/FireLookoutDialog',
    'wmt/model/FuelModelCatalog',
    'wmt/model/FuelMoistureCatalog',
    'wmt/util/Log',
    'wmt/util/Messenger',
    'wmt/resource/SurfaceFireResource',
    'wmt/resource/SurfaceFuelResource',
    'wmt/resource/TerrainResource',
    'wmt/resource/WeatherResource',
    'wmt/model/WeatherScout',
    'wmt/util/WmtUtil',
    'wmt/Wmt'],
    function (
        dialog,
        fuelModels,
        fuelMoistureScenarios,
        log,
        messenger,
        surfaceFireService,
        surfaceFuelService,
        terrainService,
        weatherService,
        WeatherScout,
        util,
        wmt) {
        "use strict";

        var FireLookout = function (name, latitude, longitude, id) {

            // Inherit the weather forecasting capabilites of the WeatherScout
            WeatherScout.call(this, name, 24, null, latitude, longitude, id);

            // Override the WeatherScout name set by the parent
            this.name = name || 'Fire Lookout';

            this.terrainTuple = terrainService.makeTuple(0, 0, 0);
            this.fuelModel = fuelModels.getFuelModel(4);
            this.fuelMoisture = fuelMoistureScenarios.getScenario('Very Low Dead, Fully Cured Herb');
            this.terrainTuple = terrainService.makeTuple(0, 0, 0);
            this.surfaceFuel = null;
            this.requestFireBehavior();

            // Override the parent WeatherScout's Openable implementation
            // with a FireLookoutDialog
            var self = this;
            this.openMe = function () {
                dialog.show(self);
            };



        };
        FireLookout.prototype = Object.create(WeatherScout.prototype);


        /**
         * Updates the weather lookout's weather forecast and location. 
         */
        FireLookout.prototype.refresh = function () {
            //this.refreshForecast();
            //this.refreshPlace();
        };

        /**
         * Updates this object's weather attribute. 
         */
        FireLookout.prototype.requestFireBehavior = function () {
            if (!this.fuelModel || !this.fuelMoisture) {
                log.info('FireLookout', 'requestFireBehavior', 'fuelModel and/or fuelMoisture is null.');
                return;
            }
            var self = this,
                d1 = $.Deferred(),
                d2 = $.Deferred(),
                d3 = $.Deferred();

            $.when(d1, d2).done(function (v1, v2) {
                log.info('FireLookout', 'surfaceFuel', JSON.stringify(v1));
                log.info('FireLookout', 'weather', JSON.stringify(v2));
                // Get the conditioned fuel at this location
                
                surfaceFireService.surfaceFire(
                    self.surfaceFuel, self.weatherTuple, self.terrainTuple,
                    function (json) { // Callback to process JSON result
                        log.info('FireLookout', 'processSurfaceFire', JSON.stringify(json));
                        self.surfaceFire = json;
                    }
                );

            });

            // Get the conditioned fuel at this location
            surfaceFuelService.surfaceFuel(
                this.fuelModel, this.fuelMoisture,
                function (json) { // Callback to process JSON result
                    log.info('FireLookout', 'processSurfaceFuel', JSON.stringify(json));
                    self.surfaceFuel = json;
                    d1.resolve(json);
                });

//            terrainService.terrainTuple(0, 0, 0,
//                function (json) { // Callback to process JSON result
//                    log.info('FireLookout', 'terrain', JSON.stringify(json));
//                    self.terrainTuple = json;
//                }
//            );
            weatherService.weatherTuple(65, 20, 15, 270, 10,
                function (json) { // Callback to process JSON result
                    log.info('FireLookout', 'weather', JSON.stringify(json));
                    self.weatherTuple = json;
                    d2.resolve(json);
                }
            );

        };


        /**
         * 
         * @param {type} json
         */
        FireLookout.prototype.processSurfaceFuel = function (json) {
            log.info('FireLookout', 'processSurfaceFuel', JSON.stringify(json));
            this.surfaceFuel = json;
        };

        return FireLookout;

    }

);

