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
 *     - Neither the name of Bruce Schubert, Emxsys nor the names of its 
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

/*global define, $ */

define([
    'wmt/controller/Controller',
    'wmt/util/WmtUtil',
    'wmt/Wmt'],
    function (
        controller,
        util,
        wmt) {
        "use strict";
        /**
         * @constructor
         * @returns {FuelModelDialog}
         */
        var FuelModelDialog = {
            selectedFuelModel: null,
            show: function () {
                $('#fuelModel-dlg').puidialog('show');
            },
            /**
             * Performs mandatory initialization prior to being shown.
             */
            initialize: function () {
                var self = this;
                this.loadTable($('#fuelModel-standard-tbl'), 'standard');
                this.loadTable($('#fuelModel-original-tbl'), 'original');
                $('#fuelModel-tabs').puitabview();
                $('#fuelModel-dlg').puidialog({
                    width: 'auto',
                    height: 'auto',
                    showEffect: 'fade',
                    hideEffect: 'fade',
                    minimizable: false,
                    maximizable: false,
                    modal: true,
                    responsive: true,
                    buttons: [{
                            text: 'OK',
                            icon: 'ui-icon-check',
                            disabled: 'true',
                            click: function () {
                                // Ok to close?
                                if (self.selectedFuelModel) {
                                    $('#fuelModel-dlg').puidialog('hide');
                                    // TODO: Ask the controller to change the fuel model
                                    controller.changeFuelModel(self.selectedFuelModel);
                                }
                            }
                        },
                        {
                            text: 'Cancel',
                            icon: 'ui-icon-close',
                            click: function () {
                                // Unconditionally close
                                $('#fuelModel-dlg').puidialog('hide');
                            }
                        }]
                });
                // Show the dialog when the fuel model button is clicked
                $("#fuelModel-btn").on("click", function (event) {
                    $('#fuelModel-dlg').puidialog('show');
                });
            },
            /**
             * Loads the given data table with the fuel model category
             * @param {type} $table
             * @param {type} category
             */
            loadTable: function ($table, category) {
                var self = this;
                $table.puidatatable({
                    paginator: {
                        rows: 10
                    },
                    columns: [
                        {
                            field: 'modelNo',
                            headerText: 'No.',
                            headerStyle: 'width:10%',
                            sortable: true
                        },
                        {
                            field: 'modelName',
                            headerText: 'Name',
                            sortable: true
                        },
                        {
                            field: 'modelGroup',
                            headerText: 'Category',
                            headerStyle: 'width:20%',
                            sortable: true
                        }
                    ],
                    datasource: function (callback) {
                        $.ajax({
                            type: 'GET',
                            url: util.currentDomain() + wmt.FUELMODELS_REST_SERVICE,
                            data: 'category=' + category,
                            dataType: 'json',
                            context: this,
                            success: function (response) {
                                // Supply the fuelModel array to the datatable
                                callback.call(this, response.fuelModel);
                            }
                        });
                    },
                    selectionMode: 'single',
                    rowSelect: function (event, data) {
                        self.selectedFuelModel = data;
                    },
                    rowUnselect: function (event, data) {
                    }
                });
            }
        };
        return FuelModelDialog;
    }
);
