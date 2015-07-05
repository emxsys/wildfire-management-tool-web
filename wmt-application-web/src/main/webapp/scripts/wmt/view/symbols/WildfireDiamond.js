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
    'wmt/Wmt',
    'worldwind'],
    function (
        wmt,
        ww) {
        "use strict";

        var WildfireDiamond = function (latitude, longitude, head, left, right, heal, eyeDistanceScaling) {
            WorldWind.Placemark.call(this, new WorldWind.Position(latitude, longitude, wmt.MAP_SYMBOL_ALTITUDE_WILDFIRE), eyeDistanceScaling);

            this.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            this.attributes = new WorldWind.PlacemarkAttributes(null);
            this.attributes.depthTest = false;
            this.attributes.imageScale = 0.3;
            this.attributes.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 0.5);
            this.attributes.labelAttributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5, // Centered
                WorldWind.OFFSET_FRACTION, 2.2);    // Below RH
            this.attributes.drawLeaderLine = true;
            this.attributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;
            this.attributes.leaderLineAttributes.outlineWidth = 2;
            this.attributes.labelAttributes.color = WorldWind.Color.WHITE;
            this.attributes.labelAttributes.depthTest = false;
            this.highlightAttributes = new WorldWind.PlacemarkAttributes(this.attributes);
            //this.highlightAttributes.imageScale = placemarkAttr.imageScale * 1.2;
            //this.eyeDistanceScalingThreshold = 2500000;

            this.updateWildfireDiamondImage(head, left, right, heal);

        };
        // Inherit Placemark parent methods
        WildfireDiamond.prototype = Object.create(WorldWind.Placemark.prototype);


        WildfireDiamond.prototype.updateWildfireDiamondImage = function (head, left, right, heal) {
            var imgName = 'unkn';

            if (head && left && right && heal) {
                imgName = WildfireDiamond.getColorCode(head)
                    + WildfireDiamond.getColorCode(left)
                    + WildfireDiamond.getColorCode(right)
                    + WildfireDiamond.getColorCode(heal);
            }

            this.attributes.imageSource = wmt.IMAGE_PATH + 'fire/' + imgName + '.png';
            this.highlightAttributes.imageSource = this.attributes.imageSource;
        };

        WildfireDiamond.getColorCode = function (flameLen) {
            if (flameLen >= 15) {
                return 'f';
            }
            if (flameLen >= 7) {
                return '7';
            }
            if (flameLen >= 3) {
                return '3';
            }
            if (flameLen >= 1) {
                return '1';
            }
            return '0';
        };

        return WildfireDiamond;
    }
);

