/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: Explorer.js 3067 2015-05-06 00:17:49Z dcollins $
 */
define([
    '../thirdparty/webworldwind/WorldWind',
    './layermanager/LayerManager',
    './globe/CoordinateController',
    './globe/CrosshairsLayer',
    './globe/CrosshairsController'], function (
    WorldWind,
    LayerManager,
    CoordinateController,
    CrosshairsLayer,
    CrosshairsController
    ) {
    "use strict";
    var WMT = function () {
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);
        // Create the World Window.
        this.wwd = new WorldWind.WorldWindow("canvasOne");
        /**
         * Added imagery layers.
         */
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new CrosshairsLayer(), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(this.wwd), enabled: true}
        ];
        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            this.wwd.addLayer(layers[l].layer);
        }

        this.wwd.redraw();
        this.layerManager = new LayerManager(this.wwd);
        this.coordinateController = new CoordinateController(this.wwd);
        this.crosshairsController = new CrosshairsController(this.wwd);

        var pos = this.crosshairsController.crosshairsPosition;

        window.alert(pos.latitude);


        var self = this;
        // Setup event handlers 
        window.onbeforeunload = self.handleUnload;
        // Restore the location of the crosshairs
        self.restoreLocation();
    };


    WMT.prototype.restoreLocation = function () {
        if (!navigator.cookieEnabled) {
            return;
        }
        var lat = getCookie("latitude"),
            lon = getCookie("longitude");

        if (!lat || !lon) {
            return;
        }
        this.wwd.navigator.lookAtPosition = new Position(lat, lon, 0);
    };


    WMT.prototype.handleUnload = function () {
        // Store date/time and eye position in a cookie.
        // Precondition: Cookies must be enabled
        if (!navigator.cookieEnabled) {
            return null;
        }
        // TODO: save position...
        //var pos = this.crosshairsController.crosshairsPosition;
        //setCookie("latitude", pos.latitude, 100);
        //setCookie("longitude", pos.longitude, 100);

        // TODO: save eye altitude...

        // TODO: globe rotation and tilt...

        // TODO: save date/time

        // return null to close quietly
        return null;
    };


    function setCookie(cookieName, cookieValue, expirationDays) {
        var d = new Date();
        d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + "; " + expires;
    }


    function getCookie(cookieName) {
        // Establish the text to search for
        var name = cookieName + "=";
        // Split the cookie property into an array 
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookieKeyValue = cookies[i];
            // Strip/trim spaces
            while (cookieKeyValue.charAt(0) == ' ') {
                cookieKeyValue = cookieKeyValue.substring(1);
            }

            if (cookieKeyValue.indexOf(name) == 0) {
                return cookieKeyValue.substring(name.length, cookieKeyValue.length);
            }
        }
        return "";
    }

    return WMT;
});
        