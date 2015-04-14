/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports SurfaceShapeTile
 * @version $Id: SurfaceShapeTile.js 3006 2015-04-10 19:13:53Z danm $
 */
define([
        '../geom/Angle',
        '../error/ArgumentError',
        '../util/Level',
        '../util/Logger',
        '../geom/Sector',
        '../render/Texture',
        '../render/TextureTile'
    ],
    function (Angle,
              ArgumentError,
              Level,
              Logger,
              Sector,
              Texture,
              TextureTile) {
        "use strict";

        /**
         * Constructs a surface shape tile.
         * @alias SurfaceShapeTile
         * @constructor
         * @classdesc Represents a texture map containing renditions of surface shapes applied to a portion of a globe's terrain.
         * @param {Sector} sector The sector this tile covers.
         * @param {Level} level The level this tile is associated with.
         * @param {number} row This tile's row in the associated level.
         * @param {number} column This tile's column in the associated level.
         * @throws {ArgumentError} If the specified sector or level is null or undefined, the row or column arguments
         * are less than zero, or the specified image path is null, undefined or empty.
         *
         */
        var SurfaceShapeTile = function(sector, level, row, column) {
            TextureTile.call(this, sector, level, row, column); // args are checked in the superclass' constructor

            /**
             * The surface shapes that affect this tile.
             * @type {SurfaceShape[]}
             */
            this.surfaceShapes = [];

            /**
             * The sector that bounds this tile.
             * @type {Sector}
             */
            this.sector = sector;

            /**
             * A collection of sectors that bounds this title, dealing potentially with the crossing of the dateline.
             * @type {Array}
             */
            this.sectors = [];

            /**
             * A string to use as a cache key.
             * @type {string}
             */
            this.cacheKey = null;

            /**
             * Internal use only. Intentionally not documented.
             * @type {number}
             */
            this.pickSequence = 0;

            // Internal use only. Intentionally not documented.
            this.lastUpdatedTime = 0;

            // Internal use only. Intentionally not documented.
            this.prevSurfaceShapes = [];

            this.createCtx2D();
        };

        SurfaceShapeTile.prototype = Object.create(TextureTile.prototype);

        /**
         * Clear all collected surface shapes.
         */
        SurfaceShapeTile.prototype.clearShapes = function() {
            // Exchange previous and next surface shape lists to avoid allocating memory.
            var swap = this.prevSurfaceShapes;
            this.prevSurfaceShapes = this.surfaceShapes;
            this.surfaceShapes = swap;

            // Clear out next surface shape list.
            this.surfaceShapes.splice(0, this.surfaceShapes.length);
        };

        /**
         * Query whether any surface shapes have been collected.
         * @returns {boolean} Returns true if there are collected surface shapes.
         */
        SurfaceShapeTile.prototype.hasShapes = function() {
            return this.surfaceShapes.length > 0;
        };

        /**
         *
         * @returns {SurfaceShape[]} The collection of surface shapes collected by this tile.
         */
        SurfaceShapeTile.prototype.getShapes = function() {
            return this.surfaceShapes;
        };

        /**
         * The sector that bounds this tile.
         * @returns {Sector}
         */
        SurfaceShapeTile.prototype.getSector = function() {
            return this.sector;
        };

        /**
         * Add a surface shape to this tile's collection of surface shapes.
         * @param {SurfaceShape} surfaceShape The surface shape to add.
         */
        SurfaceShapeTile.prototype.addSurfaceShape = function(surfaceShape) {
            this.surfaceShapes.push(surfaceShape);
        };

        /**
         * Add multiple surface shapes to this tile's collection.
         * @param {SurfaceShape[]} shapes A collection of surface shapes to add to the collection of this tile.
         */
        SurfaceShapeTile.prototype.addAllSurfaceShapes = function(shapes) {
            this.surfaceShapes.concat(shapes);
        };

        // Internal use only. Intentionally not documented.
        SurfaceShapeTile.prototype.needsUpdate = function(dc) {
            var idx, len, surfaceShape;

            // If the number of shapes have changed, ... (cheap test)
            if (this.prevSurfaceShapes.length != this.surfaceShapes.length) {
                return true;
            }

            // If previous shapes have been removed, ...
            for (idx = 0, len = this.prevSurfaceShapes; idx < len; idx += 1) {
                surfaceShape = this.prevSurfaceShapes[idx];

                if (this.surfaceShapes.indexOf(surfaceShape) < 0) {
                    return true;
                }
            }

            // If next shapes added, ...
            for (idx = 0, len = this.surfaceShapes; idx < len; idx += 1) {
                surfaceShape = this.surfaceShapes[idx];

                if (this.prevSurfaceShapes.indexOf(surfaceShape) < 0) {
                    return true;
                }
            }

            // If the time stamp of the shape is newer than the time stamp of the tile, ...
            for (idx = 0, len = this.surfaceShapes.length; idx < len; idx += 1) {
                surfaceShape = this.surfaceShapes[idx];
                if (surfaceShape.lastUpdatedTime > this.lastUpdatedTime) {
                    return true;
                }
            }

            // If a texture does not already exist, ...
            if (!this.hasTexture(dc)) {
                return true;
            }

            // If you get here, the texture can be reused.
            return false;
        };

        /**
         * Determine whether the surface shape tile has a valid texture.
         * @param {DrawContext} dc The draw context.
         * @returns {boolean} True if the surface shape tile has a valid texture, else false.
         */
        SurfaceShapeTile.prototype.hasTexture = function(dc) {
            if (dc.pickingMode) {
                return false;
            }

            var gpuResourceCache = dc.gpuResourceCache;

            if (!this.gpuCacheKey) {
                this.gpuCacheKey = this.getCacheKey();
            }

            var texture = gpuResourceCache.resourceForKey(this.gpuCacheKey);

            return !texture ? false : true;
        };

        /**
         * Return the texture for rendering this tile. If one does not exist, create a new texture.
         * @param {DrawContext} dc The draw context
         * @returns {Texture} The texture for displaying the tile.
         */
        SurfaceShapeTile.prototype.getTexture = function(dc) {
            if (dc.pickingMode) {
                return this.updateTexture(dc);
            }
            else {
                var gpuResourceCache = dc.gpuResourceCache;

                if (!this.gpuCacheKey) {
                    this.gpuCacheKey = this.getCacheKey();
                }

                var texture = gpuResourceCache.resourceForKey(this.gpuCacheKey);

                if (!texture) {
                    texture = this.updateTexture(dc);
                }

                return texture;
            }
        };

        /**
         * Redraw all of the surface shapes onto the texture for this tile.
         * @param {DrawContext} dc
         * @returns {Texture}
         */
        SurfaceShapeTile.prototype.updateTexture = function(dc) {
            var gl = dc.currentGlContext,
                canvas = SurfaceShapeTile.canvas;

            canvas.width = this.tileWidth;
            canvas.height = this.tileHeight;

            var ctx2D = SurfaceShapeTile.ctx2D;

            // Mapping from lat/lon to x/y:
            //  lon = minlon => x = 0
            //  lon = maxLon => x = 256
            //  lat = minLat => y = 256
            //  lat = maxLat => y = 0
            //  (assuming texture size is 256)
            // So:
            //  x = 256 / sector.dlon * (lon - minLon)
            //  y = -256 / sector.dlat * (lat - maxLat)
            var xScale = this.tileWidth / this.sector.deltaLongitude(),
                yScale = -this.tileHeight / this.sector.deltaLatitude(),
                xOffset = -this.sector.minLongitude * xScale,
                yOffset = -this.sector.maxLatitude * yScale;

            for (var idx = 0, len = this.surfaceShapes.length; idx < len; idx += 1) {
                var shape = this.surfaceShapes[idx];

                shape.renderToTexture(dc, ctx2D, xScale, yScale, xOffset, yOffset);
            }

            var texture = new Texture(gl, canvas);

            var gpuResourceCache = dc.gpuResourceCache;

            this.gpuCacheKey = this.getCacheKey();

            gpuResourceCache.putResource(this.gpuCacheKey, texture, texture.size);

            this.lastUpdatedTime = Date.now();

            return texture;
        };

        /**
         * Get a key suitable for cache look-ups.
         * @returns {string}
         */
        SurfaceShapeTile.prototype.getCacheKey = function() {
            if (!this.cacheKey) {
                this.cacheKey = "SurfaceShapeTile:" +
                this.tileKey + "," +
                this.pickSequence.toString();
            }

            return this.cacheKey;
        };

        /**
         * Create a new canvas and its 2D context on demand.
         */
        SurfaceShapeTile.prototype.createCtx2D = function() {
            // If the context was previously created, ...
            if (!SurfaceShapeTile.ctx2D) {
                SurfaceShapeTile.canvas = document.createElement("canvas");
                SurfaceShapeTile.ctx2D = SurfaceShapeTile.canvas.getContext("2d");
            }
        };

        /*
         * For internal use only.
         * 2D canvas and context, which is created lazily on demand.
         */
        SurfaceShapeTile.canvas = null;
        SurfaceShapeTile.ctx2D = null;

        return SurfaceShapeTile;
    }
);