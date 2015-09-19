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
 * The GIBS Earth at Night product. 
 * This layer is a single composite of data from nine days in April 2012 and 13 days in October 2012. 
 * It does not vary over time.
 * 
 * @returns {EarthAtNightLayer}
 */

define([
    'wmt/Wmt',
    'worldwind'],
    function (
        wmt,
        ww) {
        "use strict";

        /**
         * Constructs a EarthAtNight map layer.
         * @constructor
         * @augments WmtsLayer
         */
        var EarthAtNightLayer = function () {

            var request = new XMLHttpRequest(),
                url = 'http://map1.vis.earthdata.nasa.gov/wmts-geo/1.0.0/WMTSCapabilities.xml',
                wmtsCaps,
                layerCaps,
                i, max, layer;


            request.open("GET", url, true);
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    var xmlDom = request.responseXML;

                    if (!xmlDom && request.responseText.indexOf("<?xml") === 0) {
                        xmlDom = new window.DOMParser().parseFromString(request.responseText, "text/xml");
                    }

                    if (!xmlDom) {
                        alert(url + " retrieval failed.");
                        return;
                    }

                    wmtsCaps = new WorldWind.WmtsCapabilities(xmlDom);
                    for (i = 0, max = wmtsCaps.contents.layer.length; i < max; i++) {
                        if (wmtsCaps.contents.layer[i].title === 'VIIRS_EarthAtNight_2012') {
                            layerCaps = wmtsCaps.contents.layer[i];
                            break;
                        }
                    }

                } else if (request.readyState === 4) {
                    if (request.statusText) {
                        alert(request.responseURL + " " + request.status + " (" + request.statusText + ")");
                    } else {
                        alert("Failed to retrieve WMS capabilities from " + url + ".");
                    }
                }
            };
            request.send(null);

            WorldWind.WmtsLayer.call(this, layerCaps, null, null);

            // Make this layer translucent
            this.opacity = 0.5;

        };

        EarthAtNightLayer.prototype = Object.create(WorldWind.WmtsLayer.prototype);

        return EarthAtNightLayer;
    }
);