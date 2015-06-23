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
    '../globe/EnhancedPlacemark',
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        EnhancedPlacemark,
        Wmt,
        ww) {
        "use strict";

        var WindBarbPlacemark = function (latitude, longitude, windSpdKts, windDirDeg, eyeDistanceScaling) {

            EnhancedPlacemark.call(this, new WorldWind.Position(latitude, longitude, 1000), eyeDistanceScaling);

            this.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            this.attributes = new WorldWind.PlacemarkAttributes(null);
            this.attributes.depthTest = false;
            this.attributes.imageScale = 0.3;
            this.attributes.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5, // Width centered
                WorldWind.OFFSET_FRACTION, 0.5);// Height centered

            //this.highlightAttributes = new WorldWind.PlacemarkAttributes(this.attributes);

            this.imageRotation = 0;

            var img = new Image(),
                knots = Math.round(windSpdKts / 5) * 5, // rounded to 5 kts
                imgName = 'wind_spd-' + knots + 'kts.svg',
                self = this;

            // Draw the image in the canvas after loading
            img.onload = function () {
                var canvas = document.createElement("canvas"),
                    context = canvas.getContext("2d"),
                    size = Math.max(img.width, img.height) * 2,
                    center = size / 2;

                // Create a square canvase
                canvas.width = size;
                canvas.height = size;

                // Draw the image at the center of the canvas
                self.rotateAbout(context, 90 * (Math.PI / 180), center, center);
                context.drawImage(img, center, center);

                //context.translate(48, 32); // center
                //context.rotate(225 * (Math.PI / 180));
                //self.rotateAbout(context, 225 * (Math.PI / 180), 48, 48);
                //context.drawImage(img, 48, 48, img.width, img.height);

                // Assign the loaded image to the placemark
                // Set override the default "unique" key in order to reuse the texture
                self.attributes.imageSource = new WorldWind.ImageSource(canvas);
                //self.attributes.imageSource.key = imgName;
                //self.highlightAttributes.imageSource = new WorldWind.ImageSource(canvas);
            };
            if (windSpdKts === undefined || isNaN(windSpdKts)) {
                imgName = 'wind_spd-50kts.svg';
            }
            else {
                // Wind speed rounded to 5 kts
                imgName = 'wind_spd-' + (Math.round(windSpdKts / 5) * 5) + 'kts.svg';
            }
            // Fire the onload event
            img.src = Wmt.IMAGE_PATH + 'weather/' + imgName;

        };
        // Inherit the Placemark methods (Note: calls the Placemark constructor a 2nd time).
        WindBarbPlacemark.prototype = Object.create(EnhancedPlacemark.prototype);


        /**
         * Rotates theta radians counterclockwise around the point (x,y). This can also be accomplished with a 
         * translate,rotate,translate sequence.
         * @param {Context} c
         * @param {Number} theta Radians
         * @param {Number} x
         * @param {Number} y
         */
        WindBarbPlacemark.prototype.rotateAbout = function (c, theta, x, y) {
            var ct = Math.cos(theta), st = Math.sin(theta);
            c.transform(ct, -st, st, ct, -x * ct - y * st + x, x * st - y * ct + y);
        };

        return WindBarbPlacemark;
    }
);

