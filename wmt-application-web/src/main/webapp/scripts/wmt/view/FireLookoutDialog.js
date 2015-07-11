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
    'wmt/model/FuelModelCatalog',
    'wmt/model/FuelMoistureCatalog',
    'wmt/util/Formatter',
    'wmt/Wmt',
    'worldwind'],
    function (
        fuelModelCatalog,
        fuelMoistureCatalog,
        formatter,
        wmt,
        ww) {
        "use strict";
        /**
         * @constructor
         * @param {FireLookout} lookout The lookout to be displayed
         * @returns {FireLookoutDialog}
         */
        var FireLookoutDialog = {
            /**
             * Shows the FireLookout viewer/editor.
             * @param {FireLookout} lookout The lookout to be viewed or edited.
             */
            show: function (lookout) {
                // Load the controls
                $('#lookout-name').val(lookout.name);
                $('#lookout-placename').text('Place: ' + lookout.toponym);
                $('#lookout-latitude').text('Latitude: ' + formatter.formatDecimalDegreesLat(lookout.latitude, 5));
                $('#lookout-longitude').text('Longitude: ' + formatter.formatDecimalDegreesLon(lookout.longitude, 5));
                $('#lookout-movable').puitogglebutton(lookout.isMovable ? 'uncheck' : 'check');
                $('#lookout-fuelmodel-drpdwn').puidropdown('selectValue', lookout.fuelModelNo);
                $('#lookout-fuelmoisture-drpdwn').puidropdown('selectValue', lookout.moistureScenarioName);

                // Save button callback
                this.saveAction = function () {
                    var modelNo = $('#lookout-fuelmodel-drpdwn').puidropdown('getSelectedValue'),
                        scenarioName = $('#lookout-fuelmoisture-drpdwn').puidropdown('getSelectedValue');
                    lookout.name = $('#lookout-name').val();
                    lookout.isMovable = !($('#lookout-movable').puitogglebutton('isChecked'));
                    lookout.fuelModelNo = modelNo;
                    lookout.moistureScenarioName = scenarioName;
                    // Update the views
                    lookout.refresh();
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

                // Build an array of label,value options for the fuel model dropdown
                for (i = 0, max = fuelModelCatalog.original.length; i < max; i++) {
                    item = fuelModelCatalog.original[i];
                    options.push({
                        label: item.modelNo + ': ' + item.modelName,
                        value: parseInt(item.modelNo, 10)});
                }

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
                    locaiton: 'top',
                    width: '90%',
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
                            text: wmt.BUTTON_TEXT_CANCEL,
                            icon: 'fa-close',
                            click: function () {
                                $('#lookout-dlg').puidialog('hide');
                            }
                        }]
                });
                
            }
        };
        return FireLookoutDialog;
    }
);
