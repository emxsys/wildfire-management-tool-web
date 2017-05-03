/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports QuadTree
 */
define([
        '../../error/ArgumentError',
        '../../util/Logger',
        '../../geom/Sector'
    ],
    function (ArgumentError,
              Logger,
              Sector) {
        "use strict";

        var QuadTree = function (sector, level) {

            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "QuadTree", "constructor", "missingSector"));
            }

            this.sector = sector;

            this.level = level || 0;

            this.nodes = [];

            this.features = [];

            this.featureCount = 0;
        };

        QuadTree.prototype.subdivide = function () {
            var nextLevelLatSize = Math.abs((this.sector.maxLatitude - this.sector.minLatitude) / 2);
            var nextLevelLongSize = Math.abs((this.sector.maxLongitude - this.sector.minLongitude) / 2);

            this.nodes[0] = new QuadTree(
                new Sector(
                    this.sector.minLatitude,
                    this.sector.minLatitude + nextLevelLatSize,
                    this.sector.minLongitude,
                    this.sector.minLongitude + nextLevelLongSize
                ),
                this.level + 1
            );

            this.nodes[1] = new QuadTree(
                new Sector(
                    this.sector.minLatitude + nextLevelLatSize,
                    this.sector.maxLatitude,
                    this.sector.minLongitude,
                    this.sector.minLongitude + nextLevelLongSize
                ),
                this.level + 1
            );

            this.nodes[2] = new QuadTree(
                new Sector(
                    this.sector.minLatitude + nextLevelLatSize,
                    this.sector.maxLatitude,
                    this.sector.minLongitude + nextLevelLongSize,
                    this.sector.maxLongitude
                ),
                this.level + 1
            );

            this.nodes[3] = new QuadTree(
                new Sector(
                    this.sector.minLatitude,
                    this.sector.minLatitude + nextLevelLatSize,
                    this.sector.minLongitude + nextLevelLongSize,
                    this.sector.maxLongitude
                ),
                this.level + 1
            );
        };

        return QuadTree;
    });