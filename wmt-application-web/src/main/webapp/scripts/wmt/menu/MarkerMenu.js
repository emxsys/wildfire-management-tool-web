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
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        Log,
        Messenger,
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

                // Add button event handlers
                $("#createMarker").on("click", function (event) {
                    self.createIcsMarker();
                });
                $("#createPushpin").on("click", function (event) {
                    self.createPushpin();
                });

                // Attach a click handler to the markers in the marker list
                $('#markerList').find('li').on('click', function (event) {
                    self.onMarkerItemClick($(this));
                });

            }
            
            // Show the Create tab
            $('#markersCreateBody').collapse('show');
        };


        /**
         * Handler for clicking a marker in the marker list.  
         * Default behavior is to "go to" the selected marker.
         * 
         * @param {$(li)} markerName List item element
         */
        MarkerMenu.prototype.onMarkerItemClick = function (markerName, action) {
            var markers = this.markerLayer.renderables,
                marker,
                position,
                i,
                len;

            for (i = 0, len = markers.length; i < len; i += 1) {
                marker = markers[i];
                if (marker.displayName === markerName) {
                    if (action === 'goto') {
                        position = marker.position;
                        if (position) {
                            this.ctrl.lookAtLatLon(position.latitude, position.longitude);
                            return;
                        }
                        Log.error("MarkerMenu", "onMarkerItemClick", "Marker position is undefined.");
                    } else if (action === 'edit') {
                        Messenger.infoGrowl('Rename is not implemented yet.');
                        Log.error("MarkerMenu", "onMarkerItemClick", "Not implemented action: " + action);
                        return;
                    } else if (action === 'remove') {
                        markers.splice(i, 1);
                        this.synchronizeMarkerList();
                        return;
                    } else {
                        Log.error("MarkerMenu", "onMarkerItemClick", "Unhandled action: " + action);
                    }
                    return;
                }
            }
            Log.error("MarkerMenu", "onMarkerItemClick", "Could not find selected marker in Markers layer.");
            // TODO: Growl
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
                Messenger.warningGrowl("You must select an ICS marker first.", "Sorry!");
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
            // 
            if (!symbol) {
                Messenger.warningGrowl("You must select a pushpin first.", "Oops!");
                return;
            }
            // Add the pushpin to the globe
            this.createMarker(pushpinName, imgFolder + symbol);
        };

        /**
         * Adds the given image to the globe.
         * @param {String} name Name given to the marker.
         * @param {String} imageSource The image source (filepath).
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

            // TODO: Create a unique marker name.


            marker.displayName = this.generateUniqueName(name);
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


        /**
         * Generates a unique name by appending a suffix '(n)'.
         * @param {String} name
         * @returns {String}
         */
        MarkerMenu.prototype.generateUniqueName = function (name) {
            var markers = this.markerLayer.renderables,
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
                    if (markers[i].displayName === uniqueName) {

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
         * dropdown item text upon selection.
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
         * Synchronize the marker list with the renderables in the Markers layer.
         */
        MarkerMenu.prototype.synchronizeMarkerList = function () {
            var self = this,
                markers = this.markerLayer.renderables,
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
                    ' <button type="button" class="col-sm-2 btn btn-default mkr-edit glyphicon glyphicon-pencil" style="top: 0"></button>' +
                    ' <button type="button" class="col-sm-2 btn btn-default mkr-remove glyphicon glyphicon-trash" style="top: 0"></button>' +
                    '</div>';
                markerList.append(markerItem);
            }
            this.wwd.redraw();

            // Add event handler to the buttons
            markerList.find('button.mkr-goto').on('click', function (event) {
                self.onMarkerItemClick($(this).text(), "goto");
            });
            markerList.find('button.mkr-edit').on('click', function (event) {
                // find the sibling with the text and send that to the event handler
                var name = $(this).siblings().filter('.mkr-goto').text();
                self.onMarkerItemClick(name, "edit");
            });
            markerList.find('button.mkr-remove').on('click', function (event) {
                var name = $(this).siblings().filter('.mkr-goto').text();
                self.onMarkerItemClick(name, "remove");
            });
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


        return MarkerMenu;
    }
);