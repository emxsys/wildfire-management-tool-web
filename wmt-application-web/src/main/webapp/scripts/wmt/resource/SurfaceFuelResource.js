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
    '../util/Log',
    '../util/WmtUtil',
    '../Wmt'],
    function (
        Log,
        WmtUtil,
        Wmt) {
        "use strict";
        var SurfaceFuelResource = {
            /**
             * Gets a conditioned surface fuel tuple that is compatible with SurfaceFireResource.
             * 
             * @param {FuelModel} fuelModel A fuel model object.
             * @param {FuelMoisture} fuelMoisture A fuel moisture tuple object.
             * @param {SurfaceFuel} callback Recieves a SurfaceFuel JSON object.
             */
            surfaceFuel: function (fuelModel, fuelMoisture, callback) {
                var data = new FormData();

                //data.append('fuelModel', JSON.stringify(fuelModel));
                //data.append('fuelMoisture', JSON.stringify(fuelMoisture));
                data.append('fuelModel', fuelModel);
                data.append('fuelMoisture', fuelMoisture);
                data.append('mime-type', 'application/json');

                $.ajax({
                    url: WmtUtil.currentDomain() + Wmt.SURFACEFUEL_REST_SERVICE,
                    data: data,
                    //contentType: "multipart/form-data",
                    contentType: false,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    type: 'POST',
                    success: function (data) {
                        alert(data);
                    }
                });
            }
        };
        return SurfaceFuelResource;
    }
);