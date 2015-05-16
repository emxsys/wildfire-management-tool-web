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
 *     - Neither the name of Bruce Schubert, Emxsys nor the names of its 
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

/*global define */

/**
 * The TerrainProvider module is responsible for obtaining the terrain at a given latitude and longitude.
 * 
 * @module TerrainProvider
 * @param {Object} Terrain 
 * @param {Object} WmtMath 
 * @param {Object} WorldWind 
 * @author Bruce Schubert
 */
define([
    './Terrain',
    '../util/WmtMath',
    '../../webworldwind/WorldWind'],
    function (
        Terrain,
        WmtMath,
        WorldWind) {
        "use strict";
        /**
         * @constructor
         * @param {WorldWindow} worldWindow Contains the globe that supplies the terrain model..
         * @returns {Terrain}
         */
        var TerrainProvider = function (worldWindow) {
            if (!worldWindow) {
                throw new WorldWind.ArgumentError(WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE,
                    "Navigator", "constructor", "missingWorldWindow"));
            }
            this.globe = worldWindow.globe;
        };
        /**
         * Computes a normal vector for a point on the terrain.
         * @param {Number} latitude Degrees.
         * @param {Number} longitude Degrees.
         * @returns {Vec3} terrain normal vector.
         */
        TerrainProvider.prototype.terrainNormalAtLatLon = function (latitude, longitude) {
            if (!latitude || !longitude) {
                throw new WorldWind.ArgumentError(
                    WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "Terrain", "terrainNormalAtLatLon", "missingCoordinate(s)"));
            }
            var n0 = new WorldWind.Location(latitude, longitude),
                n1 = new WorldWind.Location(),
                n2 = new WorldWind.Location(),
                n3 = new WorldWind.Location(),
                p1 = new WorldWind.Vec3(),
                p2 = new WorldWind.Vec3(),
                p3 = new WorldWind.Vec3(),
                SOUTH = 180,
                NW = -60,
                NE = 60,
                terrainNormal;
            // Establish three points that define a triangle around the center position
            // to be used for determining the slope and aspect of the terrain (roughly 10 meters per side)        
            WorldWind.Location.rhumbLocation(n0, SOUTH, -0.00005 * WorldWind.Angle.DEGREES_TO_RADIANS, n1);
            WorldWind.Location.rhumbLocation(n1, NW, -0.0001 * WorldWind.Angle.DEGREES_TO_RADIANS, n2);
            WorldWind.Location.rhumbLocation(n1, NE, -0.0001 * WorldWind.Angle.DEGREES_TO_RADIANS, n3);
            // Get the cartesian coords for the points
            this.globe.computePointFromPosition(n1.latitude, n1.longitude, this.elevationAtLatLon(n1.latitude, n1.longitude), p1);
            this.globe.computePointFromPosition(n2.latitude, n2.longitude, this.elevationAtLatLon(n2.latitude, n2.longitude), p2);
            this.globe.computePointFromPosition(n3.latitude, n3.longitude, this.elevationAtLatLon(n3.latitude, n3.longitude), p3);
            // Compute an upward pointing normal 
            terrainNormal = WorldWind.Vec3.computeTriangleNormal(p1, p2, p3);
            terrainNormal.negate(); // flip the direction

            return terrainNormal;
        };
        /**
         * Gets the elevation (meters) at the given latitude and longitude.
         * @public
         * @param {Number} latitude Latitude in degrees.
         * @param {Number} longitude Longitude in degrees.
         * @returns {Number} elevation in meters.
         */
        TerrainProvider.prototype.elevationAtLatLon = function (latitude, longitude) {
            return this.globe.elevationAtLocation(latitude, longitude);
        };
        /**
         * Gets the elevation, aspect and slope at the at the given latitude and longitude.
         * @@public
         * @param {Number} latitude Latitude in degrees.
         * @param {Number} longitude Longitude in degrees.
         * @returns {Object} elevation (meters), aspect (degrees), slope(degrees)
         */
        TerrainProvider.prototype.terrainAtLatLon = function (latitude, longitude) {
            if (!latitude || !longitude) {
                throw new WorldWind.ArgumentError(
                    WorldWind.Logger.logMessage(WorldWind.Logger.LEVEL_SEVERE, "Terrain", "terrainLatLon", "missingCoordinate(s)"));
            }
            var terrainNormal = new WorldWind.Vec3(),
                surfaceNormal = new WorldWind.Vec3(),
                northNormal = new WorldWind.Vec3(),
                perpendicular = new WorldWind.Vec3(),
                tempcross = new WorldWind.Vec3(),
                slope,
                aspect,
                direction,
                elevation;
            
            elevation = this.elevationAtLatLon(latitude, longitude);
            
            // Compute normal vectors for terrain, surface and north.
            terrainNormal = this.terrainNormalAtLatLon(latitude, longitude);
            this.globe.surfaceNormalAtLocation(latitude, longitude, surfaceNormal);
            this.globe.northTangentAtLocation(latitude, longitude, northNormal);
            
            // Compute terrain slope -- the delta between surface normal and terrain normal
            slope = WmtMath.angleBetween(terrainNormal, surfaceNormal);
            
            // Compute the terrain aspect -- get a perpendicular vector projected onto
            // surface normal which is in the same plane as the north vector and get delta.
            WmtMath.perpendicularTo(terrainNormal, surfaceNormal, perpendicular);
            aspect = WmtMath.angleBetween(perpendicular, northNormal);
            
            // Use dot product to determine aspect angle's sign (+/- 180)            
            tempcross.copy(surfaceNormal).cross(northNormal);
            direction = (tempcross.dot(perpendicular) < 0) ? 1 : -1;
            aspect = aspect * direction;
            
            //console.log("Slope: " + slope + ", Aspect: " + aspect);
            
            return new Terrain(latitude, longitude, elevation, aspect, slope);
        };
        return TerrainProvider;
    }
);
