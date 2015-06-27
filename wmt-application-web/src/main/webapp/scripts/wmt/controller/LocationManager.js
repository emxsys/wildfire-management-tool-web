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
 * The LocationDialog obtains a set of coordinates from the user.
 * @module LocationDialog
 * @author Bruce Schubert
 * @author Theodore Walton
 */
define([
    './Controller',
    'worldwind'],
    function (
        Controller,
        ww) {
        "use strict";
        /**
         * @constructor
         * @returns {LocationManager}
         */
        var LocationManager = function (controller) {
            var self = this;

            this.ctrl = controller;
            this.position = new WorldWind.Position();
            this.initialize();
            $("#location").on("click", function (event) {
                self.showLocationDialog(event);
            });
        };
        /**
         * Shows the Location modal dialog.
         */
        LocationManager.prototype.showLocationDialog = function () {
            $('#location-dlg').puidialog('show');
        };
        /**
         * Generates, then shows the Location modal dialog.
         * @param {type} fail Callback function accepting an error.
         */
        LocationManager.prototype.initialize = function () {
            var self = this;

            $('#location-dlg').puidialog({
                showEffect: 'fade',
                hideEffect: 'fade',
                minimizable: true,
                maximizable: true,
                modal: true,
                buttons: [{
                        text: 'Yes',
                        icon: 'ui-icon-check',
                        click: function () {

                            var lat = $('#latitude').val(),
                                lon = $('#longitude').val();

                            console.log("Location Dialog values: " + lat + ", " + lon);

                            if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
                                return; // Don't close
                            }
                            // Ok to close
                            $('#location-dlg').puidialog('hide');

                            // Ask the controller to go to the new location.
                            self.ctrl.lookAtLatLon(Number(lat), Number(lon));
                        }
                    },
                    {
                        text: 'No',
                        icon: 'ui-icon-close',
                        click: function () {
                            $('#location-dlg').puidialog('hide');
                        }
                    }]
            });
        };
        return LocationManager;
    }
);
