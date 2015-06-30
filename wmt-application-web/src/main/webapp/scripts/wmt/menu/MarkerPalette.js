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
 * The MarkerPalette provides a list of markers that can be dragged onto the globe.
 * @param {Wmt} wmt Constants.
 * @returns {MarkerPalette}
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/Wmt'],
    function (
        wmt) {
        "use strict";
        /**
         * 
         * @constructor
         * @returns {MarkerPalette}
         */
        var MarkerPalette = function (paletteId, typeArray) {

            this.$dlg = $(paletteId);
            this.initialize(typeArray);
        };


        /**
         * Shows the marker  modal dialog.
         */
        MarkerPalette.prototype.showModalPalette = function (callback, context) {
            // Reset the selection before showing so 
            // if ESC is pressed, then the selection is null
            this.callback = callback;
            this.context = context;
            this.$dlg.puidialog('show');
        };

        /**
         * Initializes the marker palette for display
         */
        MarkerPalette.prototype.initialize = function (markerArray) {
            var self = this,
                $grid = this.$dlg.find('#markerGrid');

            // Create a grid to represent all the available marker symbols
            $grid.puidatagrid({
                columns: 4,
                datasource: markerArray,
                content: function (mkr) {
                    // Put each symbol in a Prime-UI panel
                    var $item = $(
                        '<div markerName="' + mkr.name + '" markerType="' + mkr.type + '">' +
                        '<img src="' + mkr.symbol + '" />' +
                        '</div>'
                        );

                    // Close the palette when a symbol is selected
                    $item.on('click', function () {
                        self.$dlg.puidialog('hide');

                        // Invoke the callback, passing the marker template and the callback's context
                        self.callback({
                            name: $(this).attr('markerName'),
                            type: $(this).attr('markerType'),
                            symbol: $(this).find('img').attr('src')
                        }, self.context);
                    });

                    return $item.puipanel();
                }
            });
            // Initialize the modal that shows the symbol palette
            this.$dlg.puidialog(
                {
                    modal: true,
                    closable: true,
                    minimizable: false,
                    maximizable: false,
                    resizeable: false,
                    responsive: false
                }
            );
        };
        return MarkerPalette;
    }
);
