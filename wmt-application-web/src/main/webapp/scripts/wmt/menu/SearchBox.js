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


/*global define, $, WorldWind */


define([
    'wmt/controller/Controller',
    'wmt/globe/Globe',
    'wmt/util/Log',
    'wmt/util/Messenger',
    'wmt/Wmt',
    'worldwind'],
    function (
        controller,
        Globe,
        Log,
        Messenger,
        Wmt,
        ww) {
        "use strict";
        /**
         * Creates the SearchBox and Back/Forward (undo/redo) buttons (in the NavBar).
         * The SearchBox searches for an address, placename, airport or coordiantes, and then
         * goes centers the globe on the selected location.
         * 
         * @param {type} controller
         * @returns {SearchBox}
         */
        var SearchBox = function () {

            // The object that performs the lookup
            this.geocoder = new WorldWind.NominatimGeocoder();

            // The search history used by the undo/redo buttons
            this.undoHistory = [];
            this.redoHistory = [];

            // Maintains the current row selection in the search results
            this.searchSelection = null;

            // Create flat-earth Mercator map for previewing the search results.
            // The globe only has two layers, one for the map background and the other for the results
            // TODO: Suppress tilt and rotate controls
            this.globe = new Globe("canvasPreview",
                {
                    showBackground: false,
                    showReticule: true,
                    showViewControls: true,
                    includePanControls: false,
                    includeRotateControls: false,
                    includeTiltControls: false,
                    includeZoomControls: true
                },
                [// Choose any one of these imagery layers plus the renderable layer (to show hits):
                    //new WorldWind.BingAerialWithLabelsLayer(null),
                    //new WorldWind.BingRoadsLayer(null),
                    new WorldWind.OpenStreetMapImageLayer(null),
                    new WorldWind.RenderableLayer("Results")
                ]);
            this.globe.setProjection(Wmt.PROJECTION_NAME_MERCATOR);
            this.globe.wwd.addLayer(this.resultsLayer);
            this.resultsLayer = this.globe.findLayer("Results");
            // Initialize the panel that hosts the globe.
            $("#searchResults-globe").puipanel({
                toggleable: true,
                closable: false
            });

            // Wire up the SearchBox and Undo/Redo buttons
            var self = this;
            $("#searchText").on("keypress", function (e) {
                self.onSearchTextKeyPress($(this), e);
            });
            $("#searchUndo").on("click", function (e) {
                self.onSearchUndo(e);
            });
            $("#searchRedo").on("click", function (e) {
                self.onSearchRedo(e);
            });

            // Autoselect the text upon focus.
            $('#searchText').focus(function (e) {
                setTimeout(function () {
                    $('#searchText').select();
                }, 0);
            });
        };

        /**
         * Handles the Undo button events by restoring the previous position stored in history.
         * @param {type} event
         */
        SearchBox.prototype.onSearchUndo = function (event) {
            if (this.undoHistory.length > 0) {
                var prevLocation = this.undoHistory.pop(),
                    curTgt = controller.model.viewpoint.target;

                if (prevLocation) {
                    this.redoHistory.push(new WorldWind.Location(curTgt.latitude, curTgt.longitude));
                    controller.lookAtLatLon(prevLocation.latitude, prevLocation.longitude);
                }
            }
        };

        /**
         * Handles the Redo button event, by setting the position from the last undo.
         * @param {type} event
         * @returns {undefined}
         */
        SearchBox.prototype.onSearchRedo = function (event) {
            if (this.redoHistory.length > 0) {
                var location = this.redoHistory.pop();
                if (location) {
                    this.undoHistory.push(location);
                    controller.lookAtLatLon(location.latitude, location.longitude);
                }
            }
        };

        /**
         * Handles the keystrokes in the SearchBox and responds to the enter key to invoke the search
         * TODO: could perform an autocomplete.
         * @param {type} searchInput
         * @param {type} event
         * @returns {undefined}
         */
        SearchBox.prototype.onSearchTextKeyPress = function (searchInput, event) {
            if (event.keyCode === 13) {
                searchInput.blur();
                this.performSearch($("#searchText")[0].value);
            }
        };


        /**
         * Performs the search for the user's search criterial
         * @param {type} queryString
         * @returns {undefined}
         */
        SearchBox.prototype.performSearch = function (queryString) {
            var self = this,
                tokens,
                latitude,
                longitude;

            if (queryString) {

                if (queryString.match(WorldWind.WWUtil.latLonRegex)) {
                    tokens = queryString.split(",");
                    latitude = parseFloat(tokens[0]);
                    longitude = parseFloat(tokens[1]);
                    self.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
                } else {
                    this.geocoder.lookup(queryString, function (geocoder, results) {
                        if (results.length > 0) {
                            self.showResultsDialog(results);
                        }
                        else {
                            Messenger.warningGrowl('There were no hits for "' + queryString + '".', "Check your spelling.");
                        }
                    });
                }
            }
        };

        /**
         * Shows the SearchResults modal dialog containing the search results and the embedded globe.
         * @param {Array} results description
         */
        SearchBox.prototype.showResultsDialog = function (results) {
            var self = this;

            // Reset the selection
            this.searchSelection = null;
            // Populate the table
            this.loadResultsTable(results);
            // Populate the globe
            this.loadResultsOnGlobe(results);

            // Build the dialog
            $('#searchResults-dlg').puidialog({
                width: '80%',
                height: '80%',
                //location: '55,50',
                showEffect: 'fade',
                hideEffect: 'fade',
                minimizable: false,
                maximizable: false,
                closable: true,
                closeOnEscape: true,
                modal: true,
                //appendTo: "div#wmtweb",
                responsive: true,
                buttons: [{
                        text: Wmt.BUTTON_TEXT_GOTO,
                        icon: 'fa-globe',
                        click: function () {
                            // Ok to close?
                            if (self.searchSelection) {
                                $('#searchResults-dlg').puidialog('hide');
                                self.gotoSelection();
                            }
                        }
                    },
                    {
                        text: Wmt.BUTTON_TEXT_CANCEL,
                        icon: 'fa-close',
                        click: function () {
                            // Unconditionally close
                            $('#searchResults-dlg').puidialog('hide');
                        }
                    }]
            });
            this.enableGoToButton(false);
            $('#searchResults-dlg').puidialog('show');
        };

        /**
         * Processes the results from the NominatimGeocoder.
         * @param {Object[]} results Result array from the NominatorGeocoder.
         */
        SearchBox.prototype.loadResultsOnGlobe = function (results) {
            var item,
                placemark,
                placemarkAttr = new WorldWind.PlacemarkAttributes(null),
                i, max;

            // Sync the initial position to the primary globe.
            // Use the default range for the projection, then let use set the range
            // with the zoom keys.  The user's range will persist between searches.
            this.globe.lookAt(
                controller.model.viewpoint.target.latitude,
                controller.model.viewpoint.target.longitude
                );

            // Clear previous results
            this.resultsLayer.removeAllRenderables();

            // Initialize common attributes
            placemarkAttr.imageScale = 10; // this is # of pixels when no image is provided
            placemarkAttr.imageColor = WorldWind.Color.RED;

            // Create a simple placemark for each result
            for (i = 0, max = results.length; i < max; i++) {
                item = results[i];
                placemark = new WorldWind.Placemark(
                    new WorldWind.Position(
                        parseFloat(item.lat),
                        parseFloat(item.lon), 100));
                placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                placemark.displayName = item.display_name;
                placemark.attributes = placemarkAttr;

                //placemark.label = item.display_name;
                this.resultsLayer.addRenderable(placemark);
            }

        };

        /**
         * Processes the results from the NominatimGeocoder.
         * @param {Object[]} resultArray Result array from the NominatorGeocoder.
         */
        SearchBox.prototype.loadResultsTable = function (resultArray) {
            var self = this;
            $('#searchResults-tbl').puidatatable({
                paginator: {
                    rows: 5
                },
                columns: [
                    {
                        field: 'display_name',
                        headerText: 'Name',
                        headerStyle: 'width:80%',
                        sortable: true
                    },
                    {
                        field: 'type',
                        headerText: 'Type',
                        sortable: true
                    }
                ],
                datasource: resultArray,
                selectionMode: 'single',
                rowSelect: function (event, resultItem) {
                    // Save the selected row
                    self.searchSelection = resultItem;
                    // Enable OK button
                    self.enableGoToButton(true);
                    // Preview the selection on the globe
                    self.previewSelection();
                },
                rowUnselect: function (event, result) {
                    // Disable OK button
                    self.enableGoToButton(false);
                }
            });
        };

        /**
         * Enables or disables the Go To button.
         * @param {Boolean} enabled
         */
        SearchBox.prototype.enableGoToButton = function (enabled) {
            var dlg = $('#searchResults-dlg'),
                btn = dlg.find('span.pui-button-text:contains("' + Wmt.BUTTON_TEXT_GOTO + '")').parent();
            $(btn).puibutton(enabled ? 'enable' : 'disable');
        };

        /**
         * Previews the selected item by centering the globe on the item's location.
         */
        SearchBox.prototype.previewSelection = function () {
            var latitude = parseFloat(this.searchSelection.lat),
                longitude = parseFloat(this.searchSelection.lon);

            this.globe.lookAt(latitude, longitude);
        };


        /**
         * Inokes the "go to" animation on the primary globe.
         */
        SearchBox.prototype.gotoSelection = function () {
            var latitude = parseFloat(this.searchSelection.lat),
                longitude = parseFloat(this.searchSelection.lon),
                target = controller.model.viewpoint.target;

            Messenger.infoGrowl(this.searchSelection.display_name, "Going to:");

            // Remember our current target in the history
            if (target) {
                this.undoHistory.push(new WorldWind.Location(target.latitude, target.longitude));
            }
            this.redoHistory = [];
            this.redoCandidate = new WorldWind.Location(latitude, longitude);
            controller.lookAtLatLon(latitude, longitude);
        };

        return SearchBox;
    }
);
