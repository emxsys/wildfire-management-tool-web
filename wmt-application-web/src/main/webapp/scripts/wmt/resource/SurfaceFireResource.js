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
        Log,
        Messenger,
        WmtUtil,
        Wmt) {
        "use strict";
        var SurfaceFuelResource = {

            /**
             * Gets a conditioned surface fuel tuple that is compatible with SurfaceFireResource.
             * 
             * @param {SurfaceFuel} fuel
             * @param {Weather} weather
             * @param {Terrain} terrain
             * @param {Function(SurfaceFire)} callback
             * @returns {undefined}
             */
            surfaceFire: function (fuel, weather, terrain, callback) {
                if (!window.FormData) {
                    // FormData is not supported; degrade gracefully/ alert the user as appropiate
                    Messenger.notify(Log.error("SurfaceFireResource", "surfaceFire", "formDataNotSupported"));
                    return;
                }

                var formData = new FormData();

                // This technique will passing SurfaceFuel, Weather and Terrain as text/plain.
                formData.append('mime-type', 'application/json');
                formData.append('fuel', JSON.stringify(fuel));
                formData.append('weather', JSON.stringify(weather));
                formData.append('terrain', JSON.stringify(terrain));
                
                $.ajax({
                    url: WmtUtil.currentDomain() + Wmt.SURFACEFUEL_REST_SERVICE,
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