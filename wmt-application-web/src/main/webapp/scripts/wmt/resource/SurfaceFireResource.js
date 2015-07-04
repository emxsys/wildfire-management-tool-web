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

define([
    'wmt/util/Log',
    'wmt/util/Messenger',
    'wmt/util/WmtUtil',
    'wmt/Wmt'],
    function (
        log,
        messenger,
        util,
        wmt) {
        "use strict";
        var SurfaceFireResource = {
            /**
             * Gets the computed fire behavior.
             * 
             * @param {SurfaceFuel} fuel The conditioned fuel.
             * @param {Weather} weather The fire weather.
             * @param {Terrain} terrain The slope, aspect and elevation.
             * @param {Function(JSON)} callback Receives a SurfaceFire JSON object. 
             * Example:
             * *{
             *    "aspect":{"type":"aspect:deg","value":"0.0","unit":"deg"},
             *    "directionMaxSpread":{"type":"dir_of_spread:deg","value":"90.0","unit":"deg"},
             *    "effectiveWindSpeed":{"type":"wind_speed:mph","value":"9.438677451444649"},
             *    "firelineIntensity":{"type":"fire_line_intensity:Btu/ft/s","value":"17611.45862983202"},
             *    "flameLength":{"type":"flame_length:ft","value":"40.39041953091098","unit":"international foot"},
             *    "fuelBed":{"fuelModel":{
             *            "modelNo":"4",
             *            "modelCode":"#4",
             *            "modelName":"Chaparral (6 feet)",
             *            "modelGroup":"Original 13",
             *            "dynamic":"false",
             *            "dead1HrFuelLoad":{"type":"fuel_load:kg/m2","value":"1.1230883661399034"},
             *            "dead10HrFuelLoad":{"type":"fuel_load:kg/m2","value":"0.8989190315810404"},
             *            "dead100HrFuelLoad":{"type":"fuel_load:kg/m2","value":"0.4483386691177259"},
             *            "liveHerbFuelLoad":{"type":"fuel_load:kg/m2","value":"0.0"},
             *            "liveWoodyFuelLoad":{"type":"fuel_load:kg/m2","value":"1.1230883661399034"},
             *            "dead1HrSAVRatio":{"type":"surface_to_volume:m2/m3","value":"6561.679790026247"},
             *            "dead10HrSAVRatio":{"type":"surface_to_volume:m2/m3","value":"357.6115485564305"},
             *            "dead100HrSAVRatio":{"type":"surface_to_volume:m2/m3","value":"98.4251968503937"},
             *            "liveHerbSAVRatio":{"type":"surface_to_volume:m2/m3","value":"0.0"},
             *            "liveWoodySAVRatio":{"type":"surface_to_volume:m2/m3","value":"4921.259842519685"},
             *            "fuelBedDepth":{"type":"fuel_depth:m","value":"1.8287999999999998","unit":"m"},
             *            "moistureOfExtinction":{"type":"moisture_of_extinction:%","value":"20.0","unit":"%"},
             *            "lowHeatContent":{"type":"heat_content:kJ/kg","value":"18608.0"},
             *            "burnable":"true"},
             *        "fuelMoisture":{
             *            "dead1HrFuelMoisture":{"type":"fuel_moisture_1h:%","value":"3.0","unit":"%"},
             *            "dead10HrFuelMoisture":{"type":"fuel_moisture_10h:%","value":"4.0","unit":"%"},
             *            "dead100HrFuelMoisture":{"type":"fuel_moisture_100h:%","value":"5.0","unit":"%"},
             *            "liveHerbFuelMoisture":{"type":"fuel_moisture_herb:%","value":"30.0","unit":"%"},
             *            "liveWoodyFuelMoisture":{"type":"fuel_moisture_woody:%","value":"60.0","unit":"%"}},
             *        "fuelTemperature":{"type":"GENERIC_REAL","value":"NaN","unit":"UniversalUnit"},
             *        "meanBulkDensity":{"type":"bulk_density:lb/ft3","value":"0.12266556382050901"},
             *        "fuelParticleDensity":{"type":"particle_density:lb/ft3","value":"32.0"},
             *        "meanPackingRatio":{"type":"mean_packing_ratio","value":"0.0038332988693909067","unit":""},
             *        "optimalPackingRatio":{"type":"optimal_packing_ratio","value":"0.007434592860248393","unit":""},
             *        "relativePackingRatio":{"type":"relative_packing_ratio","value":"0.5156030654868752","unit":""},
             *        "characteristicSAV":{"type":"fuel_complex:ft2/ft3","value":"1739.2294964144478"},
             *        "liveMoistureOfExt":{"type":"live_moisture_of_ext:%","value":"372.7662233555347","unit":"%"},
             *        "mineralDamping":{"type":"mineral_damping_coefficient","value":"0.4173969279093913","unit":""},
             *        "moistureDamping":{"type":"moisture_damping_coefficient","value":"0.3051252202538136","unit":""},
             *        "lowHeatContent":{"type":"heat_content:Btu/lb","value":"8000.0"},
             *        "reactionVelocity":{"type":"reaction_velocity:1/min","value":"14.155533132296872","unit":""},
             *        "reactionIntensity":{"type":"reaction_intensity:BTU/ft2/min","value":"14422.600430267765"},
             *        "flameResidenceTime":{"type":"GENERIC_REAL","value":"0.22078742385156463","unit":"UniversalUnit"},
             *        "heatRelease":{"type":"GENERIC_REAL","value":"3184.3287942392876","unit":"UniversalUnit"},
             *        "propagatingFluxRatio":{"type":"GENERIC_REAL","value":"0.03220906883716744","unit":"UniversalUnit"},
             *        "heatSink":{"type":"GENERIC_REAL","value":"61.16207627186109","unit":"UniversalUnit"},
             *        "burnable":"true"},
             *    "midFlameWindSpeed":{"type":"wind_speed:mph","value":"9.43867745144465"},
             *    "rateOfSpreadBacking":{"type":"rate_of_spread:ft/min","value":"7.694603402126751"},
             *    "rateOfSpreadFlanking":{"type":"rate_of_spread:ft/min","value":"15.040453368827198"},
             *    "rateOfSpreadMax":{"type":"rate_of_spread:ft/min","value":"331.83995311713915"},
             *    "rateOfSpreadNoWindNoSlope":{"type":"rate_of_spread:ft/min","value":"7.595205368840233"},
             *    "slope":{"type":"slope:deg","value":"0.0","unit":"deg"},
             *    "windDirection":{"type":"wind_dir:deg","value":"270.0","unit":"deg"}
             *}
             */
            surfaceFire: function (fuel, weather, terrain, callback) {
                if (!window.FormData) {
                    // FormData is not supported; degrade gracefully/ alert the user as appropiate
                    messenger.notify(log.error("SurfaceFireResource", "surfaceFire", "formDataNotSupported"));
                    return;
                }

                var url = util.currentDomain() + wmt.SURFACEFIRE_REST_SERVICE,
                    formData = new FormData();

                // This technique will passing SurfaceFuel, Weather and Terrain as text/plain.
                formData.append('mime-type', 'application/json');
                formData.append('fuel', JSON.stringify(fuel));
                formData.append('weather', JSON.stringify(weather));
                formData.append('terrain', JSON.stringify(terrain));

                //console.log(url + formData.toString());
                $.ajax({
                    url: url,
                    data: formData,
                    cache: false, // tell the browser not to serve up cached data
                    contentType: false, // tell jQuery not auto encode as application/x-www-form-urlencoded
                    dataType: "json", // tell the server what kind of response we want
                    processData: false, // tell jQuery not to transform data into query string
                    type: 'POST',
                    success: function (data) {
                        callback(data);
                    }
                });
            }
        };
        return SurfaceFireResource;
    }
);