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

/**
 * The FuelModelCatalog manages a collection of fuel model objects.
 *
 * @param {FuelModelResource} restService WMT REST service
 * @param {Log} log Console logger.
 * @returns {FuelModelCatalog}
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/resource/FuelModelResource',
    'wmt/util/Log'],
    function (
        restService,
        log) {
        "use strict";
        var FuelModelCatalog = {
            initialize: function () {
                /**
                 * Standard 40 fuel models
                 */
                this.standard = null;
                /**
                 * Original 13 fuel models
                 */
                this.original = null;
                /**
                 * Custom fuel models
                 */
                this.custom = null;
                /** 
                 * Loads this catalog with the Original 13 and Standard 40 fuel model collections.
                 */
                var self = this;
                restService.fuelModels("original", function (json) {
                    self.original = json.fuelModel;
                }, false);   // async = false
                restService.fuelModels("standard", function (json) {
                    self.standard = json.fuelModel;
                }, false);   // async = false
            },
            /**
             * Gets the fuel model for the given fuel model idenfifier.
             * @param {Number} fuelModelNo
             * @param {String} group Model group: "standard40", "original13" or "any". Default: "any".
             * @returns {Object} A JSON FuelModel object.
             * * E.g.:
             * {
             * "modelNo" : "6",
             *  "modelCode" : "#6",
             *  "modelName" : "Dormant brush, hardwood slash",
             *  "modelGroup" : "Original 13",
             *  "dynamic" : "false",
             *  "dead1HrFuelLoad" : {
             *    "type" : "fuel_load:kg/m2",
             *    "value" : "0.33625400183829446"
             *  },
             *  "dead10HrFuelLoad" : {
             *    "type" : "fuel_load:kg/m2",
             *    "value" : "0.5604233363971574"
             *  },
             *  "dead100HrFuelLoad" : {
             *    "type" : "fuel_load:kg/m2",
             *    "value" : "0.4483386691177259"
             *  },
             *  "liveHerbFuelLoad" : {
             *    "type" : "fuel_load:kg/m2",
             *    "value" : "0.0"
             *  },
             *  "liveWoodyFuelLoad" : {
             *    "type" : "fuel_load:kg/m2",
             *    "value" : "0.0"
             *  },
             *  "dead1HrSAVRatio" : {
             *    "type" : "surface_to_volume:m2/m3",
             *    "value" : "5741.469816272966"
             *  },
             *  "dead10HrSAVRatio" : {
             *    "type" : "surface_to_volume:m2/m3",
             *    "value" : "357.6115485564305"
             *  },
             *  "dead100HrSAVRatio" : {
             *    "type" : "surface_to_volume:m2/m3",
             *    "value" : "98.4251968503937"
             *  },
             *  "liveHerbSAVRatio" : {
             *    "type" : "surface_to_volume:m2/m3",
             *    "value" : "0.0"
             *  },
             *  "liveWoodySAVRatio" : {
             *    "type" : "surface_to_volume:m2/m3",
             *    "value" : "0.0"
             *  },
             *  "fuelBedDepth" : {
             *   "type" : "fuel_depth:m",
             *    "value" : "0.7619999999999999",
             *    "unit" : "m"
             *  },
             *  "moistureOfExtinction" : {
             *    "type" : "moisture_of_extinction:%",
             *    "value" : "25.0",
             *    "unit" : "%"
             *  },
             *  "lowHeatContent" : {
             *    "type" : "heat_content:kJ/kg",
             *    "value" : "18608.0"
             *  },
             *  "burnable" : "true"
             *}
             */
            getFuelModel: function (fuelModelNo, group) {
                var grp = group || 'any',
                    fuelModel = null,
                    self = this;

                // TODO: Add custom fuel model processing
                if (grp === 'standard40' || grp === 'any') {
                    fuelModel = this.findFuelModel(fuelModelNo, this.standard);
                }
                if (!fuelModel && (grp === 'original13' || grp === 'any')) {
                    fuelModel = FuelModelCatalog.findFuelModel(fuelModelNo, this.original);
                }
                if (!fuelModel) {
                    log.warning('FuelModelCatalog', 'getFuelModel', 'No fuel model found for #' + fuelModelNo);
                }
                return fuelModel;
            },
            /**
             * Returns the fuel model item with the matching fuel model no.
             * @param {type} fuelModelNo Unique model no.
             * @param {type} array Fuel model array
             * @returns {Object} JSON fuel model object.
             */
            findFuelModel: function (fuelModelNo, array) {
                var i, max;

                if (!array || array.length === 0) {
                    log.error('FuelModelCatalog', 'findFuelModel', 'The array arg is null or empty.');
                    return null;
                }
                for (i = 0, max = array.length; i < max; i++) {
                    if (array[i].modelNo === fuelModelNo.toString()) {
                        return array[i];
                    }
                }
                return null;
            }
        };
        return FuelModelCatalog;
    });
