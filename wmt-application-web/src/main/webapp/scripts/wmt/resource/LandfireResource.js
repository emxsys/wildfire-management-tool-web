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
 * @param {Log} log
 * @param {WmtUtil} util
 * @param {Wmt} wmt
 * @returns {LandfireResource}
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
        var LandfireResource = {
            /**
             * Identfies the "original 13" fuel model no at the given lat/lon.
             * @param {Number} latitude
             * @param {Number} longitude
             * @param {Function(String)} callback function(value){} receives fuel model no.
             * 
             */
            FBFM13: function (latitude, longitude, callback) {
                this.identify(latitude, longitude, '7', callback);
            },
            /**
             * Identfies the "standard 40" fuel model no at the given lat/lon.
             * @param {Number} latitude
             * @param {Number} longitude
             * @param {Function(String)} callback function(value){} receives fuel model no.
             */
            FBFM40: function (latitude, longitude, callback) {
                this.identify(latitude, longitude, '8', callback);
            },
            /**
             * Identifies the LANDFIRE ArcGIS REST MapService value at the given lat/lon. 
             * @param {Number} latitude
             * @param {Number} longitude
             * @param {String} layerId
             * @param {Function(String)} callback Callback: function(value){} receives map layer value at lat/lon.
             */
            identify: function (latitude, longitude, layerId, callback) {
                var url = wmt.LANDFIRE_REST_SERVICE + '/identify',
                    query = 'geometry=' + longitude + ',' + latitude    // x,y
                    + '&geometryType=esriGeometryPoint'
                    + '&sr=4326'
                    + '&layers=all:' + layerId 
                    + '&mapExtent=' + longitude + ',' + latitude + ',' + longitude + ',' + latitude
                    + '&imageDisplay=1,1,96'    // width, height, dpi
                    + '&returnGeometry=false'
                    + '&tolerance=1'
                    + '&f=json';

                console.log(url + '?' + query);
                
                // Example response from a fuel model layer (w/o return geometry);
                // Pixel Value contains the map layer's encoded value at the given lat/lon.
                // 
                // { "results": 
                //  [
                //   {
                //    "layerId": 7,
                //    "layerName": "US_130FBFM13",
                //    "displayFieldName": "",
                //    "attributes": {
                //     "Pixel Value": "4",
                //     "OID": "3",
                //     "FBFM13": "FBFM4",
                //     "RED": "1",
                //     "GREEN": "0.827451",
                //     "BLUE": "0.498039",
                //     "R": "255",
                //     "G": "211",
                //     "B": "127"
                //    }
                //   }
                //  ]
                // }

                $.ajax({
                    url: url,
                    data: query,
                    success: function (response) {
                        var json = JSON.parse(response),
                            value = json.results[0].attributes['Pixel Value'];

                        callback(value);
                    }
                });
            }

        };
        return LandfireResource;
    }
);