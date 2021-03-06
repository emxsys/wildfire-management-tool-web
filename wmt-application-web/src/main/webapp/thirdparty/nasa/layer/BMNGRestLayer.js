/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports BMNGRestLayer
 * @version $Id: BMNGRestLayer.js 2939 2015-03-30 16:50:49Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../geom/Location',
        '../util/Logger',
        '../geom/Sector',
        '../layer/TiledImageLayer',
        '../util/LevelRowColumnUrlBuilder',
        '../util/WWUtil'
    ],
    function (ArgumentError,
              Location,
              Logger,
              Sector,
              TiledImageLayer,
              LevelRowColumnUrlBuilder,
              WWUtil) {
        "use strict";

        /**
         * Constructs a Blue Marble image layer that uses a REST interface to retrieve its imagery.
         * @alias BMNGRestLayer
         * @constructor
         * @augments TiledImageLayer
         * @classdesc Displays a Blue Marble image layer that spans the entire globe. The imagery is obtained from a
         * specified REST tile service.
         * See [LevelRowColumnUrlBuilder]{@link LevelRowColumnUrlBuilder} for a description of the REST interface.
         * @param {String} serverAddress The server address of the tile service. May be null, in which case the
         * current origin is used (see window.location).
         * @param {String} pathToData The path to the data directory relative to the specified server address.
         * May be null, in which case the server address is assumed to be the full path to the data directory.
         * @param {String} displayName The display name to associate with this layer.
         */
        var BMNGRestLayer = function (serverAddress, pathToData, displayName) {
            var cachePath = WWUtil.urlPath(serverAddress + "/" + pathToData);

            TiledImageLayer.call(this, Sector.FULL_SPHERE, new Location(45, 45), 5, "image/jpeg", cachePath, 256, 256);

            this.displayName = displayName;
            this.pickEnabled = false;
            this.urlBuilder = new LevelRowColumnUrlBuilder(serverAddress, pathToData);
        };

        BMNGRestLayer.prototype = Object.create(TiledImageLayer.prototype);

        return BMNGRestLayer;
    });