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


/*global define, $, WorldWind */


/**
 * The AboutBox module displays the application copyright, credits and licenses
 * @param {type} wmt Constants.
 * @returns {AboutBox}
 */
define(['wmt/Wmt'],
    function (wmt) {
        "use strict";
        var AboutBox = {
            initialize: function () {

                // Initialize the tab view dialog body
                $('#aboutBox-tabs').puitabview();
                $('#aboutBox-credit-tabs').puitabview({
                    orientation: 'left'
                });
                $('#aboutBox-license-tabs').puitabview({
                    orientation: 'left'
                });

                // Initialize the modal.                
                $('#aboutBox-dlg').puidialog({
                    draggable: true,
                    resizeable: true,
                    location: 'center',
                    width: 'auto',
                    height: 'auto',
//                    minHeight: 
//                    minWidth:
                    visible: false,
                    modal: true,
                    showEffect: 'fade',
                    hideEffect: 'fade',
                    closeOnEscape: true,
                    closable: true,
                    minimizable: false,
                    maximizable: false,
                    responsive: true,
                    buttons: [{
                            text: wmt.BUTTON_TEXT_OK,
                            icon: 'fa-check',
                            click: function () {
                                $('#aboutBox-dlg').puidialog('hide');
                            }
                        }]
                });
                // Append the version number to PUI Dialog's header
                $('#aboutBox-dlg_label').text('About WMT Version ' + wmt.VERSION);

                // Show the dialog when the WMT icon is clicked
                $("#wmt-logo").on("click", function (event) {
                    $('#aboutBox-dlg').puidialog('show');
                });

            }
        };
        return AboutBox;
    }
);
