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

/*global define, WorldWind*/

define([
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        Wmt,
        ww) {
        "use strict";

        var SkyCoverPlacemark = function (latitude, longitude, skyCoverPct, eyeDistanceScaling) {
            WorldWind.Placemark.call(this, new WorldWind.Position(latitude, longitude, 1000), eyeDistanceScaling);

            this.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
            
            this.attributes =  new WorldWind.PlacemarkAttributes(null);
            this.attributes.depthTest = false;
            this.attributes.imageScale = 0.5;
            this.attributes.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 0.5);
            this.attributes.labelAttributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 1.0);
            this.attributes.drawLeaderLine = true;
            this.attributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;
            this.attributes.labelAttributes.color = WorldWind.Color.YELLOW;

            //this.highlightAttributes = new WorldWind.PlacemarkAttributes(this.attributes);
            //this.highlightAttributes.imageScale = placemarkAttr.imageScale * 1.2;

            var img = new Image(),
                imgName,
                self = this;

            // Draw the image in the canvas after loading
            img.onload = function () {
                var canvas = document.createElement("canvas"),
                    context = canvas.getContext("2d");

                canvas.width = img.width;
                canvas.height = img.height;
                
                context.drawImage(img, 0, 0, img.width, img.height);
                // Assign the loaded image to the placemark
                self.attributes.imageSource = new WorldWind.ImageSource(canvas);
                // Override the default "unique" key in order to reuse the texture
                //self.attributes.imageSource.key = imgName;
                //self.highlightAttributes.imageSource = new WorldWind.ImageSource(canvas);
            };
            if (skyCoverPct === undefined) {
                imgName = 'sky_cover-missing.svg';
            }
            else if (!isNaN(skyCoverPct)) {
                imgName = 'sky_cover-' + Math.round(skyCoverPct / 8) + '.8.svg';
            }
            else {
                imgName = 'sky_cover-obscurred.svg';
            }
            // Fire the onload event
            img.src = Wmt.IMAGE_PATH + 'weather/' + imgName;

        };
        // Inherit Placemark parent methods
        SkyCoverPlacemark.prototype = Object.create(WorldWind.Placemark.prototype);

        return SkyCoverPlacemark;
    }
);

