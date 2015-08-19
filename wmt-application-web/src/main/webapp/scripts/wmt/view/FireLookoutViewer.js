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
 * The FireLookoutDialog displays a FireLookout's data.
 
 *  * @author Bruce Schubert
 */
define([
    'require',
    'wmt/model/FuelModelCatalog',
    'wmt/model/FuelMoistureCatalog',
    'wmt/util/Formatter',
    'wmt/util/WmtUtil',
    'wmt/Wmt',
    'worldwind'],
    function (
        require,
        fuelModelCatalog,
        fuelMoistureCatalog,
        formatter,
        util,
        wmt,
        ww) {
        "use strict";
        /**
         * @constructor
         * @param {FireLookout} lookout The lookout to be displayed
         * @returns {FireLookoutViewer}
         */
        var FireLookoutViewer = {
            /**
             * Shows the FireLookout viewer/editor.
             * @param {FireLookout} lookout The lookout to be viewed or edited.
             */
            show: function (lookout) {
                var forecasts = lookout.getForecasts();

                // Draw the CPS force vectors
                this.drawCpsForces(lookout);

                // Load the controls
                $('#lookout-name').val(lookout.name);
                $('#lookout-placename').text('Place: ' + lookout.toponym);
                $('#lookout-latitude').text('Latitude: ' + formatter.formatDecimalDegreesLat(lookout.latitude, 5));
                $('#lookout-longitude').text('Longitude: ' + formatter.formatDecimalDegreesLon(lookout.longitude, 5));
                $('#lookout-movable').puitogglebutton(lookout.isMovable ? 'uncheck' : 'check');
                $('#lookout-fuelmodel-auto').puicheckbox(lookout.fuelModelManualSelect ? 'uncheck' : 'check');
                $('#lookout-fuelmodel-drpdwn').puidropdown('selectValue', lookout.fuelModelNo);
                $('#lookout-fuelmoisture-drpdwn').puidropdown('selectValue', lookout.moistureScenarioName);
                $('#lookout-weather-tbl').puidatatable('option', 'datasource', forecasts);
                $('#lookout-weather-tbl').puidatatable('option', 'paginator', {totalRecords: forecasts.length, rows: 10});

                // Save button callback
                this.saveAction = function () {
                    var modelNo = $('#lookout-fuelmodel-drpdwn').puidropdown('getSelectedValue'),
                        scenarioName = $('#lookout-fuelmoisture-drpdwn').puidropdown('getSelectedValue');
                    lookout.name = $('#lookout-name').val();
                    lookout.isMovable = !($('#lookout-movable').puitogglebutton('isChecked'));
                    lookout.fuelModelManualSelect = !($('#lookout-fuelmodel-auto').puicheckbox('isChecked'));
                    lookout.fuelModelNo = modelNo;
                    lookout.moistureScenarioName = scenarioName;
                    // Update the views
                    lookout.refresh();
                };

                // Delete button callback
                this.deleteAction = function () {
                    var model = require("wmt/controller/Controller").model;
                    model.fireLookoutManager.removeLookout(lookout);
                };

                // Show the modal dialog
                $('#lookout-dlg').puidialog('show');
            },
            /**
             * Intializes the PrimeUI dialog components. Called once, at startup.
             */
            initialize: function () {
                var self = this,
                    options = [],
                    i, max, item;

                this.initWeatherTable();

                // Build an array of label,value options for the fuel model dropdown
                for (i = 0, max = fuelModelCatalog.original.length; i < max; i++) {
                    item = fuelModelCatalog.original[i];
                    options.push({
                        label: item.modelNo + ': ' + item.modelName,
                        value: parseInt(item.modelNo, 10)});
                }
                // Checkboxes
                $('#lookout-fuelmodel-auto').puicheckbox();

                // DropDowns
                $('#lookout-fuelmodel-drpdwn').puidropdown({
                    data: options
                });

                $('#lookout-fuelmoisture-drpdwn').puidropdown({
                    data: fuelMoistureCatalog.getScenarioNames()
                });

                // Toggle buttons
                $('#lookout-movable').puitogglebutton({
                    onLabel: 'Locked',
                    offLabel: 'Movable',
                    onIcon: 'fa-check-square',
                    offIcon: 'fa-square'
                });

                // Tabs
                $('#lookout-tabs').puitabview();

                // The dialog
                $('#lookout-dlg').puidialog({
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
                                $('#lookout-dlg').puidialog('hide');
                            }
                        },
                        {
                            text: wmt.BUTTON_TEXT_DELETE,
                            icon: ' fa-minus-circle',
                            click: function () {
                                self.deleteAction();
                                $('#lookout-dlg').puidialog('hide');
                            }
                        },
                        {
                            text: wmt.BUTTON_TEXT_CANCEL,
                            icon: 'fa-close',
                            click: function () {
                                $('#lookout-dlg').puidialog('hide');
                            }
                        }]
                });
            },
            drawCpsForces: function (lookout) {
                // Draw the image in the canvas after loading
                var canvas = document.getElementById('lookout-forces-canvas'),
                    context = canvas.getContext("2d"),
                    imgRose = new Image(),
                    imgPreheat = new Image(),
                    imgSlope = new Image(),
                    imgWind = new Image(),
                    WIDTH = 300,
                    HEIGHT = 300,
                    self = this;

                canvas.width = WIDTH;
                canvas.height = HEIGHT;

                imgRose.onload = function () {
//                    canvas.width = imgRose.width;
//                    canvas.height = imgRose.height;
//                    context.drawImage(imgRose, 0, 0, img.width, img.height);
                    context.drawImage(imgRose, 0, 0, WIDTH, HEIGHT);
                };
                imgPreheat.onload = function () {
                    context.save();
                    self.rotateAbout(context, lookout.sunlight.azimuthAngle.value - 180, 150, 150);
                    context.drawImage(imgPreheat, 0, 0, WIDTH, HEIGHT);
                    context.restore();
                };
                imgSlope.onload = function () {
                    context.save();
                    self.rotateAbout(context, lookout.terrain.aspect - 180, 150, 150);
                    context.drawImage(imgSlope, 0, 0, WIDTH, HEIGHT);
                    context.restore();
                };
                imgWind.onload = function () {
                    context.save();
                    self.rotateAbout(context, lookout.activeWeather.windDirectionDeg - 180, 150, 150);
                    context.drawImage(imgWind, 0, 0, WIDTH, HEIGHT);
                    context.restore();
                };
                imgRose.src = wmt.IMAGE_PATH + 'location-widget_compass-rose.svg';          // Set the image -- which fires the onload event
                imgPreheat.src = wmt.IMAGE_PATH + 'cps-force_solar.svg';          // Set the image -- which fires the onload event
                imgSlope.src = wmt.IMAGE_PATH + 'cps-force_slope.svg';          // Set the image -- which fires the onload event
                imgWind.src = wmt.IMAGE_PATH + 'cps-force_wind.svg';          // Set the image -- which fires the onload event
            },
            /**
             * @param {Context} c
             * @param {Number} theta Degrees
             * @param {Number} x
             * @param {Number} y
             */
            rotateAbout: function (c, theta, x, y) {
                // Rotates theta radians counterclockwise around the point (x,y). This can also be accomplished with a 
                // translate,rotate,translate sequence.
                // Copied from the book "JavaScript: The Definitive Reference"
                var rad = -theta * util.DEG_TO_RAD,
                    ct = Math.cos(rad), st = Math.sin(rad);
                c.transform(ct, -st, st, ct, -x * ct - y * st + x, x * st - y * ct + y);
            },
            /**
             * 
             */
            initWeatherTable: function () {
                $('#lookout-weather-tbl').puidatatable({
                    paginator: {
                        rows: 10,
                        totalRecords: 50
                    },
                    caption: 'Forecasts',
                    columns: [
                        {
                            field: 'time',
                            headerText: 'Time',
                            headerStyle: 'width: 70px; padding-left: 4px; padding-right: 4px;',
                            content: function (row) {
                                return formatter.formatDayOfMonthTime(row.time, 'en');
                            },
                            sortable: true
                        },
                        {
                            field: 'airTemperatureF',
                            headerText: 'F°',
                            sortable: true
                        },
                        {
                            field: 'relaltiveHumidityPct',
                            headerText: 'RH',
                            sortable: true
                        },
                        {
                            field: 'windSpeedKts',
                            headerText: 'Kts',
                            sortable: true
                        },
                        {
                            field: 'windDirectionDeg',
                            headerText: 'Dir',
                            sortable: true
                        },
                        {
                            field: 'skyCoverPct',
                            headerText: 'Sky',
                            sortable: true
                        }
                    ],
                    datasource: [],
                    selectionMode: 'single'
                });
            }

        };
        return FireLookoutViewer;
    }
);
