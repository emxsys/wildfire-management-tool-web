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
    'wmt/globe/EnhancedPlacemark',
    'wmt/util/WmtUtil',
    'wmt/Wmt',
    'worldwind'],
    function (
        EnhancedPlacemark,
        util,
        wmt,
        ww) {
        "use strict";

        /**
         * @constructor
         * @param {type} latitude
         * @param {type} longitude
         * @param {type} windSpdKts
         * @param {type} windDirDeg
         * @param {type} eyeDistanceScaling
         * @returns {WindBarbPlacemark_L38.WindBarbPlacemark}
         */
        var WindBarbPlacemark = function (latitude, longitude, windSpdKts, windDirDeg, eyeDistanceScaling) {

            EnhancedPlacemark.call(this, new WorldWind.Position(latitude, longitude, wmt.MAP_SYMBOL_ALTITUDE_WEATHER), eyeDistanceScaling);
            //WorldWind.Placemark.call(this, new WorldWind.Position(latitude, longitude, wmt.MAP_SYMBOL_ALTITUDE_WEATHER), eyeDistanceScaling);

            this.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            this.attributes = new WorldWind.PlacemarkAttributes(null);
            this.attributes.depthTest = true;
            this.attributes.imageScale = 0.3;
            this.attributes.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5, // Width centered
                WorldWind.OFFSET_FRACTION, 0.5);// Height centered
            this.highlightAttributes = new WorldWind.PlacemarkAttributes(this.attributes);

            this.imageRotation = 0;
            this.imageTilt = 0;

            this.updateWindBarbImage(windSpdKts, windDirDeg);
        };
        // Inherit the Placemark methods (Note: calls the Placemark constructor a 2nd time).
        WindBarbPlacemark.prototype = Object.create(EnhancedPlacemark.prototype);
        //WindBarbPlacemark.prototype = Object.create(WorldWind.Placemark.prototype);

        /**
         * 
         * @param {type} windSpdKts
         * @param {type} windDirDeg
         * @returns {undefined}
         */
        WindBarbPlacemark.prototype.updateWindBarbImage = function (windSpdKts, windDirDeg) {
            var img = new Image(),
                imgName,
                knots,
                self = this;

            // Draw the image in the canvas after loading
            img.onload = function () {
                var canvas = document.createElement("canvas"),
                    context = canvas.getContext("2d"),
                    size = Math.max(img.width, img.height) * 2,
                    center = size / 2,
                    ccwRadians = (-windDirDeg + 90) * (Math.PI / 180);

                // Create a square canvase
                canvas.width = size;
                canvas.height = size;

//                // Draw the image at the center of the canvas
                self.rotateAbout(context, ccwRadians, center, center);

                // Execute drawImage after delay for ID 11 compatitiblity
                setTimeout(function () {
                    context.drawImage(img, center, center);
                    // Assign the loaded image to the placemark
                    self.attributes.imageSource = new WorldWind.ImageSource(canvas);
                    self.highlightAttributes.imageSource = new WorldWind.ImageSource(canvas);
                }, 0);
            };
            if (windSpdKts === undefined || isNaN(windSpdKts)) {
                this.enabled = false;
                return;
            }
            // Wind speed rounded to 5 kts
            knots = Math.round(windSpdKts / 5) * 5;
            if (knots === 0) {
                this.enabled = false;
                return;                
            }
            // Set the image -- which fires the onload event
            imgName = 'wind_spd-' + util.pad(knots, 2) + 'kts.svg';
            img.src = wmt.IMAGE_PATH + 'weather/' + imgName;
            
            this.enabled = true;
        };

        /**
         * Rotates theta radians counterclockwise around the point (x,y). This can also be accomplished with a 
         * translate,rotate,translate sequence.
         * Copied from the book "JavaScript: The Definitive Reference"
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

