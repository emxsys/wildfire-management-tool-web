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
 * Web Application.
 * 
 * @module {app}
 * 
 * @param {Object} controller
 * @param {Object} Globe
 * @param {Object} uiManager
 * 
 * @author Bruce Schubert
 */
define([
    'ojs/ojcore', 'knockout', 'jquery',
    'wmt/controller/Controller',
    'wmt/layers/GeoMacCurrentPerimetersLayer',
    'wmt/layers/GeoMacHistoricPerimetersLayer',
    'wmt/layers/GeoMacHmsThermalSatelliteLayer',
    'wmt/layers/GeoMacModisThermalSatelliteLayer',
    'wmt/layers/GeoMacPreviousPerimetersLayer',
    'wmt/earth/Globe',
    'wmt/layers/LandfireLayer',
    'wmt/ui/UIManager',
    'wmt/layers/UsgsContoursLayer',
    'wmt/layers/UsgsImageryTopoBaseMapLayer',
    'wmt/layers/UsgsTopoBaseMapLayer',
    'wmt/Wmt'
],
    function (
        oj, ko, $,
        controller,
        GeoMacCurrentPerimetersLayer,
        GeoMacHistoricPerimetersLayer,
        GeoMacHmsThermalSatelliteLayer,
        GeoMacModisThermalSatelliteLayer,
        GeoMacPreviousPerimetersLayer,
        Globe,
        LandfireLayer,
        uiManager,
        UsgsContoursLayer,
        UsgsImageryTopoBaseMapLayer,
        UsgsTopoBaseMapLayer,
        wmt) {
        "use strict";
        var WmtApp = function () {

            // Create the primary globe
            var globeOptions = {
                showBackground: true,
                showReticule: true,
                showViewControls: true,
                includePanControls: wmt.configuration.showPanControl,
                includeRotateControls: true,
                includeTiltControls: true,
                includeZoomControls: true,
                includeExaggerationControls: wmt.configuration.showExaggerationControl,
                includeFieldOfViewControls: wmt.configuration.showFiewOfViewControl};

            this.globe = new Globe("canvasOne", globeOptions);

            this.globe.layerManager.addBaseLayer(new WorldWind.BMNGLayer(), {enabled: true, hideInMenu: true, detailHint: wmt.configuration.imageryDetailHint});            
            this.globe.layerManager.addBaseLayer(new WorldWind.BMNGLandsatLayer(), {enabled: false, detailHint: wmt.configuration.imageryDetailHint});
            this.globe.layerManager.addBaseLayer(new WorldWind.BingAerialWithLabelsLayer(null), {enabled: true, detailHint: wmt.configuration.imageryDetailHint});
            this.globe.layerManager.addBaseLayer(new UsgsImageryTopoBaseMapLayer(), {enabled: false, detailHint: wmt.configuration.imageryDetailHint});
            this.globe.layerManager.addBaseLayer(new UsgsTopoBaseMapLayer(), {enabled: false, detailHint: wmt.configuration.imageryDetailHint});
            this.globe.layerManager.addBaseLayer(new WorldWind.BingRoadsLayer(null), {enabled: false, opacity: 0.7, detailHint: wmt.configuration.imageryDetailHint});
            this.globe.layerManager.addBaseLayer(new WorldWind.OpenStreetMapImageLayer(null), {enabled: false, opacity: 0.7, detailHint: wmt.configuration.imageryDetailHint});

            this.globe.layerManager.addOverlayLayer(new LandfireLayer(), {enabled: false});
            this.globe.layerManager.addOverlayLayer(new UsgsContoursLayer(), {enabled: false});
            this.globe.layerManager.addOverlayLayer(new GeoMacHistoricPerimetersLayer(), {enabled: false, isTemporal: false});
            this.globe.layerManager.addOverlayLayer(new GeoMacPreviousPerimetersLayer(), {enabled: false, isTemporal: true});
            this.globe.layerManager.addOverlayLayer(new GeoMacCurrentPerimetersLayer(), {enabled: true, isTemporal: true});
            this.globe.layerManager.addOverlayLayer(new GeoMacModisThermalSatelliteLayer(), {enabled: false, isTemporal: true});
            this.globe.layerManager.addOverlayLayer(new GeoMacHmsThermalSatelliteLayer(), {enabled: false, isTemporal: true});

            this.globe.layerManager.addDataLayer(new WorldWind.RenderableLayer(wmt.LAYER_NAME_WILDLAND_FIRES), {enabled: true, pickEnabled: true});
            this.globe.layerManager.addDataLayer(new WorldWind.RenderableLayer(wmt.LAYER_NAME_WILDLAND_FIRE_PERIMETERS), {enabled: true, pickEnabled: false});
            this.globe.layerManager.addDataLayer(new WorldWind.RenderableLayer(wmt.LAYER_NAME_FIRE_BEHAVOR), {enabled: true, pickEnabled: true});
            this.globe.layerManager.addDataLayer(new WorldWind.RenderableLayer(wmt.LAYER_NAME_WEATHER), {enabled: true, pickEnabled: true});
            this.globe.layerManager.addDataLayer(new WorldWind.RenderableLayer(wmt.LAYER_NAME_MARKERS), {enabled: true, pickEnabled: true});

            this.globe.layerManager.addWidgetLayer(new WorldWind.RenderableLayer(wmt.LAYER_NAME_WIDGETS), {enabled: true, pickEnabled: false});

            // TODO: Get collection of layers from GIBS
            //new GlobalImageryBrowseServices(this.globe);

            // Now that the globe is setup, initialize the Model-View-Controller framework.
            // The controller will create model and the views on the primary globe. 
            controller.initialize(this.globe);

            // Initialize the Navbar, Sidebars and UI controls.
            // Do this AFTER the controller is initialized.
            uiManager.initialize();

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
            controller.restoreSession();
        };

        return WmtApp;
    }
);

