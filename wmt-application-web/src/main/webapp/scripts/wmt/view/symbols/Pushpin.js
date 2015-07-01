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

/**
 * The Pushpin draws a pushpin symbol on the globe.
 * @param {Log} log Console logging.
 * @param {Wmt} wmt Constants.
 * @param {WorldWind} ww 
 * @returns {Pushpin}
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/util/Log',
    'wmt/Wmt',
    'worldwind'],
    function (
        log,
        wmt,
        ww) {
        "use strict";

        var Pushpin = function (latitude, longitude, pushpinType, eyeDistanceScaling) {
            // Inherit Placemark properties
            WorldWind.Placemark.call(this, new WorldWind.Position(latitude, longitude, 0), eyeDistanceScaling);

            this.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
            //this.eyeDistanceScalingThreshold = 2500000;

            // Establish the common attributes for pushpins
            this.attributes = new WorldWind.PlacemarkAttributes(null);
            this.attributes.depthTest = true;
            this.attributes.imageScale = 0.8;
            this.attributes.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.3,
                WorldWind.OFFSET_FRACTION, 0.0);
            this.attributes.labelAttributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 1.0);
            this.attributes.labelAttributes.color = WorldWind.Color.YELLOW;
            this.attributes.labelAttributes.depthTest = true;
            this.attributes.drawLeaderLine = true;
            this.attributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;
            this.attributes.leaderLineAttributes.outlineWidth = 2;

            this.highlightAttributes = new WorldWind.PlacemarkAttributes(this.attributes);
            this.highlightAttributes.imageScale = this.attributes.imageScale * 1.2;

            // Set the image source and name for the placemark
            this.updatePushpin(Pushpin.findTemplate(pushpinType));

        };
        // Inherit Placemark functions
        Pushpin.prototype = Object.create(WorldWind.Placemark.prototype);

        // CAUTION: changing the type value may cause existing markers in local storage to be lost!
        // 
        // Pushpin Types
        Pushpin.templates = [
            {type: "pushpin-black", name: "Black ", symbol: "castshadow-black.png"},
            {type: "pushpin-red", name: "Red ", symbol: "castshadow-red.png"},
            {type: "pushpin-green", name: "Green ", symbol: "castshadow-green.png"},
            {type: "pushpin-blue", name: "Blue ", symbol: "castshadow-blue.png"},
            {type: "pushpin-teal", name: "Teal ", symbol: "castshadow-teal.png"},
            {type: "pushpin-orange", name: "Orange ", symbol: "castshadow-orange.png"},
            {type: "pushpin-purple", name: "Purple ", symbol: "castshadow-purple.png"},
            {type: "pushpin-brown", name: "Brown ", symbol: "castshadow-brown.png"},
            {type: "pushpin-white", name: "White ", symbol: "castshadow-white.png"}
        ];

        /**
         * Finds the Pushpin template for the given color.
         * @param {String} type An Pushpin.templates[] type.
         * @returns {Pushpin.templates[] item} The matching template object.
         */
        Pushpin.findTemplate = function (type) {
            var i, max;
            for (i = 0, max = Pushpin.templates.length; i < max; i++) {
                if (type === Pushpin.templates[i].type) {
                    return Pushpin.templates[i];
                }
            }
            // Not found!
            throw new Error(log.error('Pushpin', 'findTemplate', 'Invalid pushpin type: ' + type));
        };

        /**
         * Updates this placemark's symbol and display name based on the type.
         * @param {Object} type An Pushpin.templates[] item.
         */
        Pushpin.prototype.updatePushpin = function (template) {
            this.attributes.imageSource = wmt.WORLD_WIND_PATH + 'images/pushpins/' + template.symbol;
            this.highlightAttributes.imageSource = this.attributes.imageSource;
            this.displayName = template.name;
        };


        return Pushpin;
    }
);

