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

/*global define */

/**
 * The GeoMAC MODIS Thermal Satellite map layer.
 * 
 * See: http://wildfire.cr.usgs.gov/ArcGIS/services/geomac_dyn/MapServer/WMSServer?request=GetCapabilities&service=WMS
 * 
 * @returns {GeoMacModisThermalSatelliteLayer}
 */

define([
    'wmt/Wmt',
    'worldwind'],
    function (
        wmt,
        ww) {
        "use strict";

        /**
         * Constructs a GeoMAC Current Fire Perimeters map layer.
         * @constructor
         * @augments WmsLayer
         */
        var GeoMacModisThermalSatelliteLayer = function () {
            var cfg = {
                title: "MODIS Thermal Satellite",
                version: "1.3.0",
                service: "http://wildfire.cr.usgs.gov/ArcGIS/services/geomac_dyn/MapServer/WMSServer?",
                layerNames: "MODIS Fire Detection",
                sector: new WorldWind.Sector(13.000340, 68.141919, -165.117579, -65.333160),
                levelZeroDelta: new WorldWind.Location(36, 36),
                numLevels: 8,
                format: "image/png",
                size: 512,
                coordinateSystem: "EPSG:4326", // optional
                styleNames: "" // (optional): {String} A comma separated list of the styles to include in this layer.</li>
            };

            WorldWind.WmsLayer.call(this, cfg);

            // Make this layer translucent
            this.opacity = 0.5;

        };

        GeoMacModisThermalSatelliteLayer.prototype = Object.create(WorldWind.WmsLayer.prototype);

        return GeoMacModisThermalSatelliteLayer;
    }
);