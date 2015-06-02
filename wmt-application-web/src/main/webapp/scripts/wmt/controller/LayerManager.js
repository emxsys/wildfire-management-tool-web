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
    var LayerManager = function (worldWindow) {
        var self = this;

        this.wwd = worldWindow;

        this.roundGlobe = this.wwd.globe;

        this.createProjectionList();
        $("#projectionDropdown").find("button").on("click", function (e) {
            self.onProjectionClick(e);
        });


        // Populate the Layers menu with menu items
        this.synchronizeLayerList();

        // Attach a click handler to the new layer menu items
        $('#layerList').find('button').on('click', function (event) {
            self.onLayerClick($(this));
        });
    };

    LayerManager.prototype.onProjectionClick = function (event) {
        var projectionName = event.target.innerText || event.target.innerHTML;
        $("#projectionDropdown").find("button").html(projectionName + ' <span class="caret"></span>');

        if (projectionName === "3D") {
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

            if (projectionName === "Equirectangular") {
                this.flatGlobe.projection = new WorldWind.ProjectionEquirectangular();
            } else if (projectionName === "Mercator") {
                this.flatGlobe.projection = new WorldWind.ProjectionMercator();
            } else if (projectionName === "North Polar") {
                this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("North");
            } else if (projectionName === "South Polar") {
                this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("South");
            } else if (projectionName === "North UPS") {
                this.flatGlobe.projection = new WorldWind.ProjectionUPS("North");
            } else if (projectionName === "South UPS") {
                this.flatGlobe.projection = new WorldWind.ProjectionUPS("South");
            }

            if (this.wwd.globe !== this.flatGlobe) {
                this.wwd.globe = this.flatGlobe;
            }
        }

        this.wwd.redraw();
    };

    LayerManager.prototype.onLayerClick = function (layerItem) {
        var layerName = layerItem.text(),
            i,
            len,
            layer;

        // Update the layer state for the selected layer.
        for (i = 0, len = this.wwd.layers.length; i < len; i++) {
            layer = this.wwd.layers[i];
            if (layer.displayName === layerName) {
                layer.enabled = !layer.enabled;
                if (layer.enabled) {
                    layerItem.addClass("active");
                } else {
                    layerItem.removeClass("active");
                }
                this.wwd.redraw();
            }
        }
    };

    LayerManager.prototype.synchronizeLayerList = function () {
        var layerListItem = $("#layerList"),
            layerItem,
            layer,
            i,
            len;

        layerListItem.remove('a');

        // Synchronize the displayed layer list with the World Window's layer list.
        for (i = 0, len = this.wwd.layers.length; i < len; i++) {
            layer = this.wwd.layers[i];
            layerItem = $('<button class="list-group-item btn btn-block">' + layer.displayName + '</button>');
            layerListItem.append(layerItem);

            if (layer.enabled) {
                layerItem.addClass("active");
            } else {
                layerItem.removeClass("active");
            }
            this.wwd.redraw();
        }
    };

    LayerManager.prototype.createProjectionList = function () {
        var projectionNames = [
            "3D",
            "Equirectangular",
            "Mercator",
            "North Polar",
            "South Polar",
            "North UPS",
            "Soutn UPS"],
            projectionDropdown = $("#projectionDropdown"),
            ulItem = $('<ul class="dropdown-menu">'),
            dropdownButton = $('<button class="btn btn-info btn-block dropdown-toggle" type="button" data-toggle="dropdown">3D<span class="caret"></span></button>'),
            projectionItem,
            i;

        projectionDropdown.append(dropdownButton);
        projectionDropdown.append(ulItem);
        for (i = 0; i < projectionNames.length; i++) {
            projectionItem = $('<li><a >' + projectionNames[i] + '</a></li>');
            ulItem.append(projectionItem);
        }

        ulItem = $('</ul>');
        projectionDropdown.append(ulItem);
    };

    return LayerManager;
});