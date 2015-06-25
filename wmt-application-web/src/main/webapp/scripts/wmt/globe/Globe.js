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

define([
    '../globe/DnDController',
    '../globe/EnhancedLookAtNavigator',
    '../globe/EnhancedTextSupport',
    '../globe/EnhancedViewControlsLayer',
    '../globe/ReticuleLayer',
    '../globe/SelectController',
    '../globe/SkyBackgroundLayer',
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        DnDController,
        EnhancedLookAtNavigator,
        EnhancedTextSupport,
        EnhancedViewControlsLayer,
        ReticuleLayer,
        SelectController,
        SkyBackgroundLayer,
        Wmt,
        ww) {
        "use strict";
        /**
         * Creates a Globe object which manages the WorldWindow object: wwd.
         * @constructor
         * @param {String} canvasName The canvas element ID for the WorldWindow canvas.
         * @returns {Globe}
         */
        var Globe = function (canvasName) {
            // Create the World Window
            this.wwd = new WorldWind.WorldWindow(canvasName);
            
            // Override the default TextSupport with our custom verion that draws outline text
            this.wwd.drawContext.textSupport = new EnhancedTextSupport();

            // TODO: Change to globe controllers instead of wwd controllers.
            this.wwd.highlightController = new WorldWind.HighlightController(this.wwd);
            this.wwd.selectController = new SelectController(this.wwd);
            this.wwd.dndController = new DnDController(this.wwd);

            // Add the custom navigator after the select controller so the select controller can
            // consume the mouse events and preempt the pan/drag operation during object move operations.
            this.wwd.navigator = new EnhancedLookAtNavigator(this.wwd);

            // Create the default layers
            var self = this,
                layer,
                layers = [
                    {layer: new SkyBackgroundLayer(this.wwd), enabled: true, hide: true},
                    {layer: new WorldWind.BMNGLayer(), enabled: true, hide: true},
                    {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
                    {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
                    {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
                    {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
                    {layer: new WorldWind.RenderableLayer(Wmt.MARKERS_LAYER_NAME), enabled: true},
                    {layer: new WorldWind.RenderableLayer(Wmt.WEATHER_LAYER_NAME), enabled: true},
                    {layer: new ReticuleLayer(), enabled: true, hide: true},
                    {layer: new EnhancedViewControlsLayer(this.wwd), enabled: true, hide: true}
                ];
            // Add imagery layers to WorldWindow
            for (layer = 0; layer < layers.length; layer += 1) {
                layers[layer].layer.enabled = layers[layer].enabled;
                // Hide background and control layers in the menu 
                if (layers[layer].hide) {
                    layers[layer].layer.hide = layers[layer].hide;
                }
                this.wwd.addLayer(layers[layer].layer);
            }

            // Add event handler to redraw the WorldWindow during resize events
            // to prevent the canvas from looking distorted
            window.onresize = function () {
                self.wwd.redraw();
            };
        };

        return Globe;
    }
);
