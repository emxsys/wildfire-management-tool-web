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
                {name: "Yellow ", symbol: "castshadow-yellow.png"},
                {name: "Orange ", symbol: "castshadow-orange.png"},
                {name: "Purple ", symbol: "castshadow-purple.png"},
                {name: "White ", symbol: "castshadow-white.png"}
            ];

            this.markerLayer = this.findMarkerLayer();

            // Populate the Markers menu with existing marker items
            if (this.markerLayer) {
                this.createICSDropdown();
                this.createPushpinDropdown();

                //this.synchronizeMarkerList();

                // Attach a click handler to the new marker menu items
                $('#markerList').find('li').on('click', function (event) {
                    self.onMarkerClick($(this));
                });

                // Add Control Panel > Globe event handlers
                $("#createMarker").on("click", function (event) {
                    self.onCreateICSMarker();
                });
                $("#createPushpin").on("click", function (event) {
                    self.onCreatePushpin();
                });
            }
        };

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


        MarkerMenu.prototype.createICSDropdown = function () {
            var imgFolder = Wmt.IMAGE_PATH + "ics/",
                ulItem = $("#icsMarkerDropdown ul"),
                markerItem,
                i;

            // Populate the dropdown contents with the markers
            for (i = 0; i < this.icsMarkers.length; i++) {
                markerItem = $('<li><a >' +
                    '<span><img src="' + imgFolder + this.icsMarkers[i].icon + '" style="padding-right: 5px;"></span>' +
                    this.icsMarkers[i].name + '</a></li>');
                ulItem.append(markerItem);
            }
            // Add a handler that displays the selected item in the dropdown button
            ulItem.find('li a').click(function () {
                var selText = $(this).text();
                $("#icsMarkerDropdown").find('.dropdown-toggle').html(selText + '<span class="caret"></span>');
            });
        };


        MarkerMenu.prototype.createPushpinDropdown = function () {
            var ulItem = $("#pushpinDropdown ul"),
                pushpinItem,
                i;

            // Populate the dropdown contents with the markers
            for (i = 0; i < this.pushpins.length; i++) {
                pushpinItem = $('<li><a >' + this.pushpins[i].name + '</a></li>');
                ulItem.append(pushpinItem);
            }
            // Add a handler that displays the selected item in the dropdown button
            ulItem.find('li a').click(function () {
                var selText = $(this).text();
                $("#pushpinDropdown").find('.dropdown-toggle').html(selText + '<span class="caret"></span>');
            });
        };


        MarkerMenu.prototype.onCreateICSMarker = function () {
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
            this.createMarker(imgFolder + symbol);
        };

        MarkerMenu.prototype.onCreatePushpin = function () {
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
            this.createMarker(imgFolder + symbol);
        };

        MarkerMenu.prototype.createMarker = function (image) {
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
//            marker.label = "Marker " + "\n"
//                + "Lat " + latitude.toPrecision(4).toString() + "\n"
//                + "Lon " + longitude.toPrecision(5).toString();

            // Create the placemark attributes for this placemark. Note that the attributes differ only by their
            // image URL.
            attr = new WorldWind.PlacemarkAttributes(attr);
            attr.imageSource = image;
            marker.attributes = attr;

            // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
            // the default highlight attributes so that all properties are identical except the image scale. You could
            // instead vary the color, image, or other property to control the highlight representation.
            hiliteAttr = new WorldWind.PlacemarkAttributes(attr);
            hiliteAttr.imageScale = 1.2;
            marker.highlightAttributes = hiliteAttr;

            this.markerLayer.addRenderable(marker);
        };

        MarkerMenu.prototype.onMarkerClick = function (markerItem) {
            var markerName = markerItem.text(),
                i,
                len,
                marker;

            // Update the marker state for the selected marker.
            for (i = 0, len = this.wwd.markers.length; i < len; i++) {
                marker = this.wwd.markers[i];
                if (marker.displayName === markerName) {
                    marker.enabled = !marker.enabled;
                    this.highlightMarker(marker, markerItem);
                    this.wwd.redraw();
                }
            }
        };

        MarkerMenu.prototype.synchronizeMarkerList = function () {
//        var markerListItem = $("#markerList"),
//            markerItem,
//            marker,
//            i,
//            len;
//
//        markerListItem.remove('a');
//
//        // Synchronize the displayed marker list with the World Window's marker list.
//        for (i = 0, len = this.wwd.markers.length; i < len; i++) {
//            marker = this.wwd.markers[i];
//            markerItem = $('<li class="list-group-item">' + marker.displayName + '</li>');
//            markerListItem.append(markerItem);
//            this.highlightMarker(marker, markerItem);
//            this.wwd.redraw();
//        }
        };

        return MarkerMenu;
    }
);