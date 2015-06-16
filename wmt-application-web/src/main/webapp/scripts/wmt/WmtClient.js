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

/*global define*/

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
 * @param {Object} WorldWind
 * 
 * @author Bruce Schubert
 */
define([
    './controller/Controller',
    './globe/DnDController',
    './globe/EnhancedLookAtNavigator',
    './globe/EnhancedViewControlsLayer',
    './globe/KeyboardControls',
    './util/Log',
    './menu/MainMenu',
    './menu/DateTimeControls',
    './globe/ReticuleLayer',
    './globe/SelectController',
    './globe/SkyBackgroundLayer',
    './Wmt',
    '../nasa/WorldWind'],
    function (
        Controller,
        DnDController,
        EnhancedLookAtNavigator,
        EnhancedViewControlsLayer,
        KeyboardControls,
        Log,
        MainMenu,
        DateTimeControls,
        ReticuleLayer,
        SelectController,
        SkyBackgroundLayer,
        Wmt,
        WorldWind) {
        "use strict";
        var WmtClient = function () {
            Log.info("WmtClient", "constructor", "started");

            // Specify the where the World Wind resources are located.
            WorldWind.configuration.baseUrl = Wmt.WORLD_WIND_PATH;
            // Set the logging level for the World Wind library
            WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

            // Initialize the WorldWindow
            this.initializeGlobe();

            // Now that the globe is setup, initialize the Model-View-Controller framework.
            // The controller will create model and the views
            this.controller = new Controller(this.wwd);
            this.controller.restoreSession();

            // Add keyboard controls to the globe: requires the Controller
            this.keyboardControls = new KeyboardControls(this.wwd, this.controller);

            // Initialize the Navbar and Sidebars
            MainMenu.initialize(this.controller);
            
            // Initialize the Time Slider Control
            DateTimeControls.initialize(this.controller);                     

            // Add event handler to save the current view (eye position) when the window closes
            var self = this;
            window.onbeforeunload = function () {
                self.controller.saveSession();
                // Return null to close quietly on Chrome FireFox.
                return "Close WMT?";
            };
            Log.info("WmtClient", "constructor", "finished.");
        };

        /**
         * Initialized the WorldWindow with a custom navigator and maps and imagery layers.
         */
        WmtClient.prototype.initializeGlobe = function () {
            // Create the World Window with a custom navigator object 
            this.wwd = new WorldWind.WorldWindow("canvasOne");

            // Create the controller that mouseover highlighting objects in the globe;
            // add this controller as a new WorldWindow property .
            this.wwd.highlightController = new WorldWind.HighlightController(this.wwd);
            this.wwd.selectController = new SelectController(this.wwd);
            this.wwd.dndController = new DnDController(this.wwd);

            // Add the navigator after the select controller so the select controller
            // can consume the mousemove event and preempt the pan/drag operation.
            this.wwd.navigator = new EnhancedLookAtNavigator(this.wwd);

            var self = this,
                layer,
                layers = [
                    {layer: new SkyBackgroundLayer(this.wwd), enabled: true},
                    {layer: new WorldWind.BMNGLayer(), enabled: true},
                    {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
                    {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
                    {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
                    {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
                    {layer: new WorldWind.RenderableLayer(Wmt.MARKERS_LAYER_NAME), enabled: true},
                    {layer: new ReticuleLayer(), enabled: true},
                    {layer: new EnhancedViewControlsLayer(this.wwd), enabled: true}
                ];
            // Add imagery layers to WorldWindow
            for (layer = 0; layer < layers.length; layer += 1) {
                layers[layer].layer.enabled = layers[layer].enabled;
                this.wwd.addLayer(layers[layer].layer);
            }

            // Add event handler to redraw the WorldWindow during resize events
            // to prevent the canvas from looking distorted
            window.onresize = function () {
                self.wwd.redraw();
            };
        };

        return WmtClient;
    }
);
        
