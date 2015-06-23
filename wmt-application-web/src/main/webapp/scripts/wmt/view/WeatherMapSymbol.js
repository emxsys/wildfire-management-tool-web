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
    '../util/Log',
    '../model/WeatherLookout',
    '../util/Messenger',
    '../util/Movable',
    '../view/SkyCoverPlacemark',
    '../view/WindBarbPlacemark',
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        Log,
        WeatherLookout,
        Messenger,
        Movable,
        SkyCoverPlacemark,
        WindBarbPlacemark,
        Wmt,
        ww) {
        "use strict";

        var WeatherMapSymbol = function (wxModel) {

            // Inherit Renderable properties
            WorldWind.Renderable.call(this);

            this.skyCoverPlacemark = new SkyCoverPlacemark(wxModel.latitude, wxModel.longitude);
            this.windBarbPlacemark = new WindBarbPlacemark(wxModel.latitude, wxModel.longitude);

            this.labels = [];


            // Add a reference to our wx model object to the principle renderables.
            // The "movable" wxModel will generate EVENT_OBJECT_MOVED events. See SelectController.
            this.skyCoverPlacemark.pickDelegate = wxModel;
            this.windBarbPlacemark.pickDelegate = wxModel;
            // Create an EVENT_OBJECT_MOVED handler that synchronizes the renderables with the model's location
            var self = this;
            this.handleObjectMovedEvent = function (wxLookout) {
                self.skyCoverPlacemark.position.latitude = wxLookout.latitude;
                self.skyCoverPlacemark.position.longitude = wxLookout.longitude;
                self.windBarbPlacemark.position.latitude = wxLookout.latitude;
                self.windBarbPlacemark.position.longitude = wxLookout.longitude;
            };
            // Establish the Publisher/Subscriber relationship between this symbol and the wx model
            wxModel.on(Wmt.EVENT_OBJECT_MOVED, this.handleObjectMovedEvent, this);
        };
        // Inherit Renderable functions.
        WeatherMapSymbol.prototype = Object.create(WorldWind.Renderable.prototype);

        /**
         * Render this WeatherMapSymbol. 
         * @param {DrawContext} dc The current draw context.
         */
        WeatherMapSymbol.prototype.render = function (dc) {

            // Rotate and tilt the wind barb to match the view
            this.windBarbPlacemark.imageRotation = dc.navigatorState.heading;
            this.windBarbPlacemark.imageTilt = dc.navigatorState.tilt;
            
            this.skyCoverPlacemark.render(dc);
            this.windBarbPlacemark.render(dc);
        };

        return WeatherMapSymbol;
    }
);
