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
 * Provides the main menu
 * 
 * @module {MainMenu}
 */
define([],
    function () {
        "use strict";
        var MainMenu = {
            initialize: function () {
                var self = this;

                // Auto-collapse the navbar when one of its decendents are clicked
                $('.nav a').on('click', function () {
                    //$("#expandMenuItem").click();  
                    $('#navbar').collapse('hide');
                });


                // Add handlers for minimized navbar, in which
                // case the the sidebars appear above the globe.
                $('#showPanelsItem').on('click', function () {
                    $('html, body').animate({scrollTop: 0}, 'slow');
                });
                $('#showGlobeItem').on('click', function () {
                    $('html, body').animate({scrollTop: $('#globe').position().top}, 'slow');
                    // Set the focus on the WorldWind canvas
                    // so the globe keyboard controls are active 
                    $("#canvasOne").focus();
                });
                

                // Attach a click handler to the main menu items
                $('#controlPanelItem').on('click', function () {
                    self.highlightButton('#controlPanelItem');
                    self.showSidebar('#controlPanel');
                });
                $('#layersItem').on('click', function () {
                    self.highlightButton('#layersItem');
                    self.showSidebar('#layersPanel');
                });
                $('#markersItem').on('click', function () {
                    self.highlightButton('#markersItem');
                    self.showSidebar('#markersPanel');
                });
                $('#weatherItem').on('click', function () {
                    self.highlightButton('#weatherItem');
                    self.showSidebar('#weatherPanel');
                });
                $('#firesItem').on('click', function () {
                    self.highlightButton('#firesItem');
                    self.showSidebar('#firesPanel');
                });
            },
            /**
             * 
             * @param {type} elementId
             */
            showSidebar: function (elementId) {
                // Hide current sidebar(s) and then show the 
                // sidebar with the given element id (#id)
                $('div.sidebar').hide();
                $(elementId).show();
            },
            /**
             * 
             * @param {type} elementId
             */
            highlightButton: function (elementId) {
                // Turn off the highlight for current button
                // and highlight the given element id (#id)
                $('#sidebarItems').find('li').removeClass("active");
//                $('#sidebarItems').find('li').each(function () {
//                    $(this).removeClass("active");
//                });
                $(elementId).addClass("active");
            }

        };
        return MainMenu;
    }
);  