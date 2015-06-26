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
    '../util/Log',
    '../util/Messenger',
    '../../nasa/WorldWind'],
    function (
        Log,
        Messenger,
        ww) {
        "use strict";
        var SearchBox = function (controller) {
            this.ctrl = controller;

            this.geocoder = new WorldWind.NominatimGeocoder();

            this.undoHistory = [];
            this.redoHistory = [];

            this.searchSelection = null;

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


        SearchBox.prototype.onSearchUndo = function (event) {
            if (this.undoHistory.length > 0) {
                var prevLocation = this.undoHistory.pop(),
                    curTgt = this.ctrl.model.viewpoint.target;

                if (prevLocation) {
                    this.redoHistory.push(new WorldWind.Location(curTgt.latitude, curTgt.longitude));
                    this.ctrl.lookAtLatLon(prevLocation.latitude, prevLocation.longitude);
                }
            }
        };

        SearchBox.prototype.onSearchRedo = function (event) {
            if (this.redoHistory.length > 0) {
                var location = this.redoHistory.pop();
                if (location) {
                    this.undoHistory.push(location);
                    this.ctrl.lookAtLatLon(location.latitude, location.longitude);
                }
            }
        };


        SearchBox.prototype.onSearchTextKeyPress = function (searchInput, event) {
            if (event.keyCode === 13) {
                searchInput.blur();
                this.performSearch($("#searchText")[0].value);
            }
        };


        SearchBox.prototype.performSearch = function (queryString) {
            var self = this,
                tokens,
                latitude,
                longitude,
                currTarget = this.ctrl.model.viewpoint.target;

            if (queryString) {

                if (queryString.match(WorldWind.WWUtil.latLonRegex)) {
                    tokens = queryString.split(",");
                    latitude = parseFloat(tokens[0]);
                    longitude = parseFloat(tokens[1]);
                    self.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
                } else {
                    this.geocoder.lookup(queryString, function (geocoder, results) {
                        if (results.length > 0) {
//                            self.lastSearch = {
//                                name: result[0].display_name,
//                                latitude: parseFloat(result[0].lat),
//                                longitude: parseFloat(result[0].lon)
//                            };
                            self.showSearchResultsDialog(results);

//                            latitude = parseFloat(results[0].lat);
//                            longitude = parseFloat(results[0].lon);
//
//                            WorldWind.Logger.log(
//                                WorldWind.Logger.LEVEL_INFO, queryString + ": " + latitude + ", " + longitude);
//
//                            // Remember our current target in the history
//                            if (currTarget) {
//                                self.undoHistory.push(new WorldWind.Location(currTarget.latitude, currTarget.longitude));
//                            }
//                            self.redoHistory = [];
//                            self.redoCandidate = new WorldWind.Location(latitude, longitude);
//                            self.ctrl.lookAtLatLon(latitude, longitude);
                        }
                    });
                }
            }
        };

        SearchBox.prototype.gotoSelection = function () {
            var latitude = parseFloat(this.searchSelection.lat),
                longitude = parseFloat(this.searchSelection.lon),
                target = this.ctrl.model.viewpoint.target;

            Messenger.infoGrowl (this.searchSelection.display_name, "Going to:" );
            
            // Remember our current target in the history
            if (target) {
                this.undoHistory.push(new WorldWind.Location(target.latitude, target.longitude));
            }
            this.redoHistory = [];
            this.redoCandidate = new WorldWind.Location(latitude, longitude);
            this.ctrl.lookAtLatLon(latitude, longitude);

        };

        /**
         * Shows the DateTime modal dialog.
         * @param {Array} results description
         */
        SearchBox.prototype.showSearchResultsDialog = function (results) {
            var self = this;

            // Reset the selection
            this.searchSelection = null;
            // Populate the table
            this.loadNominatimGeocoderResult(results);

            // Build the dialog
            $('#searchResults-dlg').puidialog({
                //width: '600',
                //height: '400',
                showEffect: 'fade',
                hideEffect: 'fade',
                minimizable: false,
                maximizable: true,
                closable: true,
                closeOnEscape: true,
                modal: true,
                responsive: true,
                buttons: [{
                        text: 'Go To',
                        icon: 'ui-icon-check',
                        disabled: 'true',
                        click: function () {
                            // Ok to close?
                            if (self.searchSelection) {
                                $('#searchResults-dlg').puidialog('hide');
                                self.gotoSelection();
                            }
                        }
                    },
                    {
                        text: 'Cancel',
                        icon: 'ui-icon-close',
                        click: function () {
                            // Unconditionally close
                            $('#searchResults-dlg').puidialog('hide');
                        }
                    }]
            });
            $('#searchResults-dlg').puidialog('show');
        };

        SearchBox.prototype.loadNominatimGeocoderResult = function (resultArray) {
            var self = this;
            $('#searchResults-tbl').puidatatable({
                caption: 'Nominatim',
//                paginator: {
//                    rows: 5
//                },
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
                    },
                ],
                datasource: resultArray,
                selectionMode: 'single',
                rowSelect: function (event, resultItem) {
//                    // Enable OK button
//                    var dlg = $('#fuelModel-dlg'),
//                        btn = dlg.find('button.pui-button:contains("OK")');
//
//                    btn.attr('disabled', 'false');
                    // Save the selected row
                    self.searchSelection = resultItem;
                },
                rowUnselect: function (event, result) {
//                    // Disable OK button
//                    var btn = $('#fuelModel-dlg').find('button.pui-button:contains("OK")');
//                    btn.attr('disabled', 'true');
                }
            });

        };

        return SearchBox;
    }
);
