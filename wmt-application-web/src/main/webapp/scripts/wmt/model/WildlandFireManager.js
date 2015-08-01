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

/*global define*/

define([
    'wmt/resource/GeoMacResource',
    'wmt/util/Publisher',
    'wmt/model/WildlandFire',
    'wmt/Wmt'],
    function (
        geoMac,
        publisher,
        WildlandFire,
        wmt) {
        "use strict";
        var WildlandFireManager = function (model) {
            // Mix-in Publisher capability (publish/subscribe pattern)
            publisher.makePublisher(this);
            this.model = model;
            this.fires = [];

            var self = this,
                i, max, 
                feature;
            
            // Load the large fire points
            geoMac.activeFires(function (features) {
                for (i = 0, max = features.length; i < max; i++) {
                    feature = features[i];
                    self.addFire(new WildlandFire(feature));
                }
            }, false);  // async = false
            // Load the current fire perimeters
            geoMac.activeFirePerimeters(function (features) {
                for (i = 0, max = features.length; i < max; i++) {
                    feature = features[i];
                    self.addFire(new WildlandFire(feature));
                }
            }, false);  // async = false
        };


        /**
         * Adds the given fire to to the manager.
         * @param {WildlandFire} fire
         */
        WildlandFireManager.prototype.addFire = function (fire) {

            // Manage this object
            this.fires.push(fire);

            // Notify views of the new wx scount
            this.fire(wmt.EVENT_WILDLAND_FIRE_ADDED, fire);
        };

        /**
         * Finds the weather fire with the given id.
         * @param {String} id System assigned id for the fire.
         * @returns {WildlandFire} The fire object if found, else null.
         */
        WildlandFireManager.prototype.findFire = function (id) {
            var fire, i, len;

            for (i = 0, len = this.fires.length; i < len; i += 1) {
                fire = this.fires[i];
                if (fire.id === id) {
                    return fire;
                }
            }
            return null;
        };

        /**
         * Removes the given fire from the manager.
         * @param {WildlandFire} fire
         * @returns {Boolean}
         */
        WildlandFireManager.prototype.removeFire = function (fire) {
            var i, max,
                removed;

            // Find the fire item with the given id (should create an associative array)
            for (i = 0, max = this.fires.length; i < max; i++) {
                if (this.fires[i].id === fire.id) {
                    removed = this.fires.splice(i, 1);
                    break;
                }
            }
            if (removed && removed.length > 0) {
                // Remove our subscription/reference to the fire
                fire.cancelSubscription(wmt.EVENT_OBJECT_REMOVED, this.removeFire, this);
                // Notify others.
                this.fire(wmt.EVENT_WILDLAND_FIRE_REMOVED, removed[0]);
                return true;
            }
            return false;
        };

        /**
         * Invokes refresh on all the fires managed by this manager.
         */
        WildlandFireManager.prototype.refreshFires = function () {
            var i, max;

            for (i = 0, max = this.fires.length; i < max; i++) {
                this.fires[i].refresh();
            }
        };


        return WildlandFireManager;
    }
);

