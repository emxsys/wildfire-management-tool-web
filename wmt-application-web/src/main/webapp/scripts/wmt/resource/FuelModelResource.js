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
/*
 * 
 * @param {type} Log
 * @param {type} WmtUtil
 * @param {type} Wmt
 * @returns {FuelModelResource_L39.FuelModelResource}
 */
define([
    'wmt/util/Log',
    'wmt/util/WmtUtil',
    'wmt/Wmt'],
    function (
        Log,
        WmtUtil,
        Wmt) {
        "use strict";
        var FuelModelResource = {
            /**
             * 
             * @param {String} category Fuel model category: either "all", "standard" or "original".
             * @param {Function(FuelModel JSON)} callback Receives an array of fuel model JSON objects.
             * @param {Boolean} async If true, performs asynchronous request.
             */
            fuelModels: function (category, callback, async) {

                var url = WmtUtil.currentDomain() + Wmt.FUELMODELS_REST_SERVICE,
                    query = "mime-type=application/json"
                    + "&category=" + category;
                console.log(url + '?' + query);

                if (async === undefined || async) {
                    $.get(url, query, callback);
                }
                else {
                    $.ajax({
                        url: url,
                        data: query,
                        success: callback,
                        async: false
                    });
                }
            },
            /**
             * Gets a fuel model JSON object for the given fuel model identifier.
             * @param {String} modelNo Fuel model number.
             * @param {Function(JSON)} callback Receives an individual fuel model JSON objects. Example:
             * {
             *    "modelNo":"6",
             *    "modelCode":"#6",
             *    "modelName":"Dormant brush, hardwood slash",
             *    "modelGroup":"Original 13",
             *    "dynamic":"false",
             *    "dead1HrFuelLoad":{"type":"fuel_load:kg/m2","value":"0.33625400183829446"},
             *    "dead10HrFuelLoad":{"type":"fuel_load:kg/m2","value":"0.5604233363971574"},
             *    "dead100HrFuelLoad":{"type":"fuel_load:kg/m2","value":"0.4483386691177259"},
             *    "liveHerbFuelLoad":{"type":"fuel_load:kg/m2","value":"0.0"},
             *    "liveWoodyFuelLoad":{"type":"fuel_load:kg/m2","value":"0.0"},
             *    "dead1HrSAVRatio":{"type":"surface_to_volume:m2/m3","value":"5741.469816272966"},
             *    "dead10HrSAVRatio":{"type":"surface_to_volume:m2/m3","value":"357.6115485564305"},
             *    "dead100HrSAVRatio":{"type":"surface_to_volume:m2/m3","value":"98.4251968503937"},
             *    "liveHerbSAVRatio":{"type":"surface_to_volume:m2/m3","value":"0.0"},
             *    "liveWoodySAVRatio":{"type":"surface_to_volume:m2/m3","value":"0.0"},
             *    "fuelBedDepth":{"type":"fuel_depth:m","value":"0.7619999999999999","unit":"m"},
             *    "moistureOfExtinction":{"type":"moisture_of_extinction:%","value":"25.0","unit":"%"},
             *    "lowHeatContent":{"type":"heat_content:kJ/kg","value":"18608.0"},
             *    "burnable":"true"
             *};
             */
            fuelModel: function (modelNo, callback) {
                var url = WmtUtil.currentDomain() + Wmt.FUELMODELS_REST_SERVICE + "/" + modelNo,
                    query = "mime-type=application/json";
                console.log(url + '?' + query);
                // Deferred callback - synchronous
                $.when($.get(url, query)).then(function (data, textStatus, jqXHR) {
                    // when all AJAX requests are complete
                    callback(data);
                });
            }
        };
        return FuelModelResource;
    }
);