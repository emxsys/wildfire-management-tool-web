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

/*global define, $, WorldWind*/

/*
 * The MarkerView provides a view of the marker model objects as Renderables on the globe 
 * and as items in the Marker List.
 */

define([
    'wmt/controller/Controller',
    'wmt/view/symbols/IcsMarker',
    'wmt/util/Log',
    'wmt/model/MarkerNode',
    'wmt/menu/MarkerPalette',
    'wmt/util/Messenger',
    'wmt/view/symbols/Pushpin',
    'wmt/Wmt',
    'worldwind'],
    function (
        controller,
        IcsMarker,
        log,
        MarkerNode,
        MarkerPalette,
        messenger,
        Pushpin,
        wmt,
        ww) {
        "use strict";
        /**
         * Constructs a MarkerView object.
         * @constructor
         * @param {type} controller
         * @returns {MarkerView}
         */
        var MarkerView = function () {
            var self = this;

            this.manager = controller.model.markerManager;
            this.manager.on(wmt.EVENT_MARKER_ADDED, this.handleMarkerAddedEvent, this);
            this.manager.on(wmt.EVENT_MARKER_REMOVED, this.handleMarkerRemovedEvent, this);

            // Get the RenderableLayer that we'll add the markers to.
            this.markerLayer = controller.globe.findLayer(wmt.MARKERS_LAYER_NAME);
            if (!this.markerLayer) {
                throw new Error(
                    log.error("MarkerView", "constructor",
                        "Could not find a Layer named " + wmt.MARKERS_LAYER_NAME));
            }

            // Create Click/Drop (DnD) palettes 
            this.markerPalette = new MarkerPalette('#icsMarkerPalette', IcsMarker.templates);
            this.pushpinPalette = new MarkerPalette('#pushpinPalette', Pushpin.templates);
            //this.mobileMarkerPalette = new MarkerPalette('#mobileIcsMarkerPalette', IcsMarker.templates);
            //this.mobilePushpinPalette = new MarkerPalette('#mobilePushpinPalette', Pushpin.templates);
            
            // Add button event handlers
            $("#createMarker").on("click", function (event) {
                // Show the ICS Marker palette, and then call the createMarkerCallback function
                // with the selected palette item.
                self.markerPalette.showModalPalette(self.createMarkerCallback, self);
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
         * @param {Object} mkrTmpl Marker template with name and type properties.
         * @param {this} context
         */
        MarkerView.prototype.createMarkerCallback = function (mkrTmpl, context) {
            // TODO: Palette should return template
            controller.dropMarkerOnGlobe(new MarkerNode(mkrTmpl.name, mkrTmpl.type));
        };


        /**
         * Creates renderables for existing markers found in the local storage.
         */
        MarkerView.prototype.loadExistingMarkers = function () {
            var markers = controller.model.markerManager.markers,
                i, max;

            for (i = 0, max = markers.length; i < max; i++) {
                this.handleMarkerAddedEvent(markers[i]);
            }
        };


        /**
         * Handles the EVENT_MARKER_ADDED event by creating a Placemark renderable
         * for the marker node.
         * @param {type} markerNode The marker model object.
         */
        MarkerView.prototype.handleMarkerAddedEvent = function (markerNode) {
            var template = this.getTemplate(markerNode.type);

            // Handle if the model is initialized before this panel is initialized
            if (!this.markerLayer) {
                return;
            }
            if (!template) {
                log.error("MarkerView", "handleMarkerAddedEvent", "Symbol not found for marker type: " + markerNode.type);
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
                log.error("MarkerView", "handleMarkerAddedEvent", e.toString());
            }
        };

        /**
         * Removes the given marker from the globe and the marker list.
         * @param {Object} markerNode
         */
        MarkerView.prototype.handleMarkerRemovedEvent = function (markerNode) {
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
                log.error("MarkerView", "handleMarkerRemovedEvent", e.toString());
            }
        };

        /**
         * Handler for clicking any one of the marker buttons in the marker list.  
         * 
         * @param {$(li)} markerName List item element
         * @param {string} action "goto", "edit", or remove
         */
        MarkerView.prototype.onMarkerItemClick = function (markerName, action) {
            var placemarks = this.markerLayer.renderables,
                placemark,
                position,
                i,
                len;

            for (i = 0, len = placemarks.length; i < len; i += 1) {
                placemark = placemarks[i];
                if (placemark.displayName === markerName) {
                    switch (action) {
                        case 'goto':
                            position = placemark.position;
                            if (position) {
                                controller.lookAtLatLon(position.latitude, position.longitude);
                            } else {
                                log.error("MarkerView", "onMarkerItemClick", "Marker position is undefined.");
                            }
                            break;
                        case 'edit':
                            messenger.infoGrowl('Rename is not implemented yet.');
                            log.error("MarkerView", "onMarkerItemClick", "Not implemented action: " + action);
                            break;
                        case 'remove':
                            this.manager.removeMarker(placemark.displayName);
                            break;
                        default:
                            log.error("MarkerView", "onMarkerItemClick", "Unhandled action: " + action);
                    }
                    return;
                }
            }
            log.error("MarkerView", "onMarkerItemClick", "Could not find selected marker in Markers layer.");
        };


        /**
         * Gets the template for creating a marker of a particular type.
         * @param {String} type Marker type, e.g., "pushpin-black".
         * @returns {Object} Marker template with name, type, category and symbol properties.
         */
        MarkerView.prototype.getTemplate = function (type) {
            var template;
            try {
                template = IcsMarker.findTemplate(type);   // throws if not found.
                template.category = 'ics';
            } catch (e) {
                try {
                    template = Pushpin.findTemplate(type);  // throws if not found.  
                    template.category = 'pushpin';
                } catch (e) {
                    return null;
                }
            }
            return template;
        };

        /**
         * Creates a WebWorldWind Placemark renderable for the given marker properties, and adds
         * the renderable to the globe.
         * 
         * @param {MarkerNode} node Marker model object
         * @param {Object} template Palette item
         */
        MarkerView.prototype.createRenderable = function (node, template) {
            var placemark;

            // Set up the common placemark attributes.
            switch (template.category) {
                case 'ics':
                    placemark = new IcsMarker(node.latitude, node.longitude, template.type);
                    break;
                case 'pushpin':
                    placemark = new Pushpin(node.latitude, node.longitude, template.type);
                    break;
            }
            // TODO: Initialize pushpins and markers from marker node
            placemark.displayName = node.name;

            // Inject OUR own marker properties 
            placemark.markerCategory = template.category;
            placemark.markerType = template.type;

            // Establish the Publisher/Subscriber relationship between this symbol and its node
            placemark.pickDelegate = node;
            placemark.handleObjectMovedEvent = function (node) {
                placemark.position.latitude = node.latitude;
                placemark.position.longitude = node.longitude;
            };
            node.on(wmt.EVENT_OBJECT_MOVED, placemark.handleObjectMovedEvent, placemark);
            

            // Render the marker on the globe
            this.markerLayer.addRenderable(placemark);
        };


        /**
         * Synchronize the marker list with the marker nodes in the model.
         */
        MarkerView.prototype.synchronizeMarkerList = function () {
            var self = this,
                markers = this.manager.markers,
                markerList = $("#markerList"),
                markerItem,
                markerNode,
                i, len;

            // This preliminary implemenation does a brute force "clear and repopulate" of the list
            markerList.children().remove();

            for (i = 0, len = markers.length; i < len; i += 1) {
                markerNode = markers[i];
                //markerItem = $('<li class="list-group-item btn btn-block">' + marker.displayName + '</li>');
                markerItem =
                    '<div class="btn-group btn-block btn-group-sm">' +
                    ' <button type="button" class="col-sm-8 btn btn-default mkr-goto">' + markerNode.name + '</button>' +
                    ' <button type="button" class="col-sm-2 btn btn-default mkr-edit glyphicon glyphicon-pencil" style="top: 0" markerName="' + markerNode.name + '"></button>' +
                    ' <button type="button" class="col-sm-2 btn btn-default mkr-remove glyphicon glyphicon-trash" style="top: 0" markerName="' + markerNode.name + '"></button>' +
                    '</div>';
                markerList.append(markerItem);
            }
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

        return MarkerView;
    }
);