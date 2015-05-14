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
 * The Locator module is responsble for locating the host device's geographic location
 * and centering the globe's crosshairs on this location.
 * 
 * @author Bruce Schubert
 */
define([
    './LocationDialog',
    '../util/Messenger',
    './Navigator',
    '../../webworldwind/geom/Position'],
    function (
        LocationDialog,
        Messenger,
        Navigator,
        Position) {
        "use strict";
        /**
         * @constructor
         * @param {Navigator} Navigator object that will be updated by the Locator.
         * @returns {Locator}
         */
        var Locator = function (navigator) {
            if (!navigator) {
                throw new ArgumentError(
                    WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "Locator", "constructor", "missingNavigator"));
            }
            /**
             * The locate...() methods update the globe via the navigator.
             */
            this.navigator = navigator;
        };
        /**
         * Center's the globe on the user's current position using the GeoLocation API.
         * @description Centers the globe on the user's current position.
         * @public
         */
        Locator.prototype.locateCurrentPosition = function () {
            // Prerequisite: GeoLocation API
            if (!window.navigator.geolocation) {
                Messenger.growl("warn", "Locate Not Supported",
                    "Sorry, your system doesn't support GeoLocation.", 5000);
                return;
            }

            Messenger.growl("info", "Locating...", "Setting your location.", 1500);

            // Use the GeoLocation API to get the current position.
            var self = this;
            window.navigator.geolocation.getCurrentPosition(
                function (position) {
                    /**
                     * onSuccess callback centers the crosshairs on the given position
                     * @param {GeoLocation.Position} position Coordinates and accuracy information.
                     */
                    self.navigator.lookAtLatLon(
                        position.coords.latitude,
                        position.coords.longitude);
                },
                function (error) {
                    /**
                     * onFail callback notifies the user of the error
                     * @param {GeoLocation.PositionError} error Error message and code.
                     */
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
                            reason = "An unknown error occurred in Geolocation.";
                            break;
                        default:
                            reason = "An unhandled error occurred in Geolocation.";
                    }
                    message = "<h3>Sorry. " + reason + "</h3>"
                        + "<p>Details: " + error.message + "</p>";
                    Messenger.notify(message);

                });
        };
        /**
         * Initiates a modal dialog with the user to go to a set of coordinates.
         * @description Displays a dialog that allows the user to navigate 
         * to a set of coordinates.
         * @public
         */
        Locator.prototype.locateCoordinates = function () {
            var dlg = new LocationDialog(),
                self = this;
            dlg.show(
                function (position) {
                    /**
                     * onSuccess callback centers the crosshairs on the given position.
                     * @param {WorldWind.Position} position Coordinates.
                     */
                    self.navigator.lookAtLatLon(position.latitude, position.longitude);
                },
                function (error) {
                    /**
                     * onFailuer callback notifies the user of error.
                     * @param {undefined} error
                     */
                    // onFailure callback: Inform the user.
                    Messenger.growl("warn", "Error", "Something went wrong in locateCoordinates.", 4000);
                });
        };


        return Locator;
    }
);
