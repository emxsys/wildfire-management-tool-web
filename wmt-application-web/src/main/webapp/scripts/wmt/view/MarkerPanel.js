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

/**
 * The MarkerPanel provides a view of the marker model objects. 
 * 
 * @param {type} Log
 * @param {type} MarkerPalette
 * @param {type} Messenger
 * @param {type} Wmt
 * @param {type} WorldWind
 * @returns {MarkerPanel}
 */
define([
    '../util/Log',
    '../menu/MarkerPalette',
    '../util/Messenger',
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        Log,
        MarkerPalette,
        Messenger,
        Wmt,
        WorldWind) {
        "use strict";
        /**
         * Constructs a MarkerPanel 
         * @constructor
         * @param {type} controller
         * @returns {MarkerPanel}
         */
        var MarkerPanel = function (controller) {
            var self = this,
                i,
                max;

            this.ctrl = controller;
            this.manager = this.ctrl.model.markerManager;
            this.manager.on(Wmt.EVENT_MARKER_ADDED, this.handleMarkerAddedEvent, this);
            this.manager.on(Wmt.EVENT_MARKER_REMOVED, this.handleMarkerRemovedEvent, this);

            // CAUTION: changing the type value may cause existing markers in local storage to be lost!
            // 
            // ICS Category
            this.icsTemplates = [
                {type: "ics-aerial-hazard", name: "Aerial Hazard ", symbol: "Aerial_Hazard24.png"},
                {type: "ics-aerial-ignition", name: "Aerial Ignition ", symbol: "Aerial_Ignition24.png"},
                {type: "ics-airport", name: "Airport ", symbol: "Airport_124.png"},
                {type: "ics-archaeological-site", name: "Archaeological Site ", symbol: "Archaeological_Site_124.png"},
                {type: "ics-branch-break", name: "Branch Break ", symbol: "Branch_Break24.png"},
                {type: "ics-camp", name: "Camp ", symbol: "Camp24.png"},
                {type: "ics-division-break", name: "Division Break ", symbol: "Division_Break24.png"},
                {type: "ics-drop-point", name: "Drop Point ", symbol: "Drop_Point24.png"},
                {type: "ics-fire-location", name: "Fire Location ", symbol: "Fire_Location24.png"},
                {type: "ics-fire-origin", name: "Fire Origin ", symbol: "Fire_Origin24.png"},
                {type: "ics-fire-station", name: "Fire Station ", symbol: "Fire_Station24.png"},
                {type: "ics-first-aid", name: "First Aid ", symbol: "First_Aid_124.png"},
                {type: "ics-heat-sorce", name: "Heat Source ", symbol: "Heat_Source24.png"},
                {type: "ics-helibase", name: "Helibase ", symbol: "Helibase24.png"},
                {type: "ics-helispot", name: "Helispot ", symbol: "Helispot24.png"},
                {type: "ics-historical-site", name: "Historical Site ", symbol: "Historical_Site24.png"},
                {type: "ics-incident-base", name: "Incident Base ", symbol: "Incident_Base24.png"},
                {type: "ics-incident-command-post", name: "Incident Command Post ", symbol: "Incident_Command_Post24.png"},
                {type: "ics-medi-vac", name: "MediVac Site ", symbol: "MediVac_Site24.png"},
                {type: "ics-mobile-weather-unit", name: "Mobile Weather Unit ", symbol: "Mobile_Weather_Unit24.png"},
                {type: "ics-repeater", name: "Repeater ", symbol: "Repeater24.png"},
                {type: "ics-retardant-pickup", name: "Retardant Pickup ", symbol: "Retardant_Pickup24.png"},
                {type: "ics-safety-zone", name: "Safety Zone ", symbol: "Safety_Zone_024.png"},
                {type: "ics-staging-area", name: "Staging Area ", symbol: "Staging_Area24.png"},
                {type: "ics-water-source", name: "Water Source ", symbol: "Water_Source24.png"}
            ];
            // Prepend the common image path to the symbols
            for (i = 0, max = this.icsTemplates.length; i < max; i++) {
                this.icsTemplates[i].symbol = Wmt.IMAGE_PATH + 'ics/' + this.icsTemplates[i].symbol;
                this.icsTemplates[i].category = "ics";
            }
            // Pusphin Category
            this.pushpinTemplates = [
                {type: "pushpin-black", name: "Black ", symbol: "castshadow-black.png"},
                {type: "pushpin-red", name: "Red ", symbol: "castshadow-red.png"},
                {type: "pushpin-green", name: "Green ", symbol: "castshadow-green.png"},
                {type: "pushpin-blue", name: "Blue ", symbol: "castshadow-blue.png"},
                {type: "pushpin-teal", name: "Teal ", symbol: "castshadow-teal.png"},
                {type: "pushpin-orange", name: "Orange ", symbol: "castshadow-orange.png"},
                {type: "pushpin-purple", name: "Purple ", symbol: "castshadow-purple.png"},
                {type: "pushpin-brown", name: "Brown ", symbol: "castshadow-brown.png"},
                {type: "pushpin-white", name: "White ", symbol: "castshadow-white.png"}
            ];
            // Prepend the common image path to the pushpins
            for (i = 0, max = this.pushpinTemplates.length; i < max; i++) {
                this.pushpinTemplates[i].symbol = Wmt.WORLD_WIND_PATH + 'images/pushpins/' + this.pushpinTemplates[i].symbol;
                this.pushpinTemplates[i].category = "pushpin";
            }

            // Get the RenderableLayer that we'll add the markers to.
            this.markerLayer = this.ctrl.findLayer(Wmt.MARKERS_LAYER_NAME);
            if (!this.markerLayer) {
                throw new Error(
                    Log.error("MarkerMenu", "constructor",
                        "Could not find a Layer named " + Wmt.MARKERS_LAYER_NAME));
            }

            this.icsPalette = new MarkerPalette('#icsMarkerPalette', this.icsTemplates);
            this.pushpinPalette = new MarkerPalette('#pushpinPalette', this.pushpinTemplates);

            // Add button event handlers
            $("#createMarker").on("click", function (event) {
                // Show the ICS Marker palette, and then call the createMarkerCallback function
                // with the selected palette item.
                self.icsPalette.showModalPalette(self.createMarkerCallback, self);
            });
            $("#createPushpin").on("click", function (event) {
                self.pushpinPalette.showModalPalette(self.createMarkerCallback, self);
            });
            // Attach a click handler to the markers in the marker list
            $('#markerList').find('li').on('click', function (event) {
                self.onMarkerItemClick($(this));
            });

            this.loadExistingMarkers();

            // Initially show the Create tab
            $('#markersListBody').collapse('show');
        };


        /**
         * Callback function that invokes the Controller.AddMarkerToGlobe function.
         * @param {Object} mkr Marker template with name and type properties.
         * @param {this} context
         */
        MarkerPanel.prototype.createMarkerCallback = function (mkr, context) {
            context.ctrl.addMarkerToGlobe(mkr);
        };


        /**
         * Creates renderables for existing markers found in the local storage.
         */
        MarkerPanel.prototype.loadExistingMarkers = function () {
            var markers = this.ctrl.model.markerManager.markers,
                i,
                max;

            for (i = 0, max = markers.length; i < max; i++) {
                this.handleMarkerAddedEvent(markers[i]);
            }
        };


        /**
         * Handles the EVENT_MARKER_ADDED event by creating a Placemark renderable
         * for the marker node.
         * @param {type} markerNode The marker model object.
         */
        MarkerPanel.prototype.handleMarkerAddedEvent = function (markerNode) {
            var template = this.getTemplate(markerNode.type);

            // Handle if the model is initialized before this panel is initialized
            if (!this.markerLayer) {
                return;
            }
            if (!template) {
                Log.error("MarkerMenu", "handleMarkerAddedEvent", "Symbol not found for marker type: " + markerNode.type);
                // Flag this marker... so we don't save it
                markerNode.invalid = true;
                return;
            }
            try {
                // Create the symbol on the globe
                this.createRenderable(markerNode, template);
                // Update our list of markers
                this.synchronizeMarkerList();
            }
            catch (e) {
                Log.error("MarkerMenu", "handleMarkerAddedEvent", e.toString());
            }
        };

        /**
         * Removes the given marker from the globe and the marker list.
         * @param {Object} markerNode
         */
        MarkerPanel.prototype.handleMarkerRemovedEvent = function (markerNode) {
            var i,
                max,
                placename;

            // Handle if the model is initialized before this panel is initialized
            if (!this.markerLayer) {
                return;
            }
            try {
                for (i = 0, max = this.markerLayer.renderables.length; i < max; i++) {
                    placename = this.markerLayer.renderables[i];

                    if (placename.displayName === markerNode.name) {
                        this.markerLayer.renderables.splice(i, 1);
                        break;
                    }
                }
                this.synchronizeMarkerList();
            }
            catch (e) {
                Log.error("MarkerMenu", "handleMarkerRemovedEvent", e.toString());
            }
        };

        /**
         * Handler for clicking any one of the marker buttons in the marker list.  
         * 
         * @param {$(li)} markerName List item element
         * @param {string} action "goto", "edit", or remove
         */
        MarkerPanel.prototype.onMarkerItemClick = function (markerName, action) {
            var markers = this.markerLayer.renderables,
                marker,
                position,
                i,
                len;

            for (i = 0, len = markers.length; i < len; i += 1) {
                marker = markers[i];
                if (marker.displayName === markerName) {
                    switch (action) {
                        case 'goto':
                            position = marker.position;
                            if (position) {
                                this.ctrl.lookAtLatLon(position.latitude, position.longitude);
                            } else {
                                Log.error("MarkerMenu", "onMarkerItemClick", "Marker position is undefined.");
                            }
                            break;
                        case 'edit':
                            Messenger.infoGrowl('Rename is not implemented yet.');
                            Log.error("MarkerMenu", "onMarkerItemClick", "Not implemented action: " + action);
                            break;
                        case 'remove':
                            this.ctrl.model.markerManager.removeMarker(marker.displayName);
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
         * Gets the template for creating a marker of a particular type.
         * @param {String} type Marker type, e.g., "pushpin-black".
         * @returns {Object} Marker template with name, type, category and symbol properties.
         */
        MarkerPanel.prototype.getTemplate = function (type) {
            var i,
                len;

            for (i = 0, len = this.icsTemplates.length; i < len; i += 1) {
                if (type === this.icsTemplates[i].type) {
                    return this.icsTemplates[i];
                }
            }
            for (i = 0, len = this.pushpinTemplates.length; i < len; i += 1) {
                if (type === this.pushpinTemplates[i].type) {
                    return this.pushpinTemplates[i];
                }
            }
            return null;
        };

        /**
         * Creates a WebWorldWind Placemark renderable for the given marker properties, and adds
         * the renderable to the globe.
         * 
         * @param {MarkerNode} node Marker model object
         * @param {Object} template Palette item
         */
        MarkerPanel.prototype.createRenderable = function (node, template) {
            var placemark,
                attr = new WorldWind.PlacemarkAttributes(null),
                hiliteAttr;

            // Set up the common placemark attributes.
            switch (template.category) {
                case 'ics':
                    attr.imageScale = 1.5;
                    attr.imageOffset = new WorldWind.Offset(
                        WorldWind.OFFSET_FRACTION, 0.5,
                        WorldWind.OFFSET_FRACTION, 0.0);
                    break;
                case 'pushpin':
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

            placemark = new WorldWind.Placemark(new WorldWind.Position(node.latitude, node.longitude, 0));
            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
            placemark.displayName = node.name;


//            marker.label = "Marker " + "\n"
//                + "Lat " + latitude.toPrecision(4).toString() + "\n"
//                + "Lon " + longitude.toPrecision(5).toString();

            // Create the placemark attributes for this placemark. 
            // Note that the attributes differ only by their image URL.
            attr = new WorldWind.PlacemarkAttributes(attr);
            attr.imageSource = template.symbol;
            placemark.attributes = attr;

            // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
            // the default highlight attributes so that all properties are identical except the image scale. You could
            // instead vary the color, image, or other property to control the highlight representation.
            hiliteAttr = new WorldWind.PlacemarkAttributes(attr);
            hiliteAttr.imageScale = attr.imageScale * 1.2;
            placemark.highlightAttributes = hiliteAttr;

            // Inject OUR own marker properties 
            placemark.markerCategory = template.category;
            placemark.markerType = template.type;

            // Add a reference to our model object and a movable capability to the renderable
            placemark.model = node;
            placemark.moveToLatLon = function(latitude, longitude) {
                this.position.latitude  = latitude;
                this.position.longitude = longitude;
                this.model.latitude = latitude;
                this.model.longitude = longitude;
            };

            // Render the marker on the globe
            this.markerLayer.addRenderable(placemark);
        };


        /**
         * Synchronize the marker list with the renderables in the Markers layer.
         */
        MarkerPanel.prototype.synchronizeMarkerList = function () {
            var self = this,
                markers = this.markerLayer.renderables,
                markerList = $("#markerList"), markerItem,
                marker,
                i,
                len;

            // This preliminary implemenation does a brute force "clear and repopulate" of the list
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
                self.onMarkerItemClick($(this).text(), "goto");
            });
            markerList.find('button.mkr-edit').on('click', function (event) {
                self.onMarkerItemClick($(this).attr('markerName'), "edit");
            });
            markerList.find('button.mkr-remove').on('click', function (event) {
                self.onMarkerItemClick($(this).attr('markerName'), "remove");
            });
        };

        return MarkerPanel;
    }
);