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

define([
    'wmt/controller/Controller',
    'wmt/view/symbols/DirOfSpread',
    'wmt/view/symbols/FlameLengthHead',
    'wmt/view/symbols/WildfireDiamond',
    'wmt/util/Log',
    'wmt/Wmt',
    'worldwind'],
    function (
        controller,
        DirOfSpread,
        FlameLengthHead,
        WildfireDiamond,
        logger,
        wmt,
        ww) {
        "use strict";

        var FireBehaviorSymbol = function (lookout) {

            // Inherit Renderable properties
            WorldWind.Renderable.call(this);

            // Maintain a reference to the weather object this symbol represents
            this.lookout = lookout;

            var self = this,
                surfaceFire = lookout.surfaceFire,
                head = surfaceFire ? lookout.surfaceFire.flameLength.value : null,
                flanks = surfaceFire ? lookout.surfaceFire.flameLengthFlanking.value : null,
                heal = surfaceFire ? lookout.surfaceFire.flameLengthBacking.value : null,
                dir = surfaceFire ? lookout.surfaceFire.directionMaxSpread.value : null,
                ros = surfaceFire ? lookout.surfaceFire.rateOfSpreadMax.value : null;

            // Create the weather map symbol components
            this.diamond = new WildfireDiamond(lookout.latitude, lookout.longitude, Math.round(head), Math.round(flanks), Math.round(heal));
            this.dirOfSpread = new DirOfSpread(lookout.latitude, lookout.longitude, Math.round(dir));
            this.flameLengthHead = new FlameLengthHead(lookout.latitude, lookout.longitude, head || '-');

            // Add a reference to our lookout object to the principle renderables.
            // The "movable" wxModel will generate EVENT_OBJECT_MOVED events. See SelectController.
            this.diamond.pickDelegate = lookout;
            this.dirOfSpread.pickDelegate = lookout;
            this.flameLengthHead.pickDelegate = lookout;

            // EVENT_OBJECT_MOVED handler that synchronizes the renderables with the model's location
            this.handleObjectMovedEvent = function (lookout) {
                self.diamond.position.latitude = lookout.latitude;
                self.diamond.position.longitude = lookout.longitude;
                self.dirOfSpread.position.latitude = lookout.latitude;
                self.dirOfSpread.position.longitude = lookout.longitude;
                self.flameLengthHead.position.latitude = lookout.latitude;
                self.flameLengthHead.position.longitude = lookout.longitude;
            };
            // EVENT_FIRE_BEHAVIOR_CHANGED handler 
            this.handleFireBehaviorChangedEvent = function (lookout) {
                var head = lookout.surfaceFire.flameLength.value,
                    flanks = lookout.surfaceFire.flameLengthFlanking.value,
                    heal = lookout.surfaceFire.flameLengthBacking.value,
                    dir = lookout.surfaceFire.directionMaxSpread.value,
                    ros = lookout.surfaceFire.rateOfSpreadMax.value;

                this.diamond.updateWildfireDiamondImage(Math.round(head), Math.round(flanks), Math.round(heal));
                this.dirOfSpread.updateDirOfSpreadImage(Math.round(dir));
                this.flameLengthHead.text = Math.round(head) + "'";
            };
            // EVENT_PLACE_CHANGED handler
            this.handlePlaceChangedEvent = function (lookout) {
                // Display the place name
                if (lookout.toponym) {
                    self.diamond.label = lookout.toponym;
                }
            };

            // Establish the Publisher/Subscriber relationship between this symbol and the wx model
            lookout.on(wmt.EVENT_FIRE_BEHAVIOR_CHANGED, this.handleFireBehaviorChangedEvent, this);
            lookout.on(wmt.EVENT_PLACE_CHANGED, this.handlePlaceChangedEvent, this);
            lookout.on(wmt.EVENT_OBJECT_MOVED, this.handleObjectMovedEvent, this);

        };
        // Inherit Renderable functions.
        FireBehaviorSymbol.prototype = Object.create(WorldWind.Renderable.prototype);

        /**
         * Render this symbol. 
         * @param {DrawContext} dc The current draw context.
         */
        FireBehaviorSymbol.prototype.render = function (dc) {

            // Rotate and dir of spread arrot to match the view
            this.dirOfSpread.imageRotation = dc.navigatorState.heading;
            
            this.diamond.render(dc);
            this.dirOfSpread.render(dc);
            this.flameLengthHead.render(dc);
        };

        return FireBehaviorSymbol;
    }
);
