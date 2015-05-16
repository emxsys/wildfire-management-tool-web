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
    '../util/Publisher',
    '../globe/Terrain',
    '../globe/TerrainProvider',
    '../../webworldwind/WorldWind'],
    function (
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

            // Terrain property available for non-subscribers
            this.reticuleTerrain = new Terrain();
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

            // Persist a copy of the terrain in our model for non-subscribers
            this.reticuleTerrain.copy(terrain);

            // Update subscribers
            this.fire("reticuleMoved", terrain);
        };
        return Model;
    }
);