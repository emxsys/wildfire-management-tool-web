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

/*global define, WorldWind*/

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
                Array('#ctrlPanelGlobe','#findMe'),
                '100',
                '100%',
                '85%'
                );
            var mobileGlobeMenu = new mobileMenu.Menu(
                '#mobileGlobe',
                'slide-top',
                '', 
                Array('#ctrlPanelGlobe'),
                Array('#globeCancel','#globeCheck'),
                '110',
                '27%',
                '100%'
                );


            // Add event handler to save the current view (eye position) when the window closes
            window.onbeforeunload = function () {
                controller.saveSession();
                // Return null to close quietly on Chrome FireFox.
                //return "Close WMT?";
                return null;
            };

            // Now that MVC is set up, restore the model from the previous session.
            controller.restoreSession();

        };

        return WmtClient;
    }
);

