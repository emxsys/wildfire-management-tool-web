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
    'wmt/util/WmtUtil',
    'wmt/Wmt'],
    function (
        Log,
        WmtUtil,
        Wmt) {
        "use strict";
        var PlaceResource = {
            /**
             * 
             * @param {type} latitude
             * @param {type} longitude
             * @param {type} callback
             * @returns {undefined}
             */
            places: function (latitude, longitude, callback) {
                // TODO: assert input values
                // See: https://developer.yahoo.com/yql/console/#h=desc+geo.places
                // And: http://real.developer.yahoo.com/geo/geoplanet/guide/yql-tables.html#geo-places
                var url = 'https://query.yahooapis.com/v1/public/yql',
                    query ='q=select * from geo.places where '
                    + 'text="'+ latitude + ' ' + longitude + '"' 
                    + '&format=json'
                    + '&diagnostics=true'
                    + '&callback=';
                console.log(url + '?' + query);
                $.get(url, query, callback);
            },
            /**
             * 
             * @param {type} latitude
             * @param {type} longitude
             * @param {type} callback
             * @returns {undefined}
             */
            placefinder: function (latitude, longitude, callback) {
                // TODO: assert input values
                // Yahoo Query Language (YQL) API call
                // https://developer.yahoo.com/yql/console/#h=desc+geo.placefinder
                var url = 'https://query.yahooapis.com/v1/public/yql',
                    query ='q=select * from geo.placefinder where '
                    + 'text="'+ latitude + ' ' + longitude + '" and gflags="R"'
                    + '&format=json'
                    + '&diagnostics=true'
                    + '&callback=';
                console.log(url + '?' + query);
                $.get(url, query, callback);
            },
            /**
             * 
             * @param {String} Address, place name, airport code, or coordinates.
             * @param {Function(JSON)} callback Function that recieves the JSON results.
             */
            gazetteer: function (place, callback) {
                // TODO: assert input values
                // https://developer.yahoo.com/yql/console/#h=desc+geo.placefinder
                var url = 'https://query.yahooapis.com/v1/public/yql',
                    query ='q=select * from geo.placefinder where '
                    + 'text="'+  place + '"'
                    + '&format=json'
                    + '&diagnostics=true'
                    + '&callback=';
                console.log(url + '?' + query);
                $.get(url, query, callback);
            }
        };
        return PlaceResource;
    }
);