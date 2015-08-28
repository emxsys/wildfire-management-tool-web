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

/**
 * The MarkerViewer displays a marker's properties.
 * @author Bruce Schubert
 */
define([
    'require',
    'wmt/util/Formatter',
    'wmt/Wmt',
    'worldwind'],
    function (
        require,
        formatter,
        wmt,
        ww) {
        "use strict";
        /**
         * @constructor
         * @param {Marker} marker The marker to be viewed/edited.
         * @returns {MarkerViewer}
         */
        var MarkerViewer = {
            show: function (marker) {

                // Load the controls
                $('#marker-name').val(marker.name);
                $('#marker-placename').text('Place: ' + marker.toponym);
                $('#marker-latitude').text('Latitude: ' + formatter.formatDecimalDegreesLat(marker.latitude, 5));
                $('#marker-longitude').text('Longitude: ' + formatter.formatDecimalDegreesLon(marker.longitude, 5));
                $('#marker-movable').puitogglebutton(marker.isMovable ? 'uncheck' : 'check');

                // Save button callback
                this.saveAction = function () {
                    marker.name = $('#marker-name').val();
                    marker.isMovable = !($('#marker-movable').puitogglebutton('isChecked'));
                };

                // Delete button callback
                this.deleteAction = function () {
                    var model = require("wmt/controller/Controller").model;
                    model.markerManager.removeMarker(marker);
                };

                // Show the modal dialog
                $('#marker-viewer').puidialog('show');
            },
            /**
             * Intializes the PrimeUI dialog components. Called once, at startup.
             */
            initialize: function () {
                var self = this,
                    $viewer = $('#marker-viewer');


                // Toggle buttons
                $('#marker-movable').puitogglebutton({
                    onLabel: 'Locked',
                    offLabel: 'Movable',
                    onIcon: 'fa-check-square',
                    offIcon: 'fa-square'
                });

                // Tabs
                $('#marker-tabs').puitabview();

                // The dialog
                $viewer.puidialog({
                    location: 'top',
                    width: '360px',
                    height: 'auto',
                    showEffect: 'fade',
                    hideEffect: 'fade',
                    minimizable: false,
                    maximizable: false,
                    resizable: true,
                    responsive: true,
                    modal: true,
                    buttons: [{
                            text: wmt.BUTTON_TEXT_SAVE,
                            icon: 'fa-save',
                            click: function () {
                                self.saveAction();
                                $viewer.puidialog('hide');
                            }
                        },
                        {
                            text: wmt.BUTTON_TEXT_DELETE,
                            icon: ' fa-minus-circle',
                            click: function () {
                                self.deleteAction();
                                $viewer.puidialog('hide');
                            }
                        },
                        {
                            text: wmt.BUTTON_TEXT_CANCEL,
                            icon: 'fa-close',
                            click: function () {
                                $viewer.puidialog('hide');
                            }
                        }]
                });

                // Enter key handler
                $viewer.off('submit').on('submit', function () {
                    self.saveAction();
                    $viewer.puidialog('hide');
                    return false;
                });

            }
        };
        return MarkerViewer;
    }
);
