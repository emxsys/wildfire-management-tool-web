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
    'require',
    'wmt/util/ContextSensitive',
    'wmt/resource/GeoMacResource',
    'wmt/util/Openable',
    'wmt/util/Log',
    'wmt/util/Messenger',
    'wmt/util/WmtUtil',
    'wmt/Wmt'],
    function (
        require,
        contextSensitive,
        geoMac,
        openable,
        log,
        messenger,
        util,
        wmt) {
        "use strict";

        var WildlandFire = function (feature) {
            var attributes = feature.attributes || {};

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
            this.name = attributes.incidentname
                || attributes.fire_name
                || 'Fire';
            this.state = attributes.state || attributes.inc_num.substr(0,2);
            this.number = attributes.uniquefireidentifier
                || attributes.inc_num
                || 'Unknown';
            this.featureId = attributes.objectid;
            this.featureType = attributes.incidentname ? wmt.WILDLAND_FIRE_POINT : wmt.WILDLAND_FIRE_PERIMETER;

            // If the feature has geometry then process it, otherwise defer until needed
            if (feature.geometry) {
                this.processGeometry(feature.geometry);
            } else {
                this.geometryType = wmt.GEOMETRY_UNKNOWN;
                this.geometry = null;
                this.extents = null;
            }
        };
        /**
         * 
         * @param {type} deferred
         */
        WildlandFire.prototype.loadDeferredGeometry = function (deferred) {
            var self = this;
            if (this.featureType === wmt.WILDLAND_FIRE_POINT) {
                geoMac.getActiveFireFeature(this.featureId,
                    function (feature) {
                        self.processGeometry(feature.geometry);
                        if (deferred) {
                            deferred.resolve(self);
                        }
                    });
            }
            else if (this.featureType === wmt.WILDLAND_FIRE_PERIMETER) {
                geoMac.getActivePerimeterFeature(this.featureId,
                    function (feature) {
                        self.processGeometry(feature.geometry);
                        if (deferred) {
                            deferred.resolve(self);
                        }
                    });
            }
        };
        /**
         * 
         * @param {type} geometry
         * @returns {undefined}
         */
        WildlandFire.prototype.processGeometry = function (geometry) {
            var i, numRings, ring,
                j, numPoints,
                minLat, maxLat,
                minLon, maxLon;

            this.geometry = geometry;

            if (geometry.x && geometry.y) {
                this.geometryType = wmt.GEOMETRY_POINT;

                // Set the "goto" locaiton
                this.latitude = geometry.y;
                this.longitude = geometry.x;
                this.extents = null;

            } else if (geometry.rings) {
                this.geometryType = wmt.GEOMETRY_POLYGON;

                // Compute the extents
                minLat = Number.MAX_VALUE;
                minLon = Number.MAX_VALUE;
                maxLat = -Number.MAX_VALUE;
                maxLon = -Number.MAX_VALUE;
                for (i = 0, numRings = geometry.rings.length; i < numRings; i++) {
                    ring = geometry.rings[i];
                    for (j = 0, numPoints = ring.length; j < numPoints; j++) {
                        minLat = Math.min(minLat, ring[j][1]);
                        maxLat = Math.max(maxLat, ring[j][1]);
                        minLon = Math.min(minLon, ring[j][0]);
                        maxLon = Math.max(maxLon, ring[j][0]);
                    }
                }
                this.extents = new WorldWind.Sector(minLat, maxLat, minLon, maxLon);

                // Set the "goto" locaiton
                this.latitude = this.extents.centroidLatitude();
                this.longitude = this.extents.centroidLongitude();
            }
        };


        WildlandFire.prototype.goto = function () {
            var controller = require("wmt/controller/Controller"),
                deferred = $.Deferred();

            if (this.geometry) {
                controller.lookAtLatLon(this.latitude, this.longitude);
            } else {
                // Load the geometry
                this.loadDeferredGeometry(deferred);
                $.when(deferred).done(function (self) {
                    controller.lookAtLatLon(self.latitude, self.longitude);
                });

            }
        };


        return WildlandFire;

    }
);

