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
    '../../nasa/layer/RenderableLayer',
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        Log,
        WeatherLookout,
        Messenger,
        RenderableLayer,
        Wmt,
        WorldWind) {
        "use strict";
        var WeatherPanel = function (controller) {
            var self = this;

            this.ctrl = controller;
            this.manager = this.ctrl.model.weatherManager;
            //this.manager.on(Wmt.EVENT_WEATHER_LOOKOUT_ADDED, this.handleWeatherAddedEvent, this);
            //this.manager.on(Wmt.EVENT_WEATHER_LOOKOUT_REMOVED, this.handleWeatherRemovedEvent, this);



            // Get the RenderableLayer that we'll add the weathers to.
            this.weatherLayer = this.ctrl.findLayer(Wmt.WEATHERS_LAYER_NAME);
            if (!this.weatherLayer) {
                throw new Error(
                    Log.error("WeatherPanel", "constructor",
                        "Could not find a Layer named " + Wmt.WEATHERS_LAYER_NAME));
            }

            // Add button event handlers
            $("#createWeatherLookout").on("click", function (event) {
                self.onCreateWeatherLookout();
            });

            this.loadExistingWeatherLookouts();

            // Initially show the Create tab
            $('#weatherLookoutsBody').collapse('show');
        };


        /**
         * Handles the dropdown button click: adds the selected ICS weather type to the globe.
         */
        WeatherPanel.prototype.onCreateWeatherLookout = function () {
            var lat = this.ctrl.model.viewpoint.target.latitude,
                lon = this.ctrl.model.viewpoint.target.longitude;

            // This action will fire the weather added event.
            this.ctrl.model.weatherManager.addWeather(name, category, type, lat, lon);
        };

        WeatherPanel.prototype.loadExistingWeatherLookouts = function () {
            var weathers = this.ctrl.model.weatherManager.weathers,
                i,
                max;
            
            for (i = 0, max = weathers.length; i < max; i++) {
                this.handleWeatherAddedEvent(weathers[i]);
            }
        };




        WeatherPanel.prototype.handleWeatherAddedEvent = function (weatherNode) {
            var symbol = this.findSymbol(weatherNode.category, weatherNode.type);

            // Handle if the model is initialized before this panel is initialized
            if (!this.weatherLayer) {
                return;
            }
            if (!symbol) {
                Log.error("WeatherPanel", "handleWeatherAddedEvent", "Symbol not found for weather type: " + weatherNode.type);
                // Flag this weather... so we don't save it
                weatherNode.invalid = true;
                return;
            }
            try {
                // Create the symbol on the globe
                this.createRenderable(
                    weatherNode.name,
                    weatherNode.category,
                    weatherNode.type,
                    symbol,
                    weatherNode.latitude,
                    weatherNode.longitude);
                // Update our list of weathers
                this.synchronizeWeatherList();
            }
            catch (e) {
                Log.error("WeatherPanel", "handleWeatherAddedEvent", e.toString());
            }
        };

        /**
         * Removes the given weather from the globe and the weather list.
         * @param {Object} weatherNode
         */
        WeatherPanel.prototype.handleWeatherRemovedEvent = function (weatherNode) {
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

                    if (placename.displayName === weatherNode.name) {
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
            var weathers = this.weatherLayer.renderables,
                weather,
                position,
                i,
                len;

            for (i = 0, len = weathers.length; i < len; i += 1) {
                weather = weathers[i];
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


        WeatherPanel.prototype.findSymbol = function (category, type) {
            var symbol,
                types,
                i,
                len;

            // Find the selected symbol
            switch (category) {
                case 'ics':
                    types = this.icsTypes;
                    break;
                case 'pushpin':
                    types = this.pushpinTypes;
                    break;
                default:
                    Log.error("WeatherPanel", "findSymbol", "unhandled weather category: " + category);
                    return;
            }
            for (i = 0, len = types.length; i < len; i += 1) {
                if (type === types[i].type) {
                    symbol = types[i].symbol;
                    break;
                }
            }
            return symbol;
        };


        WeatherPanel.prototype.createRenderable = function (name, category, type, symbol, latitude, longitude) {
            var placemark,
                attr = new WorldWind.PlacemarkAttributes(null),
                hiliteAttr,
                imageSource;

            // Set up the common placemark attributes.
            switch (category) {
                case 'ics':
                    imageSource = Wmt.IMAGE_PATH + "ics/" + symbol;
                    attr.imageScale = 1.5;
                    attr.imageOffset = new WorldWind.Offset(
                        WorldWind.OFFSET_FRACTION, 0.5,
                        WorldWind.OFFSET_FRACTION, 0.0);
                    break;
                case 'pushpin':
                    imageSource = Wmt.WORLD_WIND_PATH + "images/pushpins/" + symbol;
                    attr.imageScale = 0.8;
                    attr.imageOffset = new WorldWind.Offset(
                        WorldWind.OFFSET_FRACTION, 0.3,
                        WorldWind.OFFSET_FRACTION, 0.0);
                    break;
            }
            attr.imageColor = WorldWind.Color.WHITE;
            attr.labelAttributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 1.0);
            attr.labelAttributes.color = WorldWind.Color.YELLOW;
            attr.drawLeaderLine = true;
            attr.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

            placemark = new WorldWind.Placemark(new WorldWind.Position(latitude, longitude, 0));
            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
            placemark.displayName = name;


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

            // Inject OUR own weather properties 
            placemark.weatherCategory = category;
            placemark.weatherType = type;

            // Render the weather on the globe
            this.weatherLayer.addRenderable(placemark);
        };


        /**
         * Populate the ICS weathers dropdown.
         */
        WeatherPanel.prototype.populateIcsWeatherDropdown = function () {
            this.populateDropdown('#icsWeatherDropdown', this.icsTypes, Wmt.IMAGE_PATH + "ics/");
        };


        /**
         * Populate the Pushpins dropdown.
         */
        WeatherPanel.prototype.populatePushpinDropdown = function () {
            this.populateDropdown('#pushpinDropdown', this.pushpinTypes, Wmt.WORLD_WIND_PATH + "images/pushpins/");
        };


        /**
         * Populate a dropdown with contents and configure an event handler to update the 
         * dropdown item text upon selection.
         * 
         * @param {String} id Id of drop down panel, e.g, "#id".
         * @param {Array} weatherArray Array of {name:, symbol:} objects.
         * @param {String} imagePath Path to folder containing the images.
         */
        WeatherPanel.prototype.populateDropdown = function (id, weatherArray, imagePath) {
            var $ul = $(id + ' ul'),
                weatherItem,
                i;

            // Populate the dropdown contents with the weather names, symbols, and types
            for (i = 0; i < weatherArray.length; i += 1) {
                weatherItem = $('<li><a weathertype="' + weatherArray[i].type + '">' +
                    '<span><img class="icon" src="' + imagePath + weatherArray[i].symbol + '" style="padding-right: 5px;"></span>' +
                    weatherArray[i].name +
                    '</a></li>');
                $ul.append(weatherItem);
            }
            // Add a handler that displays the selected item's icon and text in the dropdown button
            $ul.find('li a').click(function () {
                var selectdItemHtml = $(this).html(),
                    type = $(this).attr('weathertype'),
                    $btn = $(id).find('.dropdown-toggle');

                $btn.html(selectdItemHtml + '<span class="caret"></span>');
                $btn.attr('weathertype', type);
            });
        };



        /**
         * Synchronize the weather list with the renderables in the Weathers layer.
         */
        WeatherPanel.prototype.synchronizeWeatherList = function () {
            var self = this,
                weathers = this.weatherLayer.renderables,
                weatherList = $("#weatherList"), weatherItem,
                weather,
                i,
                len;

            // This preliminary implemenation does a brute force "clear and repopulate" of the list
            weatherList.children().remove();

            for (i = 0, len = weathers.length; i < len; i += 1) {
                weather = weathers[i];
                //weatherItem = $('<li class="list-group-item btn btn-block">' + weather.displayName + '</li>');
                weatherItem =
                    '<div class="btn-group btn-block btn-group-sm">' +
                    ' <button type="button" class="col-sm-8 btn btn-default mkr-goto">' + weather.displayName + '</button>' +
                    ' <button type="button" class="col-sm-2 btn btn-default mkr-edit glyphicon glyphicon-pencil" style="top: 0" weatherName="' + weather.displayName + '"></button>' +
                    ' <button type="button" class="col-sm-2 btn btn-default mkr-remove glyphicon glyphicon-trash" style="top: 0" weatherName="' + weather.displayName + '"></button>' +
                    '</div>';
                weatherList.append(weatherItem);
            }
            this.ctrl.redrawGlobe();

            // Add event handler to the buttons
            weatherList.find('button.mkr-goto').on('click', function (event) {
                self.onWeatherItemClick($(this).text(), "goto");
            });
            weatherList.find('button.mkr-edit').on('click', function (event) {
                self.onWeatherItemClick($(this).attr('weatherName'), "edit");
            });
            weatherList.find('button.mkr-remove').on('click', function (event) {
                self.onWeatherItemClick($(this).attr('weatherName'), "remove");
            });
        };

        return WeatherPanel;
    }
);