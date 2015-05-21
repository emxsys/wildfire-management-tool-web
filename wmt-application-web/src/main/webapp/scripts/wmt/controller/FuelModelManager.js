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
    '../util/Messenger',
    '../util/WmtUtil',
    '../Wmt'],
    function (
        Messenger,
        WmtUtil,
        Wmt) {
        "use strict";
        /**
         * @constructor
         * @returns {FuelModelManager}
         */
        var FuelModelManager = function (controller) {
            var self = this;
            this.ctrl = controller;
            this.initialize();
            $("#fuelModel").on("click", function (event) {
                self.showDialog(event);
            });
        };

        /**
         * Shows the DateTime modal dialog.
         */
        FuelModelManager.prototype.showDialog = function (event) {
            $('#fuelModel-dlg').puidialog('show');
        };

        FuelModelManager.prototype.initialize = function () {
            var self = this;
            // Populate the table
            this.loadTable();

            $('#fuelModel-dlg').puidialog({
                width: '600',
                height: '400',
                showEffect: 'fade',
                hideEffect: 'fade',
                minimizable: false,
                maximizable: true,
                modal: true,
                buttons: [{
                        text: 'OK',
                        icon: 'ui-icon-check',
                        click: function () {
                            // Ok to close?
                            $('#fuelModel-dlg').puidialog('hide');
                            // TODO: Ask the controller to change the fuel model
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
        };

        FuelModelManager.prototype.loadTable = function () {
            $('#fuelModel-tbl').puidatatable({
                caption: 'Original Fuel Models',
//                paginator: {
//                    rows: 5
//                },
//                scrollable: true,
//                scrollHeight: '300',
//                scrollWidth: '400',
                columns: [
                    {
                        content: function(row) {
                            return row.modelNo;
                        }, 
                        headerText: 'No.', 
                        headerStyle: 'width:10%', 
                        sortable: true
                    },
                    {
                        content: function(row) {
                            return row.modelName;
                        }, 
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
                        type: "GET",
                        url: WmtUtil.currentDomain() + Wmt.FUELMODELS_REST_SERVICE,
                        data: "category=original",
                        dataType: "json",
                        context: this,
                        success: function (response) {
                            // Supply the fuelModel array to the datatable
                            callback.call(this, response.fuelModel);
                        }
                    });
                },
                selectionMode: 'single',
                rowSelect: function (event, data) {
                    Messenger.growl("info", "Row Selected", "...", 3000);
                    // TODO: Update controller
                },
                rowUnselect: function (event, data) {
                    Messenger.growl("info", "Row Unselected", "...",5000);
                    // TODO: Update controller
                }
            });

        };
        return FuelModelManager;
    }
);
