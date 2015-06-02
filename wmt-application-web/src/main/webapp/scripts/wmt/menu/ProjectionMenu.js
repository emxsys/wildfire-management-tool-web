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
    var ProjectionMenu = function (worldWindow) {
        var self = this;

        this.wwd = worldWindow;
        this.roundGlobe = this.wwd.globe;

        // Create the list of supported projections
        this.createProjectionList();
        // Add event handlers to the list items
        $("#projectionDropdown").find(" li").on("click", function (e) {
            self.onProjectionClick(e);
        });

    };

    ProjectionMenu.prototype.onProjectionClick = function (event) {
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

    ProjectionMenu.prototype.createProjectionList = function () {
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

    return ProjectionMenu;
});