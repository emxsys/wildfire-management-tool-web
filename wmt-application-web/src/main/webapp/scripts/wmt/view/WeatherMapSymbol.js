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
    '../view/AirTemperatureText',
    '../view/ForecastTimeText',
    '../util/Log',
    '../view/RelativeHumidityText',
    '../view/SkyCoverPlacemark',
    '../view/WindBarbPlacemark',
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        AirTemperatureText,
        ForecastTimeText,
        Log,
        RelativeHumidityText,
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
            this.airTemperatureText = new AirTemperatureText(wxModel.latitude, wxModel.longitude, 'F');
            this.relHumidityText = new RelativeHumidityText(wxModel.latitude, wxModel.longitude, '%');
            this.forecastTimeText = new ForecastTimeText(wxModel.latitude, wxModel.longitude, ' ');

            // Add a reference to our wx model object to the principle renderables.
            // The "movable" wxModel will generate EVENT_OBJECT_MOVED events. See SelectController.
            this.skyCoverPlacemark.pickDelegate = wxModel;
            this.windBarbPlacemark.pickDelegate = wxModel;
            this.airTemperatureText.pickDelegate = wxModel;
            this.relHumidityText.pickDelegate = wxModel;
            this.forecastTimeText.pickDelegate = wxModel;
            
            // Create an EVENT_OBJECT_MOVED handler that synchronizes the renderables with the model's location
            var self = this;
            this.handleObjectMovedEvent = function (wxModel) {
                self.skyCoverPlacemark.position.latitude = wxModel.latitude;
                self.skyCoverPlacemark.position.longitude = wxModel.longitude;
                self.windBarbPlacemark.position.latitude = wxModel.latitude;
                self.windBarbPlacemark.position.longitude = wxModel.longitude;
                self.airTemperatureText.position.latitude = wxModel.latitude;
                self.airTemperatureText.position.longitude = wxModel.longitude;
                self.relHumidityText.position.latitude = wxModel.latitude;
                self.relHumidityText.position.longitude = wxModel.longitude;
                self.forecastTimeText.position.latitude = wxModel.latitude;
                self.forecastTimeText.position.longitude = wxModel.longitude;
            };
            
            // Create an EVENT_WEATHER_CHANGED handler that updates the symbology
            this.handleWeatherChangedEvent = function (wxModel) {
                self.wxForecast = wxModel.wxForecast;
                var values = wxModel.wxForecast.spatioTemporalWeather.spatialDomain.temporalDomain.temporalWeather[0].values,
                    isoTime = wxModel.wxForecast.spatioTemporalWeather.spatialDomain.temporalDomain.temporalWeather[0]['@time'],
                    time = new Date(isoTime),
                    airTmp = values[0],
                    relHum = values[1],
                    wndSpd = values[2],
                    wndDir = values[3],
                    skyCvr = values[4],
                    timeOptions = {"hour": "2-digit", "minute": "2-digit", "timeZoneName": "short"};

                // Update the values
                self.skyCoverPlacemark.updateSkyCoverImage(skyCvr);
                self.windBarbPlacemark.updateWindBarbImage(wndSpd, wndDir);
                self.airTemperatureText.text = airTmp + 'F';
                self.relHumidityText.text = relHum + '%';
                self.forecastTimeText.text = '@ ' + time.toLocaleTimeString('en', timeOptions);
            };

            // Create an EVENT_PLACE_CHANGED handler that updates the label
            this.handlePlaceChangedEvent = function (wxModel) {
                // Display the place name
                if (wxModel.place) {
                    // Use the first place name (ordered by granularity) that's not a zip code
                    for (var i = 0, max = wxModel.place.length; i < max; i++) {
                        if (wxModel.place[i].type !== "Zip Code") {
                            self.skyCoverPlacemark.label = wxModel.place[i].name;
                            return;
                        }
                    }
                }
            };
            
            // Establish the Publisher/Subscriber relationship between this symbol and the wx model
            wxModel.on(Wmt.EVENT_OBJECT_MOVED, this.handleObjectMovedEvent, this);
            wxModel.on(Wmt.EVENT_PLACE_CHANGED, this.handlePlaceChangedEvent, this);
            wxModel.on(Wmt.EVENT_WEATHER_CHANGED, this.handleWeatherChangedEvent, this);


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
            this.airTemperatureText.render(dc);
            this.relHumidityText.render(dc);
            this.forecastTimeText.render(dc);
        };

        return WeatherMapSymbol;
    }
);
