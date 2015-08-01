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
 * Provides the menu system, comprised of a Navbar and Sidebars with Accordions.
 * 
 * @param {AboutBox} aboutBox Shows copyright, credits, licenses.
 * @param {ControlPanel} ControlPanel Shows the globe settings sidebar.
 * @param {DateTimeControls} dateTimeControls Manifests the time slider.
 * @param {LayerMenu} LayerMenu Shows the layer list sidebar.
 * @param {MarkerView} MarkerView Shows the marker list sidebar.
 * @param {SearchBox} SearchBox Shows the search box in the nav bar
 * @param {WeatherScoutViewManager} weatherScoutViewManager Shows the weather scouts.
 * @returns {MainMenu}
 * 
 * @author Bruce Schubert
 * @author Theodore Walton
 */
define([
    'wmt/menu/AboutBox',
    'wmt/controller/Controller',
    'wmt/menu/ControlPanel',
    'wmt/menu/DateTimeControls',
    'wmt/view/FireLookoutViewer',
    'wmt/view/FuelModelCatalogViewer',
    'wmt/view/FireLookoutViewManager',
    'wmt/menu/LayerMenu',
    'wmt/view/LocationView',
    'wmt/view/MarkerView',
    'wmt/menu/SearchBox',
    'wmt/view/TimeView',
    'wmt/view/WeatherScoutViewManager',
    'wmt/view/WildlandFireViewManager'],
    function (
        aboutBox,
        controller,
        ControlPanel,
        dateTimeControls,
        fireLookoutViewer,
        fuelModelCatalogViewer,
        fireLookoutViewManager,
        LayerMenu,
        locationView,
        MarkerView,
        SearchBox,
        timeView,
        weatherScoutViewManager,
        wildlandFireViewManager) {
        "use strict";
        var MainMenu = {
            /**
             * Initializes the main menu and its constituents.
             * @param {Controller} controller 
             * @param {Globe} globe The primary globe associated with keyboard controls
             */
            initialize: function () {
                var self = this;

                $(document).ready(function () {

                    //Fill out globe to screen if the nav-bar isn't displayed.
                    if ($('#mainMenu').css("display").indexOf("none") > -1) {
                        $("body").css("padding-top", "0px");
                        $('#wmtweb').css('height', 'calc(100vh)');
                    }

                    // Auto-collapse the navbar when one of its decendents are clicked
                    $('.nav a').on('click', function () {
                        $('#navbar').collapse('hide');
                    });

                    // Add handlers for minimized navbar (navbar-header), 
                    // in which case the the sidebars appear above the globe.
                    $('#expandPanelsItem').on('click', function () {
                        $('html, body').animate({scrollTop: 0}, 'slow');
                    });
                    $('#collapsePanelsItem').on('click', function () {
                        $('html, body').animate({scrollTop: $('#bottom').position().top}, 'slow');
                        // Set the focus on the WorldWind canvas
                        // so the globe keyboard controls are active 
                        $(controller.globe.wwd.canvas).focus();
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


                    // Add +/- icons on the accordion panels
                    $('.panel-heading[aria-expanded="false"]').find('.panel-title').prepend('<span class="glyphicon glyphicon-collapse-down aria-hidden="true"></span>');
                    $('.panel-heading[aria-expanded="true"]').find('.panel-title').prepend('<span class="glyphicon glyphicon-collapse-up aria-hidden="true"></span>');

                    // Add event handlers to panels to toggle the +/- icons in the accordion panel-heading
                    $('.panel:has([role="tab"])').on('shown.bs.collapse', function () {
                        $(this).find(".glyphicon-collapse-down").removeClass("glyphicon-collapse-down").addClass("glyphicon-collapse-up");
                    }).on('hidden.bs.collapse', function () {
                        $(this).find(".glyphicon-collapse-up").removeClass("glyphicon-collapse-up").addClass("glyphicon-collapse-down");
                    });

                    // Initially, at startup, activate the Control Panel
                    $('#controlPanelItem').trigger('click');

                    // But on phones or small portrait mode tablets, we want the activated panel to be hidden
                    // so we click the Collapse button.
                    if ($(document).width < 768) {
                        $('#collapsePanelsItem').trigger('click');
                    }

                    // Initialize the constituent UI elements.
                    this.searchBox = new SearchBox();

                    // Panels
                    this.controlPanel = new ControlPanel();
                    this.layerMenu = new LayerMenu();
                    this.markerPanel = new MarkerView();                   
                    fireLookoutViewManager.initialize();
                    weatherScoutViewManager.initialize();
                    wildlandFireViewManager.initialize();

                    // Screen Widgets
                    dateTimeControls.initialize();
                    locationView.initialize();
                    timeView.initialize();

                    // Dialogs
                    aboutBox.initialize();
                    fireLookoutViewer.initialize();
                    fuelModelCatalogViewer.initialize();
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
                $(elementId).addClass("active");
            }

        };
        return MainMenu;
    }
);
