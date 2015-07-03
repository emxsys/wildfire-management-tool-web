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
    'wmt/resource/FuelModelResource',
    'wmt/util/Log'],
    function (
        webResource,
        log) {
        "use strict";
        var FuelModelCatalog = function () {
            this.standard40 = [];
            this.original13 = [];
            /** 
             * Loads this catalog with the Original 13 and Standard 40 fuel model collections.
             */
            var self = this;
            webResource.fuelModels("original", function (json) {
                self.original13 = json.fuelModel;
            });
            webResource.fuelModels("standard", function (json) {
                self.standard40 = json.fuelModel;
            });
        };
        /**
         * Gets the fuel model for the given fuel model idenfifier
         * @param {Number} fuelModelNo
         * @param {String} group Model group: "standard40", "original13" or "any". Default: "any".
         * @returns {Object} A JSON FuelModel object.
         */
        FuelModelCatalog.prototype.getFuelModel = function (fuelModelNo, group) {
            var grp = group || 'any',
                fuelModel = null;

            // TODO: Add custom fuel model processing
            if (grp === 'standard40' || grp === 'any') {
                fuelModel = FuelModelCatalog.findFuelModel(fuelModelNo, this.standard40);
            }
            if (!fuelModel && (grp === 'original13' || grp === 'any')) {
                fuelModel = FuelModelCatalog.findFuelModel(fuelModelNo, this.original13);
            }
            if (!fuelModel) {
                log.warning('FuelModelCatalog', 'getFuelModel', 'No fuel model found for #' + fuelModelNo);
            }
            return fuelModel;
        };

        /**
         * Returns the fuel model item with the matching fuel model no.
         * @param {type} fuelModelNo Unique model no.
         * @param {type} array Fuel model array
         * @returns {Object} JSON fuel model object.
         */
        FuelModelCatalog.findFuelModel = function (fuelModelNo, array) {
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
        };
        return FuelModelCatalog;
    });
