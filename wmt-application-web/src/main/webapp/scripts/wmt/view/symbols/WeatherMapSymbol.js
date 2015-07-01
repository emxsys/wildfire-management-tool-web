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
 * The WeatherMapSymbol module renders a composite WorldWind.Renderable representing a weather station.
 * @param {type} AirTemperature
 * @param {type} controller
 * @param {type} ForecastTime
 * @param {type} RelativeHumidity
 * @param {type} SkyCover
 * @param {type} WindBarb
 * @param {type} wmt
 * @param {type} ww
 * @returns {WeatherMapSymbol}
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/view/symbols/AirTemperature',
    'wmt/controller/Controller',
    'wmt/view/symbols/ForecastTime',
    'wmt/view/symbols/RelativeHumidity',
    'wmt/view/symbols/SkyCover',
    'wmt/view/symbols/WindBarb',
    'wmt/Wmt',
    'worldwind'],
    function (
        AirTemperature,
        controller,
        ForecastTime,
        RelativeHumidity,
        SkyCover,
        WindBarb,
        wmt,
        ww) {
        "use strict";

        var WeatherMapSymbol = function (wxModel) {

            // Inherit Renderable properties
            WorldWind.Renderable.call(this);
            
            // Maintain a reference to the weather object this symbol represents
            this.wxModel = wxModel;
            
            // Create the weather map symbol components
            this.skyCover = new SkyCover(wxModel.latitude, wxModel.longitude);
            this.windBarb = new WindBarb(wxModel.latitude, wxModel.longitude);
            this.airTemperature = new AirTemperature(wxModel.latitude, wxModel.longitude, 'F');
            this.relHumidity = new RelativeHumidity(wxModel.latitude, wxModel.longitude, '%');
            this.forecastTime = new ForecastTime(wxModel.latitude, wxModel.longitude, ' ');

            // Add a reference to our wx model object to the principle renderables.
            // The "movable" wxModel will generate EVENT_OBJECT_MOVED events. See SelectController.
            this.skyCover.pickDelegate = wxModel;
            this.windBarb.pickDelegate = wxModel;
            this.airTemperature.pickDelegate = wxModel;
            this.relHumidity.pickDelegate = wxModel;
            this.forecastTime.pickDelegate = wxModel;
            
            // Create an EVENT_OBJECT_MOVED handler that synchronizes the renderables with the model's location
            var self = this;
            this.handleObjectMovedEvent = function (wxModel) {
                self.skyCover.position.latitude = wxModel.latitude;
                self.skyCover.position.longitude = wxModel.longitude;
                self.windBarb.position.latitude = wxModel.latitude;
                self.windBarb.position.longitude = wxModel.longitude;
                self.airTemperature.position.latitude = wxModel.latitude;
                self.airTemperature.position.longitude = wxModel.longitude;
                self.relHumidity.position.latitude = wxModel.latitude;
                self.relHumidity.position.longitude = wxModel.longitude;
                self.forecastTime.position.latitude = wxModel.latitude;
                self.forecastTime.position.longitude = wxModel.longitude;
            };
            
            // Create an EVENT_WEATHER_CHANGED handler that updates the symbology
            this.handleWeatherChangedEvent = function (wxModel) {
                
                var wx = wxModel.getFirstForecast(),
                    timeOptions = {"hour": "2-digit", "minute": "2-digit", "timeZoneName": "short"};

                // Update the values
                self.skyCover.updateSkyCoverImage(wx.skyCoverPct);
                self.windBarb.updateWindBarbImage(wx.windSpeedKts, wx.windDirectionDeg);
                self.airTemperature.text = wx.airTemperatureF + 'F';
                self.relHumidity.text = wx.relaltiveHumidityPct + '%';
                self.forecastTime.text = '@ ' + wx.time.toLocaleTimeString('en', timeOptions);
            };

            // Create an EVENT_PLACE_CHANGED handler that updates the label
            this.handlePlaceChangedEvent = function (wxModel) {
                // Display the place name
                if (wxModel.place) {
                    // Use the first place name (ordered by granularity) that's not a zip code
                    for (var i = 0, max = wxModel.place.length; i < max; i++) {
                        if (wxModel.place[i].type !== "Zip Code") {
                            self.skyCover.label = wxModel.place[i].name;
                            return;
                        }
                    }
                }
            };

            // Create an EVENT_PLACE_CHANGED handler that updates the label
            this.handleTimeChangedEvent = function (time) {
                var wx = this.wxModel.getForecastAt(time),
                    timeOptions = {"hour": "2-digit", "minute": "2-digit", "timeZoneName": "short"};

                // Update the values
                self.skyCover.updateSkyCoverImage(wx.skyCoverPct);
                self.windBarb.updateWindBarbImage(wx.windSpeedKts, wx.windDirectionDeg);
                self.airTemperature.text = wx.airTemperatureF + 'F';
                self.relHumidity.text = wx.relaltiveHumidityPct + '%';
                self.forecastTime.text = '@ ' + wx.time.toLocaleTimeString('en', timeOptions);
            };
            
            // Establish the Publisher/Subscriber relationship between this symbol and the wx model
            wxModel.on(wmt.EVENT_OBJECT_MOVED, this.handleObjectMovedEvent, this);
            wxModel.on(wmt.EVENT_PLACE_CHANGED, this.handlePlaceChangedEvent, this);
            wxModel.on(wmt.EVENT_WEATHER_CHANGED, this.handleWeatherChangedEvent, this);
            
            controller.model.on(wmt.EVENT_TIME_CHANGED, this.handleTimeChangedEvent, this);

        };
        // Inherit Renderable functions.
        WeatherMapSymbol.prototype = Object.create(WorldWind.Renderable.prototype);

        /**
         * Render this WeatherMapSymbol. 
         * @param {DrawContext} dc The current draw context.
         */
        WeatherMapSymbol.prototype.render = function (dc) {

            // Rotate and tilt the wind barb to match the view
            this.windBarb.imageRotation = dc.navigatorState.heading;
            this.windBarb.imageTilt = dc.navigatorState.tilt;

            this.skyCover.render(dc);
            this.windBarb.render(dc);
            this.airTemperature.render(dc);
            this.relHumidity.render(dc);
            this.forecastTime.render(dc);
        };

        return WeatherMapSymbol;
    }
);
