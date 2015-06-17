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
 *     - Neither the name of Bruce Schubert,  nor the names of its 
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

/*global define, $ */

/*global define, $ */

define([
    '../util/Log',
    '../model/WeatherLookout',
    '../util/Messenger',
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        Log,
        WeatherLookout,
        Messenger,
        Wmt,
        WorldWind) {
        "use strict";
        var WeatherPanel = function (controller) {
            var self = this;

            this.ctrl = controller;
            this.manager = this.ctrl.model.weatherManager;
            this.manager.on(Wmt.EVENT_WEATHER_LOOKOUT_ADDED, this.handleWeatherAddedEvent, this);
            this.manager.on(Wmt.EVENT_WEATHER_LOOKOUT_REMOVED, this.handleWeatherRemovedEvent, this);

            // Get the RenderableLayer that we'll add the weathers to.
            this.weatherLayer = this.ctrl.findLayer(Wmt.WEATHERS_LAYER_NAME);
            if (!this.weatherLayer) {
                throw new Error(
                    Log.error("WeatherPanel", "constructor",
                        "Could not find a Layer named " + Wmt.WEATHERS_LAYER_NAME));
            }

            // Add button event handlers
            $("#createWeatherLookout").on("click", function (event) {
                this.ctrl.addWeatherLookoutToGlobe(new WeatherLookout());
            });

            this.loadExistingWeatherLookouts();

            // Initially show the Create tab
            $('#weatherLookoutsBody').collapse('show');
        };



        WeatherPanel.prototype.loadExistingWeatherLookouts = function () {
            var lookouts = this.ctrl.model.weatherManager.lookouts,
                i,
                max;

            for (i = 0, max = lookouts.length; i < max; i++) {
                this.handleWeatherAddedEvent(lookouts[i]);
            }
        };


        WeatherPanel.prototype.handleWeatherAddedEvent = function (wxLookout) {

            if (!this.weatherLayer) {
                return;
            }
            try {
                // Create the symbol on the globe
                this.createRenderable(wxLookout);
                // Update our list of lookouts
                this.synchronizeWeatherList();
            }
            catch (e) {
                Log.error("WeatherPanel", "handleWeatherAddedEvent", e.toString());
            }
        };

        /**
         * Removes the given lookout from the globe and the lookout list.
         * @param {WeatherLookout} wxLookout
         */
        WeatherPanel.prototype.handleWeatherRemovedEvent = function (wxLookout) {
            var i,
                max,
                placename;

            // Handle if the model is initialized before this panel is initialized
            if (!this.weatherLayer) {
                return;
            }
            try {
                for (i = 0, max = this.weatherLayer.renderables.length; i < max; i++) {
                    placename = this.weatherLayer.renderables[i];

                    if (placename.displayName === wxLookout.name) {
                        this.weatherLayer.renderables.splice(i, 1);
                        break;
                    }
                }
                this.synchronizeWeatherList();
            }
            catch (e) {
                Log.error("WeatherPanel", "handleWeatherRemovedEvent", e.toString());
            }
        };

        /**
         * Handler for clicking any one of the weather buttons in the weather list.  
         * 
         * @param {$(li)} weatherName List item element
         * @param {string} action "goto", "edit", or remove
         */
        WeatherPanel.prototype.onWeatherItemClick = function (weatherName, action) {
            var renderables = this.weatherLayer.renderables,
                weather,
                position,
                i,
                len;

            for (i = 0, len = renderables.length; i < len; i += 1) {
                weather = renderables[i];
                if (weather.displayName === weatherName) {
                    switch (action) {
                        case 'goto':
                            position = weather.position;
                            if (position) {
                                this.ctrl.lookAtLatLon(position.latitude, position.longitude);
                            } else {
                                Log.error("WeatherPanel", "onWeatherItemClick", "Weather position is undefined.");
                            }
                            break;
                        case 'edit':
                            Messenger.infoGrowl('Rename is not implemented yet.');
                            Log.error("WeatherPanel", "onWeatherItemClick", "Not implemented action: " + action);
                            break;
                        case 'remove':
                            this.ctrl.model.weatherManager.removeWeather(weather.displayName);
                            break;
                        default:
                            Log.error("WeatherPanel", "onWeatherItemClick", "Unhandled action: " + action);
                    }
                    return;
                }
            }
            Log.error("WeatherPanel", "onWeatherItemClick", "Could not find selected weather in Weathers layer.");
        };


        WeatherPanel.prototype.createRenderable = function (wxLookout) {
            var placemark,
                attr = new WorldWind.PlacemarkAttributes(null),
                hiliteAttr,
                imageSource;

            imageSource = Wmt.IMAGE_PATH + "ics/" + symbol;
            attr.imageScale = 1.5;
            attr.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 0.0);
            attr.imageColor = WorldWind.Color.WHITE;
            attr.labelAttributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 1.0);
            attr.labelAttributes.color = WorldWind.Color.YELLOW;
            attr.drawLeaderLine = true;
            attr.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

            placemark = new WorldWind.Placemark(new WorldWind.Position(wxLookout.latitude, wxLookout.longitude, 0));
            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
            placemark.displayName = wxLookout.name;


//            weather.label = "Weather " + "\n"
//                + "Lat " + latitude.toPrecision(4).toString() + "\n"
//                + "Lon " + longitude.toPrecision(5).toString();

            // Create the placemark attributes for this placemark. 
            // Note that the attributes differ only by their image URL.
            attr = new WorldWind.PlacemarkAttributes(attr);
            attr.imageSource = imageSource;
            placemark.attributes = attr;

            // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
            // the default highlight attributes so that all properties are identical except the image scale. You could
            // instead vary the color, image, or other property to control the highlight representation.
            hiliteAttr = new WorldWind.PlacemarkAttributes(attr);
            hiliteAttr.imageScale = attr.imageScale * 1.2;
            placemark.highlightAttributes = hiliteAttr;

            // Add a reference to our wx lookout model object to the renderable
            placemark.model = wxLookout;
            
            // Add a movable capability to the placemark that handles the move and synchronizes the model object
            // See: SelectController
            placemark.moveToLatLon = function(latitude, longitude) {
                this.position.latitude  = latitude;
                this.position.longitude = longitude;
                this.model.latitude = latitude;
                this.model.longitude = longitude;
            };

            // Render the weather on the globe
            this.weatherLayer.addRenderable(placemark);
        };


        /**
         * Synchronize the weather list with the renderables in the Weathers layer.
         */
        WeatherPanel.prototype.synchronizeWeatherList = function () {
            var self = this,
                renderables = this.weatherLayer.renderables,
                weatherList = $("#weatherList"), weatherItem,
                placemark,
                i,
                len;

            // This preliminary implemenation does a brute force "clear and repopulate" of the list
            weatherList.children().remove();

            for (i = 0, len = renderables.length; i < len; i += 1) {
                placemark = renderables[i];
                //weatherItem = $('<li class="list-group-item btn btn-block">' + weather.displayName + '</li>');
                weatherItem =
                    '<div class="btn-group btn-block btn-group-sm">' +
                    ' <button type="button" class="col-sm-8 btn btn-default wxlookout-goto">' + placemark.displayName + '</button>' +
                    ' <button type="button" class="col-sm-2 btn btn-default wxlookout-edit glyphicon glyphicon-pencil" style="top: 0" weatherName="' + placemark.displayName + '"></button>' +
                    ' <button type="button" class="col-sm-2 btn btn-default wxlookout-remove glyphicon glyphicon-trash" style="top: 0" weatherName="' + placemark.displayName + '"></button>' +
                    '</div>';
                weatherList.append(weatherItem);
            }
            this.ctrl.redrawGlobe();

            // Add event handler to the buttons
            weatherList.find('button.wxlookout-goto').on('click', function (event) {
                self.onWeatherItemClick($(this).text(), "goto");
            });
            weatherList.find('button.wxlookout-edit').on('click', function (event) {
                self.onWeatherItemClick($(this).attr('weatherName'), "edit");
            });
            weatherList.find('button.wxlookout-remove').on('click', function (event) {
                self.onWeatherItemClick($(this).attr('weatherName'), "remove");
            });
        };

        return WeatherPanel;
    }
);