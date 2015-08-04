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
 * @author Theodore Walton
 * 
 */
define([
    'wmt/Wmt'],
    function (
        wmt) {
        "use strict";
        /**
         * 
         * @constructor
         * @returns {MobileMarkerPalette}
         */
        var MobileMarkerPalette = function (paletteId, typeArray, callback, context) {
            // First initialize the callback function
            // Reset the selection before showing so 
            // if ESC is pressed, then the selection is null
            this.callback = callback;
            this.context = context;
            //Assign the HTMl element, and initialize the marker list
            this.palette = $(paletteId);
            this.initialize(typeArray);
        };


        /**
         * Shows the HTML palette element
         */
        MobileMarkerPalette.prototype.showPalette = function (callback, context) {
            // Refresh the callback function
            // Reset the selection before showing so 
            // if ESC is pressed, then the selection is null
            this.callback = callback;
            this.context = context;
            // Show the ICS Marker Palette
            this.palette.show('fast');
        };
        
        /**
         * Hides the HTML palette element
         */
        MobileMarkerPalette.prototype.hidePalette = function () {                                   
            this.palette.hide('fast');
        };

        /**
         * Initializes the marker palette for display
         */
        MobileMarkerPalette.prototype.initialize = function (markerArray) {
            var self = this,
                list = $(this.palette.selector).children('#markerList');

            // Create a grid to represent all the available marker symbols
            list.puidatagrid({
                columns: 1,
                datasource: markerArray,
                content: function (mkr) {
                    // Put each symbol in a Prime-UI panel
                    var $item = $(
                        '<div markerName="' + mkr.name + '" markerType="' + mkr.type + '">' +
                        '<img src="' + mkr.symbol + '" style="width:100%;" />' +
                        '</div>'
                        );
                    
                    $item.on('click', function () {
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
        };
        return MobileMarkerPalette;
    }
);
