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
 * The WeatherManager manages a set of weather values from the user.
 * @module WeatherManager
 * @param {Object} WorldWind 
 
 *  * @author Bruce Schubert
 */
define(['./Controller'],
    function (Controller) {
        "use strict";
        /**
         * @constructor
         * @returns {WeatherManager}
         */
        var WeatherManager = function (controller) {
            var self = this;

            this.ctrl = controller;
            this.position = new WorldWind.Position();
            this.initialize();

            // Invoke the Weather Editor dialog when the 
            // Weather button on the main menu is clicked
            $("#weather").on("click", function (event) {
                self.showWeatherEdtiorDialog(event);
            });
        };
        /**
         * Shows the Weather modal dialog.
         */
        WeatherManager.prototype.showWeatherEdtiorDialog = function () {
            $('#weatherEditor-dlg').puidialog('show');
        };
        /**
         * Generates, then shows the Weather modal dialog.
         * @param {type} fail Callback function accepting an error.
         */
        WeatherManager.prototype.initialize = function () {
            var self = this;
            $('#airTemperature').puispinner({
                min: 32,
                max: 140
            });
            $('#relativeHumidity').puispinner({
                min: 0,
                max: 100
            });
            $('#windSpeed').puispinner({
                min: 0,
                max: 50
            });
            $('#windDirection').puispinner({
                min: 0,
                max: 359
            });
            $('#cloudCover').puispinner({
                min: 0,
                max: 100
            });

            $('#weatherEditor-dlg').puidialog({
                showEffect: 'fade',
                hideEffect: 'fade',
                minimizable: true,
                maximizable: true,
                modal: true,
                buttons: [{
                        text: 'OK',
                        icon: 'ui-icon-check',
                        click: function () {

                            var airTemp = $('#airTemperature').val(),
                                relHum = $('#relativeHumidity').val();

                            console.log("Weather Dialog values: " + airTemp + ", " + relHum);

                            if (!airTemp || !relHum || isNaN(airTemp) || isNaN(relHum)) {
                                return; // Don't close
                            }
                            // Ok to close
                            $('#weatherEditor-dlg').puidialog('hide');

                            // Ask the controller to go to the update the weather.
                            self.ctrl.changeWeather(Number(airTemp), Number(relHum));
                        }
                    },
                    {
                        text: 'Cancel',
                        icon: 'ui-icon-close',
                        click: function () {
                            $('#weatherEditor-dlg').puidialog('hide');
                        }
                    }]
            });
        };
        return WeatherManager;
    }
);
