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

/**
 *  The Locator module is responsble for locating the host device's geographic location
 *  and centering the globe's crosshairs on this location.
 */
define([
    '../util/Messenger'],
    function (
        Messenger) {
        "use strict";
        /**
         * @constructor
         * @param {Navigator} Location navigator object.
         * @returns {Locator}
         */
        var Locator = function (navigator) {
            if (!navigator) {
                throw new ArgumentError(
                    WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "Locator", "constructor", "missingNavigator"));
            }

            /**
             * A WMT Navigator object (as opposed to GeoLocation navigator).
             */
            this.navigator = navigator;

            /**
             * Center's the globe on the user's current position using the GeoLocation API.
             * @public
             * @description Centers the globe on the user's current position.
             */
            Locator.prototype.locateCurrentPosition = function () {
                if (!window.navigator.geolocation) {
                    Messenger.growl("warn", "Locate Not Supported",
                        "Sorry, your system doesn't support GeoLocation.");
                    return;
                }
                Messenger.growl("info", "Locating...", "Checking your location.", 1500);
                var self = this;
                window.navigator.geolocation.getCurrentPosition(
                    function (position) {
                        self.onSuccess(position);
                    },
                    function (positionError) {
                        self.onFailure(positionError);
                    });
            };
            /**
             * Initiates a modal dialog with the user to go to a set of coordinates.
             * @public
             */
            Locator.prototype.locateCoordinates = function () {
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
                                $('#location-dlg').puidialog('hide');
                            }
                        },
                        {
                            text: 'No',
                            icon: 'ui-icon-close',
                            click: function () {
                                $('#location-dlg').puidialog('hide');
                            }
                        }
                    ]
                });

                $('#location-dlg').puidialog('show');

            };
            
            
            /**
             * @private
             * @param {GeoPosition Position} position
             */
            Locator.prototype.onSuccess = function (position) {
                //console.log("GeoLocation: " + position.coords.latitude + ", " + position.coords.longitude);
                this.navigator.lookAtGeoPosition(position);
            };
            /**
             * @private
             * @param {PositionError} error
             */
            Locator.prototype.onFailure = function (error) {
                var reason, message;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        reason = "User denied the request for Geolocation.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        reason = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        reason = "The request to get user location timed out.";
                        break;
                    case error.UNKNOWN_ERROR:
                        reason = "An unknown error occurred.";
                        break;
                    default:
                        reason = "An unhandled error occurred.";
                }
                message = "<p><b>Sorry, we're unabled to get your position.</b></p>"
                    + "<p>Reason: " + reason + "</p>"
                    + "<p>Details: " + error.message + "</p>";
                Messenger.notify(message);
            };
        };
        return Locator;
    }
);
