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
    'wmt/view/symbols/WildfireDiamond',
    'wmt/util/Log',
    'wmt/Wmt',
    'worldwind'],
    function (
        controller,
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

            var self = this;


            // Create the weather map symbol components
            this.diamond = new WildfireDiamond(lookout.latitude, lookout.longitude);

            // Add a reference to our lookout object to the principle renderables.
            // The "movable" wxModel will generate EVENT_OBJECT_MOVED events. See SelectController.
            this.diamond.pickDelegate = lookout;

            // Create an EVENT_OBJECT_MOVED handler that synchronizes the renderables with the model's location
            this.handleObjectMovedEvent = function (lookout) {
                self.diamond.position.latitude = lookout.latitude;
                self.diamond.position.longitude = lookout.longitude;
            };

            // Create an EVENT_WEATHER_CHANGED handler that updates 
            this.handleWeatherChangedEvent = function (lookout) {
                logger.warning("FireBehaviorSymbol","handleWeatherChangedEvent","Unhandled event.");

//                var wx = lookout.getFirstForecast(),
//                    timeOptions = {"hour": "2-digit", "minute": "2-digit", "timeZoneName": "short"};
//
//                // Update the values
//                self.skyCoverPlacemark.updateSkyCoverImage(wx.skyCoverPct);
//                self.windBarbPlacemark.updateWindBarbImage(wx.windSpeedKts, wx.windDirectionDeg);
//                self.airTemperatureText.text = wx.airTemperatureF + 'F';
//                self.relHumidityText.text = wx.relaltiveHumidityPct + '%';
//                self.forecastTimeText.text = '@ ' + wx.time.toLocaleTimeString('en', timeOptions);
            };
            // Create an EVENT_FIRE_CHANGED handler that updates 
            this.handleFireBehaviorChangedEvent = function (lookout) {
                logger.warning("FireBehaviorSymbol","handleFireBehaviorChangedEvent","Unhandled event.");
            };

            // Create an EVENT_PLACE_CHANGED handler that updates the label
            this.handlePlaceChangedEvent = function (lookout) {
                // Display the place name
                if (lookout.placeName) {
                    self.diamond.label = lookout.placeName;
                }
            };

            // Create an EVENT_TIME_CHANGED handler that updates the label
            this.handleTimeChangedEvent = function (time) {
                logger.warning("FireBehaviorSymbol","handleTimeChangedEvent","Unhandled event.");
//                var wx = this.lookout.getForecastAt(time),
//                    timeOptions = {"hour": "2-digit", "minute": "2-digit", "timeZoneName": "short"};
//
//                // Update the values
//                self.skyCoverPlacemark.updateSkyCoverImage(wx.skyCoverPct);
//                self.windBarbPlacemark.updateWindBarbImage(wx.windSpeedKts, wx.windDirectionDeg);
//                self.airTemperatureText.text = wx.airTemperatureF + 'F';
//                self.relHumidityText.text = wx.relaltiveHumidityPct + '%';
//                self.forecastTimeText.text = '@ ' + wx.time.toLocaleTimeString('en', timeOptions);
            };

            // Establish the Publisher/Subscriber relationship between this symbol and the wx model
            lookout.on(wmt.EVENT_FIRE_BEHAVIOR_CHANGED, this.handleFireBehaviorChangedEvent, this);
            lookout.on(wmt.EVENT_PLACE_CHANGED, this.handlePlaceChangedEvent, this);
            lookout.on(wmt.EVENT_WEATHER_CHANGED, this.handleWeatherChangedEvent, this);
            lookout.on(wmt.EVENT_OBJECT_MOVED, this.handleObjectMovedEvent, this);

            controller.model.on(wmt.EVENT_TIME_CHANGED, this.handleTimeChangedEvent, this);

        };
        // Inherit Renderable functions.
        FireBehaviorSymbol.prototype = Object.create(WorldWind.Renderable.prototype);

        /**
         * Render this symbol. 
         * @param {DrawContext} dc The current draw context.
         */
        FireBehaviorSymbol.prototype.render = function (dc) {

            this.diamond.render(dc);
        };

        return FireBehaviorSymbol;
    }
);
