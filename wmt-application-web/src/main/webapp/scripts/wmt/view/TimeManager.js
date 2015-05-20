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

/*global define, $ */

/**
 * The DateTimeDialog obtains a set of coordinates from the user.
 * @module DateTimeDialog
 * @author Bruce Schubert
 * @author Theodore Walton
 */
define([],
    function () {
        "use strict";
        /**
         * @constructor
         * @returns {TimeManager}
         */
        var TimeManager = function (controller) {
            var self = this;
            this.ctrl = controller;
            this.initialize();
            $("#datetime").on("click", function (event) {
                self.showDialog(event);
            });
        };

        /**
         * Shows the DateTime modal dialog.
         */
        TimeManager.prototype.showDialog = function (event) {
            $('#datetime-dlg').puidialog('show');
        };

        /**
         * Generates, then shows the DateTime modal dialog.
         * @param {function(Date)} success Callback function accepting a Date object
         * @param {type} fail Callback function accepting an error.
         */
        TimeManager.prototype.initialize = function () {
            var self = this;
            $('#datepicker').datepicker();  // Turn input into a JQUI datepicker
            $('#datetime-dlg').puidialog({
                showEffect: 'fade',
                hideEffect: 'fade',
                minimizable: false,
                maximizable: true,
                modal: true,
                buttons: [{
                        text: 'OK',
                        icon: 'ui-icon-check',
                        click: function () {

                            var dateStr = $('#datepicker').val(),
                                timeStr = $('#timepicker').val(),
                                date;
                            
                            // NO ERROR CHECKING!!!
                            // Just a simple implementation to test Controller
                            date = new Date(dateStr);
                            date.setHours(timeStr);
                            console.log("DateTime Dialog values: " + date.toLocaleString());

                            // Ok to close
                            $('#datetime-dlg').puidialog('hide');                           
                            
                            // Invoke the callback with the user's position.
                            self.ctrl.updateTemporalData(date);

                        }
                    },
                    {
                        text: 'Cancel',
                        icon: 'ui-icon-close',
                        click: function () {
                            $('#datetime-dlg').puidialog('hide');
                        }
                    }]
            });
        };
        return TimeManager;
    }
);
