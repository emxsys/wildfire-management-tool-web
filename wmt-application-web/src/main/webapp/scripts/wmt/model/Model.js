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

/*global define, $ */

/**
 * @module Model
 * 
 * @param {Object} Publisher - Mixin module providing publish/subscribe pattern.
 * @param {Object} Terrain
 * @param {Object} TerrainProvider
 * @param {Object} WorldWind
 * 
 * @author Bruce Schubert
 */
define([
    '../util/Log',
    '../util/Publisher',
    '../globe/Terrain',
    '../globe/TerrainProvider',
    '../../nasa/WorldWind'],
    function (
        Log,
        Publisher,
        Terrain,
        TerrainProvider,
        WorldWind) {
        "use strict";
        var Model = function (worldWindow) {

            // Mix-in Publisher capability (publish/subscribe pattern)
            Publisher.makePublisher(this);

            this.wwd = worldWindow;
            this.terrainProvider = new TerrainProvider(worldWindow);

            // Properties available for non-subscribers
            this.terrainAtReticule = new Terrain();
            this.terrainAtMouse = new Terrain();
            this.eyePosition = new WorldWind.Position();

        };

        Model.prototype.updateEyePosition = function () {
            // Compute the World Window's current eye position.
            var wwd = this.wwd,
                navigatorState = wwd.navigator.currentState(),
                eyePoint = navigatorState.eyePoint,
                eyePos = new WorldWind.Position(),
                terrainElev,
                safeEyePoint = new WorldWind.Vec3();

            wwd.globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], eyePos);

            if (!eyePos.equals(this.eyePosition)) {
                // Validate the eye position to ensure it doesn't go below the terrain surface
                terrainElev = wwd.globe.elevationAtLocation(eyePos.latitude, eyePos.longitude);
                if (eyePos.altitude < terrainElev) {
                    Log.error("Model", "updateEyePosition", "eyePos (" + eyePos.altitude + ") is below ground level (" + terrainElev + ").");

                    wwd.globe.computePointFromPosition(eyePos.latitude, eyePos.longitude, terrainElev + 1, safeEyePoint);

                }

                // Persist a copy of the new position in our model for non-subscribers
                this.eyePosition.copy(eyePos);
                // Update eyeMoved subscribers
                this.fire("eyeMoved", eyePos);
            }
        };

        /**
         * Updates the reticuleTerrain property and fires a "reticuleMoved" event.
         */
        Model.prototype.updateTerrainUnderReticule = function () {
// The look-at-position is in question... 
//            var pos = this.wwd.navigator.lookAtPosition,
//                terrain = this.terrainProvider.terrainAtLatLon(
//                    pos.latitude,
//                    pos.longitude),
            var centerPoint = new WorldWind.Vec2(this.wwd.canvas.width / 2, this.wwd.canvas.height / 2),
                terrainObject = this.wwd.pickTerrain(centerPoint).terrainObject(),
                terrain;

            if (terrainObject) {
                terrain = this.terrainProvider.terrainAtLatLon(
                    terrainObject.position.latitude,
                    terrainObject.position.longitude);
            } else {
                terrain = new Terrain();
                terrain.copy(Terrain.INVALID);
            }

            // Persist a copies of the terrain in our model for non-subscribers
            this.terrainAtReticule.copy(terrain);

            // Update subscribers
            this.fire("reticuleMoved", terrain);
        };

        /**
         * Updates the mouseTerrain property and fires a "mousedMoved" event.
         * @param {Vec2} mousePoint Mouse point or touchpoint coordiantes.
         */
        Model.prototype.updateTerrainUnderMouse = function (mousePoint) {
            var wwd = this.wwd,
                terrainObject,
                terrain;


            terrainObject = wwd.pickTerrain(mousePoint).terrainObject();

            if (terrainObject) {
                terrain = this.terrainProvider.terrainAtLatLon(
                    terrainObject.position.latitude,
                    terrainObject.position.longitude);
            } else {
                terrain = new Terrain();
                terrain.copy(Terrain.INVALID);
            }

            // Persist a copy of the terrain in our model for non-subscribers
            this.terrainAtMouse.copy(terrain);

            // Update subscribers
            this.fire("mouseMoved", terrain);
        };
        return Model;
    }
);