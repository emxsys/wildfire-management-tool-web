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
 * 
 * @param {Log} log Consol logger.
 * @param {WmtUtil} util Utilities.
 * @param {Wmt} wmt Constants.
 * @returns {FuelMoistureResource}
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/util/Log',
    'wmt/util/WmtUtil',
    'wmt/Wmt'],
    function (
        log,
        util,
        wmt) {
        "use strict";
        var FuelMoistureResource = {
            /**
             * 
             * @param {String} conditions  Either "hot_and_dry", "cool_and_wet", or
             * "between_hot_and_cool". 
             * @param {Function(JSON)} callback Receives a FuelMoisture JSON object.
             */
            fuelMoistureTuple: function (conditions, callback) {
                // TODO: Assert conditions are valid
                var url = util.currentDomain() + wmt.FUELMOISTURE_REST_SERVICE,
                    query = "mime-type=application/json"
                    + "&conditions=" + conditions;
                console.log(url + '?' + query);
                $.get(url, query, callback);
            },
            /**
             * Returns a JSON array of fuel moisture scenarios. E.g.,
             * {
             *  "scenario" : [ {
             *    "name" : "Very Low Dead, Fully Cured Herb",
             *    "fuelMoisture" : {
             *      "dead1HrFuelMoisture" : {
             *        "type" : "fuel_moisture_1h:%",
             *        "value" : "3.0",
             *        "unit" : "%"
             *      },
             *      "dead10HrFuelMoisture" : {
             *        "type" : "fuel_moisture_10h:%",
             *        "value" : "4.0",
             *        "unit" : "%"
             *      },
             *      "dead100HrFuelMoisture" : {
             *        "type" : "fuel_moisture_100h:%",
             *        "value" : "5.0",
             *        "unit" : "%"
             *      },
             *      "liveHerbFuelMoisture" : {
             *        "type" : "fuel_moisture_herb:%",
             *        "value" : "30.0",
             *        "unit" : "%"
             *      },
             *      "liveWoodyFuelMoisture" : {
             *        "type" : "fuel_moisture_woody:%",
             *        "value" : "60.0",
             *        "unit" : "%"
             *      }
             *    }
             *  }, {
             *  ...
             *  } ]
             *}
             */
            fuelMoistureScenarios: function (callback, async) {
                // TODO: Assert conditions are valid
                var url = util.currentDomain() + wmt.FUELMOISTURE_REST_SERVICE + "/scenarios",
                    query = "mime-type=application/json";
                
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
            }
        };
        return FuelMoistureResource;
    }
);