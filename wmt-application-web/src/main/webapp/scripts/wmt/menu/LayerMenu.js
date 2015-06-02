/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

/*global define, $ */

/**
 * The LayerManager manifests buttons to show/hide the World Wind layers.
 * @module LayerManager
 * @param {Object} WorldWind
 * @version $Id: LayerManager.js 3064 2015-05-05 20:54:52Z tgaskins $
 */
define(['../../nasa/WorldWind'], function (WorldWind) {
    "use strict";
    /**
     * Constructs a layer manager for a specified {@link WorldWindow}.
     * @alias LayerManager
     * @constructor
     * @classdesc Provides a layer manager to interactively control layer visibility for a World Window.
     * @param {WorldWindow} worldWindow The World Window to associated this layer manager with.
     */
    var LayerMenu = function (worldWindow) {
        var self = this;

        this.wwd = worldWindow;

        // Populate the Layers menu with menu items
        this.synchronizeLayerList();

        // Attach a click handler to the new layer menu items
        $('#layerList').find('li').on('click', function (event) {
            self.onLayerClick($(this));
        });
    };

    LayerMenu.prototype.onLayerClick = function (layerItem) {
        var layerName = layerItem.text(),
            i,
            len,
            layer;

        // Update the layer state for the selected layer.
        for (i = 0, len = this.wwd.layers.length; i < len; i++) {
            layer = this.wwd.layers[i];
            if (layer.displayName === layerName) {
                layer.enabled = !layer.enabled;
                this.highlightLayer(layer, layerItem);
                this.wwd.redraw();
            }
        }
    };

    LayerMenu.prototype.synchronizeLayerList = function () {
        var layerListItem = $("#layerList"),
            layerItem,
            layer,
            i,
            len;

        layerListItem.remove('a');

        // Synchronize the displayed layer list with the World Window's layer list.
        for (i = 0, len = this.wwd.layers.length; i < len; i++) {
            layer = this.wwd.layers[i];
            layerItem = $('<li class="list-group-item">' + layer.displayName + '</li>');
//            layerItem = $('<label><input type="checkbox"/>' + layer.displayName + '</label>');
//            layerItem = $('<button class="list-group-item btn btn-block">' + layer.displayName + '</button>');
            layerListItem.append(layerItem);
            this.highlightLayer(layer, layerItem);
            this.wwd.redraw();
        }
    };

    LayerMenu.prototype.highlightLayer = function (layer, layerItem) {
        if (layer.enabled) {
            layerItem.addClass("active");
        } else {
            layerItem.removeClass("active");
        }
    };

    return LayerMenu;
});