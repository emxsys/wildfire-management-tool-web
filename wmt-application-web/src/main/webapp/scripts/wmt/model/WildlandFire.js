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

/*global define, WorldWind*/

define([
    'wmt/util/ContextSensitive',
    'wmt/util/Openable',
    'wmt/util/Log',
    'wmt/util/Messenger',
    'wmt/util/WmtUtil'],
    function (
        contextSensitive,
        openable,
        log,
        messenger,
        util) {
        "use strict";

        var WildlandFire = function (feature) {
            var attributes = feature.attributes || {},
                i, numRings, ring,
                j, numPoints,
                minLat, maxLat,
                minLon, maxLon;

            // Make openable via menus: Fires the EVENT_OBJECT_OPENED event on success.
            openable.makeOpenable(this, function () {
                messenger.infoGrowl("The open feature has not been implemented yet.", "Sorry");
                return false;
            });

            // Make context sensiive by the SelectController: shows the context menu.
            contextSensitive.makeContextSenstive(this, function () {
                messenger.infoGrowl("Show menu with delete, open, and lock/unlock", "TODO");
            });

            /**
             * The unique id used to identify this particular object within WMTweb session. It is not persistant.
             */
            this.id = util.guid();

            // First attempt to assign a "large fire point", the the "current fire perimeter" attribute
            this.name = attributes.incidentname || attributes.fire_name || 'Fire';
            this.number = attributes.uniquefireidentifier || attributes.inc_num || 'Unknown';
            this.geometry = feature.geometry;
            
            // Create the composite weather map symbol components
            if (feature.geometry.x && feature.geometry.y) {
                this.latitude = feature.geometry.y;
                this.longitude = feature.geometry.x;
                this.type = 'point';
            } else if (feature.geometry.rings) {
                minLat = Number.MAX_VALUE;
                minLon = Number.MAX_VALUE;
                maxLat = -Number.MAX_VALUE;
                maxLon = -Number.MAX_VALUE;
                for (i = 0, numRings = feature.geometry.rings.length; i < numRings; i++) {
                    ring = feature.geometry.rings[i];
                    for (j = 0, numPoints = ring.length; j < numPoints; j++) {
                        minLat = Math.min(minLat,ring[j][1]);
                        maxLat = Math.max(maxLat,ring[j][1]);
                        minLon = Math.min(minLon,ring[j][0]);
                        maxLon = Math.max(maxLon,ring[j][0]);
                    }
                }
                this.extents = new WorldWind.Sector(minLat, maxLat, minLon, maxLon);
                this.latitude = extents.centroidLatitude();
                this.longitude = extents.centroidLongitude();
                this.type = 'polygon';
            }
        };


        return WildlandFire;

    }
);

