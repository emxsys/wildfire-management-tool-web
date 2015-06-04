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
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        Wmt,
        WorldWind) {
        "use strict";
        var MarkerMenu = function (worldWindow, controller) {
            var self = this;

            this.wwd = worldWindow;
            this.ctrl = controller;

            this.icsMarkers = [
                {name: "Fire Origin ", symbol: "Fire_Origin24.png", icon: "Fire_Origin.png"},
                {name: "Fire Location ", symbol: "Fire_Location24.png", icon: "Fire_Location.png"},
                {name: "Drop Point ", symbol: "Drop_Point24.png", icon: "Drop_Point.png"},
                {name: "Incident Command Post ", symbol: "Incident_Command_Post24.png", icon: "Incident_Command_Post.png"}
            ];

            this.pushpins = [
                {name: "Black ", symbol: "castshadow-black.png"},
                {name: "Red ", symbol: "castshadow-red.png"},
                {name: "Green ", symbol: "castshadow-green.png"},
                {name: "Blue ", symbol: "castshadow-blue.png"},
                {name: "Teal ", symbol: "castshadow-teal.png"},
                {name: "Orange ", symbol: "castshadow-orange.png"},
                {name: "Purple ", symbol: "castshadow-purple.png"},
                {name: "Brown ", symbol: "castshadow-brown.png"},
                {name: "White ", symbol: "castshadow-white.png"}
            ];

            // Get the Markers layer from the globe.
            this.markerLayer = this.findMarkerLayer();

            // Populate the Markers menu with existing marker items
            if (this.markerLayer) {
                this.populateIcsMarkerDropdown();
                this.populatePushpinDropdown();

                this.synchronizeMarkerList();

                // Attach a click handler to the new marker menu items
                $('#markerList').find('li').on('click', function (event) {
                    self.onMarkerClick($(this));
                });

                // Add Control Panel > Globe event handlers
                $("#createMarker").on("click", function (event) {
                    self.createIcsMarker();
                });
                $("#createPushpin").on("click", function (event) {
                    self.createPushpin();
                });
            }
        };

        /**
         * Finds the Markers Renerablelayer from the WorldWindow.layers.
         * @returns {Renerablelayer}
         */
        MarkerMenu.prototype.findMarkerLayer = function () {
            var layer,
                i,
                len;

            // Find the Markers layer in the World Window's layer list.
            for (i = 0, len = this.wwd.layers.length; i < len; i += 1) {
                layer = this.wwd.layers[i];
                if (layer.displayName === 'Markers') {
                    return layer;
                }
            }
        };


        /**
         * Populate the ICS markers dropdown.
         */
        MarkerMenu.prototype.populateIcsMarkerDropdown = function () {
            this.populateDropdown('#icsMarkerDropdown', this.icsMarkers, Wmt.IMAGE_PATH + "ics/");
        };


        /**
         * Populate the Pushpins dropdown.
         */
        MarkerMenu.prototype.populatePushpinDropdown = function () {
            this.populateDropdown('#pushpinDropdown', this.pushpins, Wmt.WORLD_WIND_PATH + "images/pushpins/");
        };


        /**
         * Populate a dropdown with contents and configure an event handler to update the 
         * text upon selection.
         * 
         * @param {String} id Id of drop down panel, e.g, "#id".
         * @param {Array} markerArray Array of {name:, symbol:} objects.
         * @param {String} imagePath Path to folder containing the images.
         */
        MarkerMenu.prototype.populateDropdown = function (id, markerArray, imagePath) {
            var $ul = $(id + ' ul'),
                markerItem,
                i;

            // Populate the dropdown contents with the markers
            for (i = 0; i < markerArray.length; i += 1) {
                markerItem = $('<li><a >' +
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
         * Adds the selected ICS marker to the globe.
         */
        MarkerMenu.prototype.createIcsMarker = function () {
            var imgFolder = Wmt.IMAGE_PATH + "ics/",
                markerName = $("#icsMarkerDropdown").find('.dropdown-toggle').text(),
                symbol,
                i;

            // Find the selected symbol
            for (i = 0; i < this.icsMarkers.length; i += 1) {
                if (markerName === this.icsMarkers[i].name) {
                    symbol = this.icsMarkers[i].symbol;
                }
            }
            if (!symbol) {
                // TODO: Log and Growl
                return;
            }
            // Add the marker to the globe.
            this.createMarker(markerName, imgFolder + symbol);
        };


        /**
         * Adds a pushpin to the globe.
         */
        MarkerMenu.prototype.createPushpin = function () {
            var imgFolder = Wmt.WORLD_WIND_PATH + "images/pushpins/",
                pushpinName = $("#pushpinDropdown").find('.dropdown-toggle').text(),
                symbol,
                i;

            // Find the selected symbol
            for (i = 0; i < this.pushpins.length; i += 1) {
                if (pushpinName === this.pushpins[i].name) {
                    symbol = this.pushpins[i].symbol;
                }
            }
            if (!symbol) {
                // TODO: Log and Growl
                return;
            }
            // Add the pushpin to the globe\
            this.createMarker(pushpinName, imgFolder + symbol);
        };

        /**
         * Adds the given image to the globe.
         * 
         * @param {String} imageSource Image source.
         */
        MarkerMenu.prototype.createMarker = function (name, imageSource) {
            var marker,
                attr = new WorldWind.PlacemarkAttributes(null),
                hiliteAttr,
                latitude = this.ctrl.model.viewpoint.target.latitude,
                longitude = this.ctrl.model.viewpoint.target.longitude,
                elevation = 0; // elevation is AGL;

            // Set up the common placemark attributes.
            attr.imageScale = 1;
            attr.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.3,
                WorldWind.OFFSET_FRACTION, 0.0);
            attr.imageColor = WorldWind.Color.WHITE;
            attr.labelAttributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 1.0);
            attr.labelAttributes.color = WorldWind.Color.YELLOW;
            attr.drawLeaderLine = true;
            attr.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

            marker = new WorldWind.Placemark(new WorldWind.Position(latitude, longitude, elevation));
            marker.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
            marker.displayName = name;
//            marker.label = "Marker " + "\n"
//                + "Lat " + latitude.toPrecision(4).toString() + "\n"
//                + "Lon " + longitude.toPrecision(5).toString();

            // Create the placemark attributes for this placemark. 
            // Note that the attributes differ only by their image URL.
            attr = new WorldWind.PlacemarkAttributes(attr);
            attr.imageSource = imageSource;
            marker.attributes = attr;

            // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
            // the default highlight attributes so that all properties are identical except the image scale. You could
            // instead vary the color, image, or other property to control the highlight representation.
            hiliteAttr = new WorldWind.PlacemarkAttributes(attr);
            hiliteAttr.imageScale = 1.2;
            marker.highlightAttributes = hiliteAttr;

            this.markerLayer.addRenderable(marker);
            
            this.synchronizeMarkerList();
        };


//        MarkerMenu.prototype.onMarkerClick = function (markerItem) {
//            var markerName = markerItem.text(),
//                i,
//                len,
//                marker;
//
//            // Update the marker state for the selected marker.
//            for (i = 0, len = this.wwd.markers.length; i < len; i++) {
//                marker = this.wwd.markers[i];
//                if (marker.displayName === markerName) {
//                    marker.enabled = !marker.enabled;
//                    this.highlightMarker(marker, markerItem);
//                    this.wwd.redraw();
//                }
//            }
//        };

        MarkerMenu.prototype.synchronizeMarkerList = function () {
            var markers = this.markerLayer.renderables,
                markerList = $("#markerList"),
                markerItem,
                marker,
                i,
                len;

            // Synchronize the marker list with the renderables in the Markers layer.
            markerList.find('li').remove();
            for (i = 0, len = markers.length; i < len; i += 1) {
                marker = markers[i];
                markerItem = $('<li class="list-group-item btn btn-block">' + marker.displayName + '</li>');
                markerList.append(markerItem);
                //this.highlightMarker(marker, markerItem);
                this.wwd.redraw();
            }
        };

        return MarkerMenu;
    }
);