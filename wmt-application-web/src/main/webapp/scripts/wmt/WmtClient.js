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

/*global define, WorldWind, Pace*/

/**
 * WMT Client Application.
 * 
 * @module {WmtClient}
 * 
 * @param {Object} controller
 * @param {Object} Globe
 * @param {Object} mainMenu
 * 
 * @author Bruce Schubert
 * @author Theodore Walton
 */
define([
    'wmt/controller/Controller',
    'wmt/globe/Globe',
    'wmt/menu/MainMenu',
    'wmt/menu/MobileMenu'
],
    function (
        controller,
        Globe,
        mainMenu,
        mobileMenu) {
        "use strict";
        var WmtClient = function () {


            // Create the primary globe
            this.globe = new Globe("canvasOne");

            // Now that the globe is setup, initialize the Model-View-Controller framework.
            // The controller will create model and the views on the primary globe. 
            controller.initialize(this.globe);

            // Initialize the Navbar, Sidebars and UI controls.
            // Do this AFTER the controller is initialized.
            mainMenu.initialize();

            // Initialize the Mobile Slide Menus
            mobileMenu.initialize();
            var mobileControlPanel = new mobileMenu.Menu(
                '#mobileControlPanel',
                'slide-right',
                '#c-maskCtrlPanel',
                Array('#mobileControlPanelButton'),
                Array('#ctrlPanelGlobe', '#findMe'),
                '100',
                '100%',
                '85%'
                );
            var mobileGlobeMenu = new mobileMenu.Menu(
                '#mobileGlobe',
                'slide-top',
                '',
                Array('#ctrlPanelGlobe'),
                Array('#globeCheck'),
                '110',
                'calc(5vh + 180px)',
                '100%'
                );
            var mobileLayers = new mobileMenu.Menu(
                '#mobileLayers',
                'slide-right',
                '#c-maskMobileLayers',
                Array('#mobileLayersButton'),
                Array('#layersListButton'),
                '100',
                '100%',
                '85%'
                );
            var mobileLayersList = new mobileMenu.Menu(
                '#mobileLayersList',
                'slide-top',
                '',
                Array('#layersListButton'),
                Array('#layersListCheck'),
                '110',
                'calc(30vh + 100px)',
                '100%'
                );
            var mobileMarkers = new mobileMenu.Menu(
                '#mobileMarkers',
                'slide-right',
                '#c-maskMarkers',
                Array('#mobileMarkersButton'),
                Array(''),
                '100',
                '100%',
                '85%'
                );
            var mobileWeather = new mobileMenu.Menu(
                '#mobileWeather',
                'slide-right',
                '#c-maskMobileWeather',
                Array('#mobileWeatherButton'),
                Array('#weatherWeatherScoutsButton'),
                '100',
                '100%',
                '85%'
                );
            var mobileWeatherScouts = new mobileMenu.Menu(
                '#mobileWeatherScouts',
                'slide-top',
                '',
                Array('#weatherWeatherScoutsButton', '#globeWeatherScoutsButton'),
                Array('#weatherScoutsCheck'),
                '110',
                'calc(39vh + 50px)',
                '100%'
                );
            var mobileFires = new mobileMenu.Menu(
                '#mobileFires',
                'slide-right',
                '#c-maskMobileFires',
                ['#mobileFiresButton'],
                ['#firesFireLookoutsButton', '#firesWildlandFiresButton'],
                '100',
                '100%',
                '85%'
                );
            var mobileFireLookouts = new mobileMenu.Menu(
                '#mobileFireLookouts',
                'slide-top',
                '',
                ['#firesFireLookoutsButton', '#globeFireLookoutsButton'],
                ['#fireLookoutsCheck'],
                '110',
                'calc(39vh + 50px)',
                '100%'
                );
            var mobileWildlandFires = new mobileMenu.Menu(
                '#mobileWildlandFires',
                'slide-top',
                '',
                ['#firesWildlandFiresButton'],
                ['#wildlandFiresCheck'],
                '110',
                'calc(39vh + 50px)',
                '100%'
                );


            //initialize the hold events for the globe scout and lookout buttons
            $('#globeCreateFireLookout').on('taphold', function () {
                mobileFireLookouts.open();
            });
            $('#globeCreateWeatherScout').on('taphold', function () {
                mobileWeatherScouts.open();
            });
            $('#globeRefreshWeatherForecasts').on('click', function () {
                controller.model.weatherScoutManager.refreshScouts();
                controller.model.fireLookoutManager.refreshLookouts();
            });

            // needed delegate event handling for these buttons
            $('#allMarkersList').on('click', 'button.mkr-goto', function () {
                mobileMarkers.close();
            });

            // Add event handler to save the current view (eye position) when the window closes
            window.onbeforeunload = function () {
                controller.saveSession();
                // Return null to close quietly on Chrome FireFox.
                //return "Close WMT?";
                return null;
            };

            // Now that MVC is set up, restore the model from the previous session.
            // But wait for the globe (specically the elevation model) to finish 
            // loading before adding placemarks, else the terrain data will be
            // inaccurate.
            if (Pace.running) {
                Pace.on("done", function () {
                    setTimeout(function () {
                        controller.restoreSession();
                    }, 0);
                });
            } else {
                controller.restoreSession();
            }

        };

        return WmtClient;
    }
);

