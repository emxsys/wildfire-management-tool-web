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
 * The USGS TNM Topo Base Map layer.
 * 
 * See: http://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WMSServer?request=GetCapabilities&service=WMS
 * 
 * @returns {UsgsTopoBaseMapLayer}
 */

define([
    'wmt/Wmt',
    'worldwind'],
    function (
        wmt,
        ww) {
        "use strict";

        /**
         * Constructs a USGS Topo map layer.
         * @constructor
         * @augments WmsLayer
         */
        var UsgsTopoBaseMapLayer = function () {
            var cfg = {
                title: "USGS Topo Basemap",
                version: "1.3.0",
                service: "http://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WmsServer?",
                layerNames: "0",
                sector: new WorldWind.Sector(-90.0, 90.0, -180, 180),
                levelZeroDelta: new WorldWind.Location(36, 36),
                numLevels: 12,
                format: "image/png",
                size: 512,
                coordinateSystem: "EPSG:4326", // optional
                styleNames: "" // (optional): {String} A comma separated list of the styles to include in this layer.</li>
            };

            WorldWind.WmsLayer.call(this, cfg);

            // Make this layer opaque
            this.opacity = 1.0;

            // Requesting tiles with transparency (the nominal case) causes the layer's labels to bleed 
            // the underlying background layer which makes for a rather ugly map.
            this.urlBuilder.transparent = false;
        };

        UsgsTopoBaseMapLayer.prototype = Object.create(WorldWind.WmsLayer.prototype);

        return UsgsTopoBaseMapLayer;
    }
);