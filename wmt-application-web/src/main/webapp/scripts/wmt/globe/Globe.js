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
 * The Globe module manages the WorldWindow object and add capabilities to the globe not found in the 
 * Web World Wind library.
 * 
 * @param {DnDController} DnDController Drag-N-Drop controller.
 * @param {EnhancedLookAtNavigator} EnhancedLookAtNavigator Doesn't allow the eye pos to go below the terrain.
 * @param {EnhancedTextSupport} EnhancedTextSupport Provides outline text.
 * @param {EnhancedViewControlsLayer} EnhancedViewControlsLayer Provides a vertical layout.
 * @param {KeyboardControls} KeyboardControls Provides keyboard navigation for the globe.
 * @param {Log} log Logger.
 * @param {ReticuleLayer} ReticuleLayer Crosshairs.
 * @param {SelectController} SelectController Provides select and move of globe renderables.
 * @param {SkyBackgroundLayer} SkyBackgroundLayer Adaptive sky color.
 * @param {Terrain} Terrain Aspect, slope and elevation.
 * @param {TerrainProvider} TerrainProvider Provides terrain data.
 * @param {Viewpoint} Viewpoint Eye position and target terrain.
 * @param {Wmt} wmt Constants.
 * @param {WorldWind} ww
 * @returns {Globe}
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/globe/DnDController',
    'wmt/globe/EnhancedLookAtNavigator',
    'wmt/globe/EnhancedTextSupport',
    'wmt/globe/EnhancedViewControlsLayer',
    'wmt/globe/KeyboardControls',
    'wmt/util/Log',
    'wmt/globe/ReticuleLayer',
    'wmt/globe/SelectController',
    'wmt/globe/SkyBackgroundLayer',
    'wmt/globe/Terrain',
    'wmt/globe/TerrainProvider',
    'wmt/globe/Viewpoint',
    'wmt/Wmt',
    'worldwind'],
    function (
        DnDController,
        EnhancedLookAtNavigator,
        EnhancedTextSupport,
        EnhancedViewControlsLayer,
        KeyboardControls,
        log,
        ReticuleLayer,
        SelectController,
        SkyBackgroundLayer,
        Terrain,
        TerrainProvider,
        Viewpoint,
        wmt,
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
            
            this.wwd.highlightController = new WorldWind.HighlightController(this.wwd);
            this.selectController = new SelectController(this.wwd);
            this.dndController = new DnDController(this.wwd);
            this.keyboardControls = new KeyboardControls(this);
            
            // Add the custom navigator *after* the select controller 
            // so the select controller can consume the mouse events 
            // and preempt the pan/drag operations when moving objects.
            this.wwd.navigator = new EnhancedLookAtNavigator(this.wwd);

            // Add terrain services (aspect, slope) to the globe
            this.terrainProvider = new TerrainProvider(this);
            
            // Create the default layers
            var self = this,
                showBackground = options ? options.showBackground : true,
                showReticule = options ? options.showReticule : true,
                showViewControls = options ? options.showViewControls : true,
                includePanControls = options ? options.includePanControls : wmt.configuration.showPanControl,
                includeRotateControls = options ? options.includeRotateControls : true,
                includeTiltControls = options ? options.includeTiltControls : true,
                includeZoomControls = options ? options.includeZoomControls : true,
                includeExaggerationControls = options ? options.includeExaggerationControls : wmt.configuration.showExaggerationControl,
                includeFieldOfViewControls = options ? options.includeFieldOfViewControls : wmt.configuration.showFiewOfViewControl,
                defaultLayers = [
                    {layer: new WorldWind.BMNGLayer(), enabled: true, hide: true},
                    {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
                    {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
                    {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
                    {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
                    {layer: new WorldWind.RenderableLayer(wmt.FIRE_PERIMETERS_LAYER_NAME), enabled: true},
                    {layer: new WorldWind.RenderableLayer(wmt.FIRE_BEHAVIOR_LAYER_NAME), enabled: true},
                    {layer: new WorldWind.RenderableLayer(wmt.WEATHER_LAYER_NAME), enabled: true},
                    {layer: new WorldWind.RenderableLayer(wmt.MARKERS_LAYER_NAME), enabled: true},
                    {layer: new WorldWind.RenderableLayer(wmt.LAYER_NAME_WIDGETS), enabled: true, hide: true}
                ],
                layer,
                i, max;
            // Add optional background layer
            if (showBackground || showBackground === undefined) {
                layer = new SkyBackgroundLayer(this.wwd);
                layer.hide = true; // hidden in layer list
                this.wwd.addLayer(layer);
            }
            // If the globe constructor was supplied with layers
            // then we add them here...
            if (layers && layers.length > 0) {
                for (i = 0, max = layers.length; i < max; i++) {
                    this.wwd.addLayer(layers[i]);
                }
            }
            else {
                // ... otherwise, we use the default layers
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
                layer.showPanControl = (includePanControls === undefined) ? wmt.configuration.showPanControl : includePanControls;
                layer.showHeadingControl = (includeRotateControls === undefined) ? true : includeRotateControls;
                layer.showTiltControl = (includeTiltControls === undefined) ? true : includeTiltControls;
                layer.showZoomControl = (includeZoomControls === undefined) ? true : includeZoomControls;
                layer.showExaggerationControl = (includeExaggerationControls === undefined) ? wmt.configuration.showExaggerationControl : includeExaggerationControls;
                layer.showFieldOfViewControl = (includeFieldOfViewControls === undefined) ? wmt.configuration.showFieldOfViewControl : includeFieldOfViewControls;
                layer.hide = true; // hidden in layer list
                this.wwd.addLayer(layer);
            }
            // Redraw the WorldWindow during resize events
            // to prevent the canvas from looking distorted
            window.onresize = function () {
                self.wwd.redraw();
            };
            // Ensure keyboard controls are operational by 
            // setting focus to the globe 
            this.wwd.addEventListener("click", function (event) {
                self.setFocus();
            });
            // Internals
            this.lastEyePoint = new WorldWind.Vec3();
            this.lastViewpoint = new Viewpoint(WorldWind.Position.ZERO, Terrain.ZERO);
        };
        /**
         * Adds the given layer to the globe
         * @param {WorldWind.Layer} layer Layer to add.
         * @param {Boolean} hide Hides the layer from layer list if true. Default: false.
         */
        Globe.prototype.addLayer = function (layer, hide) {
            layer.hide = hide === undefined ? false : hide;
            this.wwd.addLayer(layer);
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
         * Gets terrain at the given latitude and longitude.
         * @param {Number} latitude
         * @param {Number} longitude
         * @return {Terrain} A WMT Terrain object at the given lat/lon.
         */
        Globe.prototype.getTerrainAtLatLon = function (latitude, longitude) {
            return this.terrainProvider.terrainAtLatLon(latitude, longitude);
        };
        /**
         * Gets terrain at the screen point.
         * @param {Vec2} screenPoint Point in screen coordinates for which to get terrain.
         * @return {Terrain} A WMT Terrain object at the screen point.
         */
        Globe.prototype.getTerrainAtScreenPoint = function (screenPoint) {
            var terrainObject,
                terrain;
            // Get the WW terrain at the screen point, it supplies the lat/lon
            terrainObject = this.wwd.pickTerrain(screenPoint).terrainObject();
            if (terrainObject) {
                // Get the WMT terrain at the picked lat/lon
                terrain = this.terrainProvider.terrainAtLatLon(
                    terrainObject.position.latitude,
                    terrainObject.position.longitude);
            } else {
                // Probably above the horizon.
                terrain = new Terrain();
                terrain.copy(Terrain.INVALID);
            }
            return terrain;
        };
        /**
         * Gets the current viewpoint at the center of the viewport.
         * @@returns {Viewpoint} A Viewpoint representing the the eye position and the target position.
         */
        Globe.prototype.getViewpoint = function () {
            try {
                var wwd = this.wwd,
                    centerPoint = new WorldWind.Vec2(wwd.canvas.width / 2, wwd.canvas.height / 2),
                    navigatorState = wwd.navigator.currentState(),
                    eyePoint = navigatorState.eyePoint,
                    eyePos = new WorldWind.Position(),
                    target, viewpoint;
                // Avoid costly computations if nothing changed
                if (eyePoint.equals(this.lastEyePoint)) {
                    return this.lastViewpoint;
                }
                this.lastEyePoint.copy(eyePoint);
                // Get the current eye position 
                wwd.globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], eyePos);
                // Get the target (the point under the reticule)
                target = this.getTerrainAtScreenPoint(centerPoint);
                // Return the viewpoint
                viewpoint = new Viewpoint(eyePos, target);
                this.lastViewpoint.copy(viewpoint);
                return viewpoint;
            } catch (e) {
                log.error("Globe", "getViewpoint", e.toString());
                return Viewpoint.INVALID;
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
                log.error("Globe", "gotoLatLon", "Invalid Latitude and/or Longitude.");
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
                log.error("Globe", "lookAt", "Invalid Latitude and/or Longitude.");
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
            this.wwd.navigator.lookAtLocation.latitude = Number(wmt.configuration.startupLatitude);
            this.wwd.navigator.lookAtLocation.longitude = Number(wmt.configuration.startupLongitude);
            this.wwd.navigator.range = Number(wmt.configuration.startupAltitude);
            this.wwd.navigator.heading = Number(wmt.configuration.startupHeading);
            this.wwd.navigator.tilt = Number(wmt.configuration.startupTilt);
            this.wwd.navigator.roll = Number(wmt.configuration.startupRoll);
            this.wwd.redraw();
        };
        /**
         * Resets the viewpoint to north up.
         */
        Globe.prototype.resetHeading = function () {
            this.wwd.navigator.heading = Number(0);
            this.wwd.redraw();
        };
        /**
         * Resets the viewpoint to north up and nadir.
         */
        Globe.prototype.resetHeadingAndTilt = function () {
            // Tilting the view will change the location due to a bug in 
            // the early release of WW.  So we set the location to the 
            // current crosshairs position (viewpoint) to resolve this issue
            var viewpoint = this.getViewpoint(),
                lat = viewpoint.target.latitude,
                lon = viewpoint.target.longitude;
            this.wwd.navigator.heading = 0;
            this.wwd.navigator.tilt = 0;
            this.wwd.redraw(); // calls applyLimits which changes the location

            this.lookAt(lat, lon);
        };
        Globe.prototype.setFocus = function () {
            this.wwd.canvas.focus();
        };
        /**
         * Establishes the projection for this globe.
         * @param {String} projectionName A PROJECTION_NAME_* constant.
         */
        Globe.prototype.setProjection = function (projectionName) {
            if (projectionName === wmt.PROJECTION_NAME_3D) {
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

                if (projectionName === wmt.PROJECTION_NAME_EQ_RECT) {
                    this.flatGlobe.projection = new WorldWind.ProjectionEquirectangular();
                } else if (projectionName === wmt.PROJECTION_NAME_MERCATOR) {
                    this.flatGlobe.projection = new WorldWind.ProjectionMercator();
                } else if (projectionName === wmt.PROJECTION_NAME_NORTH_POLAR) {
                    this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("North");
                } else if (projectionName === wmt.PROJECTION_NAME_SOUTH_POLAR) {
                    this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("South");
                } else if (projectionName === wmt.PROJECTION_NAME_NORTH_UPS) {
                    this.flatGlobe.projection = new WorldWind.ProjectionUPS("North");
                } else if (projectionName === wmt.PROJECTION_NAME_SOUTH_UPS) {
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
