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
 * @param {Object} Controller
 * @param {Object} EnhancedLookAtNavigator
 * @param {Object} EnhancedViewControlsLayer
 * @param {Object} KeyboardControls
 * @param {Object} Log
 * @param {Object} MainMenu
 * @param {Object} PickController
 * @param {Object} ReticuleLayer
 * @param {Object} Settings
 * @param {Object} Wmt
 * 
 * @author Bruce Schubert
 */
define([
    './controller/Controller',
    './globe/Globe',
    './globe/KeyboardControls',
    './util/Log',
    './menu/MainMenu',
    './menu/DateTimeControls',
    './Wmt',
    '../nasa/WorldWind'],
    function (
        Controller,
        Globe,
        KeyboardControls,
        Log,
        MainMenu,
        DateTimeControls,
        Wmt,
        WorldWind) {
        "use strict";
        var WmtClient = function () {
            Log.info("WmtClient", "constructor", "started");

            // Initialize the WorldWindow
            this.globe = new Globe("canvasOne");

            // Now that the globe is setup, initialize the Model-View-Controller framework.
            // The controller will create model and the views
            this.controller = new Controller(this.globe.wwd);
            // The controller restores the Model from the previous session
            this.controller.restoreSession();

            // Add keyboard controls to the globe: requires the Controller
            this.keyboardControls = new KeyboardControls(this.globe.wwd, this.controller);

            // Initialize the Navbar and Sidebars
            MainMenu.initialize(this.controller);

            // Initialize the Time Slider Control (TODO: Add this to the main menu)
            DateTimeControls.initialize(this.controller);

            // Add event handler to save the current view (eye position) when the window closes
            var self = this;
            window.onbeforeunload = function () {
                self.controller.saveSession();
                // Return null to close quietly on Chrome FireFox.
                //return "Close WMT?";
                return null;
            };
            Log.info("WmtClient", "constructor", "finished.");
        };

        return WmtClient;
    }
);

