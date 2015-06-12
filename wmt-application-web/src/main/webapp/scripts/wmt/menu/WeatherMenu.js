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
    '../util/Messenger',
    '../../nasa/layer/RenderableLayer',
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        Log,
        Messenger,
        RenderableLayer,
        Wmt,
        WorldWind) {
        "use strict";
        var WeatherMenu = function (controller) {
            var self = this;

            this.ctrl = controller;
            this.wxStations = {
                stations: []
            };
            this.wxLookouts = {
                lookouts: []
            };

            // CAUTION: change the type value may cause existing markers in local storage to be lost
            // ICS Category
            this.icsTypes = [
                {type: "aerial-hazard", name: "Aerial Hazard ", symbol: "Aerial_Hazard24.png"},
            ];

            // Pusphin Category
            this.pushpinTypes = [
                {type: "black", name: "Black ", symbol: "castshadow-black.png"},
            ];

            // Get the RenderableLayer that we'll add the markers to.
            this.weatherLayer = this.ctrl.findLayer(Wmt.WEATHER_LAYER_NAME);
            if (!this.weatherLayer) {
                throw new Error(
                    Log.error("WeatherMenu", "constructor",
                        "Could not find a Layer named " + Wmt.WEATHER_LAYER_NAME));
            }

            if (this.weatherLayer) {
                this.populateIcsMarkerDropdown();
                this.populatePushpinDropdown();

                // Add button event handlers
                $("#createWeatherLookout").on("click", function (event) {
                    self.createWeatherLookout();
                });

                // Attach a click handler to the markers in the marker list
                $('#weatherLookoutList').find('li').on('click', function (event) {
                    self.onLookoutItemClick($(this));
                });

                this.loadWeatherLookouts();
                this.synchronizeMarkerList();
            }
            // Initially show the Create tab
            $('#markersCreateBody').collapse('show');
        };

        WeatherMenu.prototype.loadWeatherLookouts = function () {
//            var markers = this.ctrl.model.markers,
//                marker,
//                types,
//                mkrIdx,
//                typIdx,
//                symbol;
//
//            if (!markers) {
//                return;
//            }
//            for (mkrIdx = 0; mkrIdx < markers.length; mkrIdx++) {
//                marker = markers[mkrIdx];
//                // Find the selected symbol
//                if (marker.category === "ics") {
//                    types = this.icsTypes;
//                }
//                else if (marker.category === "pushpin") {
//                    types = this.pushpinTypes;
//                }
//                else {
//                    Log.error("MarkerMenu", "loadMarkers", "unhandled marker category: " + marker.category);
//                    continue;
//                }
//                try {
//                    // Find a symbol for this marker type
//                    for (typIdx = 0; typIdx < types.length; typIdx++) {
//                        if (marker.type === types[typIdx].type) {
//                            symbol = types[typIdx].symbol;
//                            break;
//                        }
//                    }
//                    if (!symbol) {
//                        Log.error("MarkerMenu", "loadMarkers", "type not found: " + marker.type);
//                        marker.invalid = true;  // Flag this marker... so we don't save it
//                        continue;
//                    }
//                    this.createRenderable(
//                        marker.name,
//                        marker.category,
//                        marker.type,
//                        symbol,
//                        marker.latitude,
//                        marker.longitude);
//                }
//                catch (e) {
//                    Log.error("MarkerMenu", "loadMarkers", e.toString());
//                }
//            }
        };


        /**
         * Handler for clicking a lookout in the lookouts list.  
         * Default behavior is to "go to" the selected lookout.
         * 
         * @param {$(li)} lookoutName List item element
         */
        WeatherMenu.prototype.onLookoutItemClick = function (lookoutName, action) {
            var renderables = this.weatherLayer.renderables,
                renderable,
                position,
                i,
                len;

            // Find the renderable with the given name
            for (i = 0, len = renderables.length; i < len; i += 1) {
                renderable = renderables[i];
                if (renderable.displayName === lookoutName) {
                    switch (action) {
                        case 'goto':
                            position = renderable.position;
                            if (position) {
                                this.ctrl.lookAtLatLon(position.latitude, position.longitude);
                            } else {
                                Log.error("WeatherMenu", "onWeatherItemClick", "Weather position is undefined.");
                            }
                            break;
                        case 'edit':
                            Messenger.infoGrowl('Rename is not implemented yet.');
                            Log.error("WeatherMenu", "onWeatherItemClick", "Not implemented action: " + action);
                            break;
                        case 'remove':
                            this.ctrl.model.removeMarker(renderable.displayName);
                            renderables.splice(i, 1);
                            this.synchronizeMarkerList();
                            break;
                        default:
                            Log.error("MarkerMenu", "onMarkerItemClick", "Unhandled action: " + action);
                    }
                    return;
                }
            }
            Log.error("MarkerMenu", "onMarkerItemClick", "Could not find selected marker in Markers layer.");
        };

        /**
         * Adds a weather lookout renderable to globe.
         */
        WeatherMenu.prototype.createWeatherLookout = function () {
            var markerName = $("#icsMarkerDropdown").find('.dropdown-toggle').text(),
                lat = this.ctrl.model.viewpoint.target.latitude,
                lon = this.ctrl.model.viewpoint.target.longitude,
                type,
                i;

            // Find the selected type and symbol
            for (i = 0; i < this.icsTypes.length; i += 1) {
                if (markerName === this.icsTypes[i].name) {
                    type = this.icsTypes[i].type;
                    break;
                }
            }
            if (!type) {
                Messenger.warningGrowl("You must select an ICS marker first.", "Sorry!");
                return;
            }
            // Add the marker to the globe.
            this.createMarker(markerName, "ics", type, lat, lon);
            // Update our marker list presentation 
            this.synchronizeMarkerList();
        };


        /**
         * Adds a weather station renderable to the globe.
         */
        WeatherMenu.prototype.createWeatherStation = function () {
            var lat = this.ctrl.model.viewpoint.target.latitude,
                lon = this.ctrl.model.viewpoint.target.longitude,
                type,
                i;

            // Add the pushpin to the globe
            this.createMarker(name, "pushpin", type, lat, lon);
            // Update our marker list presentation 
            this.synchronizeMarkerList();
        };


        WeatherMenu.prototype.createMarker = function (name, category, type, latitude, longitude) {
            var uniqueName = this.generateUniqueName(name),
                symbol,
                types,
                i;

            this.ctrl.model.addMarker(uniqueName, category, type, latitude, longitude);
            this.createRenderable(uniqueName, category, type, symbol, latitude, longitude);

        };

        WeatherMenu.prototype.createRenderable = function (name, category, type, symbol, latitude, longitude) {
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


//            marker.label = "Marker " + "\n"
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

            // Inject OUR own marker properties 
            placemark.markerCategory = category;
            placemark.markerType = type;

            // Render the marker on the globe
            this.weatherLayer.addRenderable(placemark);
        };


        /**
         * Generates a unique name by appending a suffix '(n)'.
         * @param {String} name
         * @returns {String}
         */
        WeatherMenu.prototype.generateUniqueName = function (name) {
            var markers = this.ctrl.model.markers,
                uniqueName = name.trim(),
                isUnique,
                suffixes,
                seqNos,
                n,
                i,
                len;

            do {
                // Assume uniqueness, set to false if we find a matching name
                isUnique = true;

                for (i = 0, len = markers.length; i < len; i += 1) {
                    if (markers[i].name === uniqueName) {

                        isUnique = false;

                        // check for existing suffix '(n)' and increment
                        suffixes = uniqueName.match(/[(]\d+[)]$/);
                        if (suffixes) {
                            seqNos = suffixes[0].match(/\d+/);
                            n = parseInt(seqNos[0], 10) + 1;
                            uniqueName = uniqueName.replace(/[(]\d+[)]$/, '(' + n + ')');
                        } else {
                            // else if no suffix, create one
                            uniqueName += ' (2)';   // The first duplicate is #2
                        }
                        // Break out of for loop and recheck uniqueness
                        break;
                    }
                }
            } while (!isUnique);

            return uniqueName;
        };


        /**
         * Populate the ICS markers dropdown.
         */
        WeatherMenu.prototype.populateIcsMarkerDropdown = function () {
            this.populateDropdown('#icsMarkerDropdown', this.icsTypes, Wmt.IMAGE_PATH + "ics/");
        };


        /**
         * Populate the Pushpins dropdown.
         */
        WeatherMenu.prototype.populatePushpinDropdown = function () {
            this.populateDropdown('#pushpinDropdown', this.pushpinTypes, Wmt.WORLD_WIND_PATH + "images/pushpins/");
        };


        /**
         * Populate a dropdown with contents and configure an event handler to update the 
         * dropdown item text upon selection.
         * 
         * @param {String} id Id of drop down panel, e.g, "#id".
         * @param {Array} markerArray Array of {name:, symbol:} objects.
         * @param {String} imagePath Path to folder containing the images.
         */
        WeatherMenu.prototype.populateDropdown = function (id, markerArray, imagePath) {
            var $ul = $(id + ' ul'),
                markerItem,
                i;

            // Populate the dropdown contents with the markers
            for (i = 0; i < markerArray.length; i += 1) {
                markerItem = $('<li><a markertype="' + markerArray[i].type + '">' +
                    '<span><img class="icon" src="' + imagePath + markerArray[i].symbol + '" style="padding-right: 5px;"></span>' +
                    markerArray[i].name +
                    '</a></li>');
                $ul.append(markerItem);
            }
            // Add a handler that displays the selected item in the dropdown button
            $ul.find('li a').click(function () {
                var selText = $(this).text();
                $(id).find('.dropdown-toggle').html(selText + '<span class="caret"></span>');
            });
        };



        /**
         * Synchronize the marker list with the renderables in the Markers layer.
         */
        WeatherMenu.prototype.synchronizeMarkerList = function () {
            var self = this,
                markers = this.weatherLayer.renderables,
                markerList = $("#markerList"), markerItem,
                marker,
                i,
                len;

            markerList.children().remove();

            for (i = 0, len = markers.length; i < len; i += 1) {
                marker = markers[i];
                //markerItem = $('<li class="list-group-item btn btn-block">' + marker.displayName + '</li>');
                markerItem =
                    '<div class="btn-group btn-block btn-group-sm">' +
                    ' <button type="button" class="col-sm-8 btn btn-default mkr-goto">' + marker.displayName + '</button>' +
                    ' <button type="button" class="col-sm-2 btn btn-default mkr-edit glyphicon glyphicon-pencil" style="top: 0" markerName="' + marker.displayName + '"></button>' +
                    ' <button type="button" class="col-sm-2 btn btn-default mkr-remove glyphicon glyphicon-trash" style="top: 0" markerName="' + marker.displayName + '"></button>' +
                    '</div>';
                markerList.append(markerItem);
            }
            this.ctrl.redrawGlobe();

            // Add event handler to the buttons
            markerList.find('button.mkr-goto').on('click', function (event) {
                self.onLookoutItemClick($(this).text(), "goto");
            });
            markerList.find('button.mkr-edit').on('click', function (event) {
                self.onLookoutItemClick($(this).attr('markerName'), "edit");
            });
            markerList.find('button.mkr-remove').on('click', function (event) {
                self.onLookoutItemClick($(this).attr('markerName'), "remove");
            });
        };

        return WeatherMenu;
    }
);