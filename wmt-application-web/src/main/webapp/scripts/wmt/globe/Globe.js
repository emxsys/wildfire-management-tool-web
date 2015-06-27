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
 * 
 * @param {type} DnDController
 * @param {type} EnhancedLookAtNavigator
 * @param {type} EnhancedTextSupport
 * @param {type} EnhancedViewControlsLayer
 * @param {type} ReticuleLayer
 * @param {type} SelectController
 * @param {type} SkyBackgroundLayer
 * @param {type} Wmt
 * @param {WorldWind} ww Ensure dependency on WorldWind is satisfied, but don't redefine the global.
 * @returns {Globe}
 */
define([
    'wmt/globe/DnDController',
    'wmt/globe/EnhancedLookAtNavigator',
    'wmt/globe/EnhancedTextSupport',
    'wmt/globe/EnhancedViewControlsLayer',
    'wmt/util/Log',
    'wmt/globe/ReticuleLayer',
    'wmt/globe/SelectController',
    'wmt/globe/SkyBackgroundLayer',
    'wmt/Wmt',
    'worldwind'],
    function (
        DnDController,
        EnhancedLookAtNavigator,
        EnhancedTextSupport,
        EnhancedViewControlsLayer,
        Log,
        ReticuleLayer,
        SelectController,
        SkyBackgroundLayer,
        Wmt,
        ww) {
        "use strict";
        /**
         * Creates a Globe object which manages a WorldWindow object created for the given canvas.
         * @constructor
         * @param {String} canvasName The canvas element ID for the WorldWindow canvas.
         * @param {Object} options Optional. Example (with defaults):
         *  {
         *      showBackground: true
         *      showReticule: true, 
         *      showViewControls: true, 
         *      includePanControls: true, 
         *      includeRotateControls: true, 
         *      includeTiltControls: true, 
         *      includeZoomControls: true, 
         *      includeExaggerationControls: false, 
         *      includeFieldOfViewControls: false, 
         *  }
         * @param {WorldWind.Layer[]} layers Optional. A list of layers to load. If not provided a
         * default collection of layers is loaded.
         * @returns {Globe}
         */
        var Globe = function (canvasName, options, layers) {
            // Create the World Window
            this.wwd = new WorldWind.WorldWindow(canvasName);

            // Override the default TextSupport with our custom verion that draws outline text
            this.wwd.drawContext.textSupport = new EnhancedTextSupport();

            this.goToAnimator = new WorldWind.GoToAnimator(this.wwd);
            this.isAnimating = false;

            // TODO: Change to globe controllers instead of wwd controllers.
            this.wwd.highlightController = new WorldWind.HighlightController(this.wwd);
            this.wwd.selectController = new SelectController(this.wwd);
            this.wwd.dndController = new DnDController(this.wwd);

            // Add the custom navigator after the select controller so the select controller can
            // consume the mouse events and preempt the pan/drag operation during object move operations.
            this.wwd.navigator = new EnhancedLookAtNavigator(this.wwd);

            // Create the default layers
            var self = this,
                showBackground = options ? options.showBackground : true,
                showReticule = options ? options.showReticule : true,
                showViewControls = options ? options.showViewControls : true,
                includePanControls = options ? options.includePanControls : Wmt.configuration.showPanControl,
                includeRotateControls = options ? options.includeRotateControls : true,
                includeTiltControls = options ? options.includeTiltControls : true,
                includeZoomControls = options ? options.includeZoomControls : true,
                includeExaggerationControls = options ? options.includeExaggerationControls : Wmt.configuration.showExaggerationControl,
                includeFieldOfViewControls = options ? options.includeFieldOfViewControls : Wmt.configuration.showFiewOfViewControl,
                defaultLayers = [
                    {layer: new WorldWind.BMNGLayer(), enabled: true, hide: true},
                    {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
                    {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
                    {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
                    {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
                    {layer: new WorldWind.RenderableLayer(Wmt.MARKERS_LAYER_NAME), enabled: true},
                    {layer: new WorldWind.RenderableLayer(Wmt.WEATHER_LAYER_NAME), enabled: true},
                ],
                layer,
                i, max;

            // Add optional background layer
            if (showBackground || showBackground === undefined) {
                layer = new SkyBackgroundLayer(this.wwd);
                layer.hide = true; // hidden in layer list
                this.wwd.addLayer(layer);
            }
            // Add imagery layers to WorldWindow
            if (layers && layers.length > 0) {
                // User layers
                for (i = 0, max = layers.length; i < max; i++) {
                    this.wwd.addLayer(layers[i]);
                }
            }
            else {
                // Default layers
                for (i = 0, max = defaultLayers.length; i < max; i++) {
                    // Propagate enabled option to the layer object
                    defaultLayers[i].layer.enabled = defaultLayers[i].enabled;
                    // Hide background and control layers in the menu 
                    if (defaultLayers[i].hide) {
                        defaultLayers[i].layer.hide = defaultLayers[i].hide;
                    }
                    this.wwd.addLayer(defaultLayers[i].layer);
                }
            }
            // Add optional reticule
            if (showReticule || showReticule === undefined) {
                layer = new ReticuleLayer();
                layer.hide = true; // hidden in layer list
                this.wwd.addLayer(layer);
            }
            // Add optional view controls layer
            if (showViewControls || showViewControls === undefined) {
                layer = new EnhancedViewControlsLayer(this.wwd);
                layer.showPanControl = (includePanControls === undefined) ? Wmt.configuration.showPanControl : includePanControls;
                layer.showHeadingControl = (includeRotateControls === undefined) ? true : includeRotateControls;
                layer.showTiltControl = (includeTiltControls === undefined) ? true : includeTiltControls;
                layer.showZoomControl = (includeZoomControls === undefined) ? true : includeZoomControls;
                layer.showExaggerationControl = (includeExaggerationControls === undefined) ? Wmt.configuration.showExaggerationControl : includeExaggerationControls;
                layer.showFieldOfViewControl = (includeFieldOfViewControls === undefined) ? Wmt.configuration.showFieldOfViewControl : includeFieldOfViewControls;

                layer.hide = true; // hidden in layer list
                this.wwd.addLayer(layer);
            }
            // Add event handler to redraw the WorldWindow during resize events
            // to prevent the canvas from looking distorted
            window.onresize = function () {
                self.wwd.redraw();
            };
        };


        /**
         * Finds the World Wind Layer in the layer list with the given display name.
         * @param {String} name Display name of the layer
         * @returns {Layer}
         */
        Globe.prototype.findLayer = function (name) {
            var layer,
                i, len;

            // Find the Markers layer in the World Window's layer list.
            for (i = 0, len = this.wwd.layers.length; i < len; i++) {
                layer = this.wwd.layers[i];
                if (layer.displayName === name) {
                    return layer;
                }
            }
        };


        /**
         * Updates the globe via animation.
         * @param {Number} latitude Reqd.
         * @param {Number} longitude Reqd.
         * @param {Number} range Optional.
         * @param {Function} callback Optional.
         */
        Globe.prototype.goto = function (latitude, longitude, range, callback) {
            if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
                Log.error("Globe", "gotoLatLon", "Invalid Latitude and/or Longitude.");
                return;
            }
            var self = this;

            if (this.isAnimating) {
                this.goToAnimator.cancel();
            }
            this.isAnimating = true;
            this.goToAnimator.goTo(new WorldWind.Position(latitude, longitude, range), function () {
                self.isAnimating = false;
                if (callback) {
                    callback();
                }
            });
        };

        /**
         * Updates the globe withoug animation.
         * @param {Number} latitude Reqd.
         * @param {Number} longitude Reqd.
         * @param {Number} range Optional.
         */
        Globe.prototype.lookAt = function (latitude, longitude, range) {
            if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
                Log.error("Globe", "lookAt", "Invalid Latitude and/or Longitude.");
                return;
            }
            this.wwd.navigator.lookAtLocation.latitude = latitude;
            this.wwd.navigator.lookAtLocation.longitude = longitude;
            if (range) {
                this.wwd.navigator.range = range;
            }
            this.wwd.redraw();
        };

        /** 
         * Redraws the globe.
         */
        Globe.prototype.redraw = function () {
            this.wwd.redraw();
        };


        /**
         * Resets the viewpoint to the startup configuration settings.
         */
        Globe.prototype.reset = function () {
            this.wwd.navigator.lookAtLocation.latitude = Number(Wmt.configuration.startupLatitude);
            this.wwd.navigator.lookAtLocation.longitude = Number(Wmt.configuration.startupLongitude);
            this.wwd.navigator.range = Number(Wmt.configuration.startupAltitude);
            this.wwd.navigator.heading = Number(Wmt.configuration.startupHeading);
            this.wwd.navigator.tilt = Number(Wmt.configuration.startupTilt);
            this.wwd.navigator.roll = Number(Wmt.configuration.startupRoll);
            this.wwd.redraw();
        };


        /**
         * Resets the viewpoint to north up.
         */
        Globe.prototype.resetHeading = function () {
            this.wwd.navigator.heading = Number(0);
            this.wwd.redraw();
        };


        Globe.prototype.setProjection = function (projectionName) {
            if (projectionName === Wmt.PROJECTION_NAME_3D) {
                if (!this.roundGlobe) {
                    this.roundGlobe = new WorldWind.Globe(new WorldWind.EarthElevationModel());
                }

                if (this.wwd.globe !== this.roundGlobe) {
                    this.wwd.globe = this.roundGlobe;
                }
            } else {
                if (!this.flatGlobe) {
                    this.flatGlobe = new WorldWind.Globe2D();
                }

                if (projectionName === Wmt.PROJECTION_NAME_EQ_RECT) {
                    this.flatGlobe.projection = new WorldWind.ProjectionEquirectangular();
                } else if (projectionName === Wmt.PROJECTION_NAME_MERCATOR) {
                    this.flatGlobe.projection = new WorldWind.ProjectionMercator();
                } else if (projectionName === Wmt.PROJECTION_NAME_NORTH_POLAR) {
                    this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("North");
                } else if (projectionName === Wmt.PROJECTION_NAME_SOUTH_POLAR) {
                    this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("South");
                } else if (projectionName === Wmt.PROJECTION_NAME_NORTH_UPS) {
                    this.flatGlobe.projection = new WorldWind.ProjectionUPS("North");
                } else if (projectionName === Wmt.PROJECTION_NAME_SOUTH_UPS) {
                    this.flatGlobe.projection = new WorldWind.ProjectionUPS("South");
                }

                if (this.wwd.globe !== this.flatGlobe) {
                    this.wwd.globe = this.flatGlobe;
                }
            }
            this.wwd.redraw();
        };

        return Globe;
    }
);
