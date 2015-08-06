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
 * A WeatherMapSymbol object is a "view" of a WeatherScout "model" object.
 * 
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
    'wmt/view/symbols/weather/AirTemperature',
    'wmt/controller/Controller',
    'wmt/view/symbols/weather/ForecastTime',
    'wmt/view/symbols/weather/RelativeHumidity',
    'wmt/view/symbols/weather/SkyCover',
    'wmt/model/WeatherScout',
    'wmt/view/symbols/weather/WindBarb',
    'wmt/Wmt',
    'worldwind'],
    function (
        AirTemperature,
        controller,
        ForecastTime,
        RelativeHumidity,
        SkyCover,
        WeatherScout,
        WindBarb,
        wmt,
        ww) {
        "use strict";

        var WeatherMapSymbol = function (wxScout) {

            // Inherit Renderable properties
            WorldWind.Renderable.call(this);

            var self = this,
                wx, i, max,
                timeOptions = {"hour": "2-digit", "minute": "2-digit", "timeZoneName": "short"};

            // Maintain a reference to the weather object this symbol represents
            this.wxScout = wxScout;

            // Create the composite weather map symbol components
            this.skyCover = new SkyCover(wxScout.latitude, wxScout.longitude);
            this.windBarb = new WindBarb(wxScout.latitude, wxScout.longitude);
            this.airTemperature = new AirTemperature(wxScout.latitude, wxScout.longitude, 'F');
            this.relHumidity = new RelativeHumidity(wxScout.latitude, wxScout.longitude, '%');
            this.forecastTime = new ForecastTime(wxScout.latitude, wxScout.longitude, ' ');

            // Add a reference to our wx model object to the principle renderables.
            // The "movable" wxScoute will generate EVENT_OBJECT_MOVED events. 
            // See the SelectController.
            this.skyCover.pickDelegate = wxScout;
            this.windBarb.pickDelegate = wxScout;
            this.airTemperature.pickDelegate = wxScout;
            this.relHumidity.pickDelegate = wxScout;
            this.forecastTime.pickDelegate = wxScout;


            if (wmt.configuration.weatherScoutLabels === wmt.WEATHER_SCOUT_LABEL_NAME) {
                this.skyCover.label = wxScout.name;
            }


            // EVENT_OBJECT_MOVED handler that synchronizes the composite renderables with the model's location
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

            // EVENT_WEATHER_CHANGED handler that updates the symbology
            this.handleWeatherChangedEvent = function (wxModel) {
                wx = wxModel.getForecastAtTime(controller.model.applicationTime);
                // Update the values
                self.skyCover.updateSkyCoverImage(wx.skyCoverPct);
                self.windBarb.updateWindBarbImage(wx.windSpeedKts, wx.windDirectionDeg);
                self.airTemperature.text = wx.airTemperatureF + 'F';
                self.relHumidity.text = wx.relaltiveHumidityPct + '%';
                self.forecastTime.text = '@ ' + wx.time.toLocaleTimeString('en', timeOptions);
            };

            // EVENT_PLACE_CHANGED handler that updates the label
            this.handlePlaceChangedEvent = function (wxScout) {
                if (wmt.configuration.weatherScoutLabels === wmt.WEATHER_SCOUT_LABEL_PLACE) {
                    // Display the place name
                    self.skyCover.label = wxScout.toponym || null;
                } else if (wmt.configuration.weatherScoutLabels === wmt.WEATHER_SCOUT_LABEL_LATLON) {
                    // Display "Lat Lon"
                    self.skyCover.label = wxScout.latitude.toFixed(3) + ' ' + wxScout.longitude.toFixed(3);
                }
            };

            //EVENT_TIME_CHANGED handler that updates the label and symbology
            this.handleTimeChangedEvent = function (time) {
                wx = self.wxScout.getForecastAtTime(time);
                // Update the values
                self.skyCover.updateSkyCoverImage(wx.skyCoverPct);
                self.windBarb.updateWindBarbImage(wx.windSpeedKts, wx.windDirectionDeg);
                self.airTemperature.text = wx.airTemperatureF + 'F';
                self.relHumidity.text = wx.relaltiveHumidityPct + '%';
                if (wx.time === WeatherScout.INVALID_WX.time) {
                    self.forecastTime.text = '-';
                } else {
                    self.forecastTime.text = '@ ' + wx.time.toLocaleTimeString('en', timeOptions);
                }
            };

            // Establish the Publisher/Subscriber relationship between this symbol and the wx scout
            wxScout.on(wmt.EVENT_OBJECT_MOVED, this.handleObjectMovedEvent, this);
            wxScout.on(wmt.EVENT_PLACE_CHANGED, this.handlePlaceChangedEvent, this);
            wxScout.on(wmt.EVENT_WEATHER_CHANGED, this.handleWeatherChangedEvent, this);
            controller.model.on(wmt.EVENT_TIME_CHANGED, this.handleTimeChangedEvent, this);

            // Set the initial values to the current application time
            this.handleTimeChangedEvent(controller.model.applicationTime);
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
            //this.windBarb.imageTilt = dc.navigatorState.tilt;

            this.skyCover.render(dc);
            this.airTemperature.render(dc);
            this.relHumidity.render(dc);
            this.forecastTime.render(dc);
            this.windBarb.render(dc);
        };

        return WeatherMapSymbol;
    }
);
