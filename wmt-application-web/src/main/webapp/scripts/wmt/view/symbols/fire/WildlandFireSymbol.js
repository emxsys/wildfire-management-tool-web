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
 *     - Neither the name of Bruce Schubert, Emxsys nor the names of its 
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

/*global define, $, WorldWind */

/**
 * 
 * @param {type} controller
 * @param {type} IcsMarker
 * @param {type} wmt
 * @param {type} ww
 * @returns {WildlandFireSymbol}
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/controller/Controller',
    'wmt/view/symbols/IcsMarker',
    'wmt/Wmt',
    'worldwind'],
    function (
        controller,
        IcsMarker,
        wmt,
        ww) {
        "use strict";

        var WildlandFireSymbol = function (fire) {

            // Inherit Renderable properties
            WorldWind.Renderable.call(this);

            // Maintain a reference to the weather object this symbol represents
            this.fire = fire;
            this.shapes = [];

            var marker,
                i, numRings, ring,
                j, numPoints, perimeter;
            
            // Create the composite weather map symbol components
            if (fire.geometry.x && fire.geometry.y) {
                marker = new IcsMarker(fire.geometry.y, fire.geometry.x, "ics-fire-location");
                marker.pickDelegate = fire;
                marker.label = fire.name;
                this.shapes.push(marker);
            } else if (fire.geometry.rings) {
                for (i = 0, numRings = fire.geometry.rings.length; i < numRings; i++) {
                    ring = fire.geometry.rings[i];
                    perimeter = [];
                    for (j = 0, numPoints = ring.length; j < numPoints; j++) {
                        perimeter.push(new WorldWind.Location(ring[j][1], ring[j][0]));
                    }

                    // Create and set attributes for it. The shapes below except the surface polyline use this same attributes
                    // object. Real apps typically create new attributes objects for each shape unless they know the attributes
                    // can be shared among shapes.
                    var attributes = new WorldWind.ShapeAttributes(null);
                    attributes.outlineColor = WorldWind.Color.RED;
                    attributes.interiorColor = new WorldWind.Color(.5, 0, 0, 0.5);

                    var highlightAttributes = new WorldWind.ShapeAttributes(attributes);
                    highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 1);

                    var shape = new WorldWind.SurfacePolygon(perimeter, attributes);
                    shape.highlightAttributes = highlightAttributes;
                    
                    this.shapes.push(shape);
                }
            }

        };
        // Inherit Renderable functions.
        WildlandFireSymbol.prototype = Object.create(WorldWind.Renderable.prototype);

        /**
         * Render this WildlandFireSymbol. 
         * @param {DrawContext} dc The current draw context.
         */
        WildlandFireSymbol.prototype.render = function (dc) {
            for (var i = 0, max = this.shapes.length; i < max; i++) {
                this.shapes[i].render(dc);
            }
        };

        return WildlandFireSymbol;
    }
);
