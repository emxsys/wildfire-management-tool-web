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
    'wmt/util/Publisher',
    'wmt/model/FireLookout',
    'wmt/Wmt'],
    function (
        publisher,
        FireLookout,
        wmt) {
        "use strict";
        var FireLookoutManager = function (model) {
            // Mix-in Publisher capability (publish/subscribe pattern)
            publisher.makePublisher(this);
            this.model = model;
            this.lookouts = [];

        };

        /**
         * Adds the given lookout to to the manager.
         * @param {FireLookout} lookout
         */
        FireLookoutManager.prototype.addLookout = function (lookout) {
            // Ensure we have a unique name by appending a (n) to duplicates.
            lookout.name = this.generateUniqueName(lookout.name || "Fire Lookout");

            // Subscribe to removal notifications
            lookout.on(wmt.EVENT_OBJECT_REMOVED, this.removeLookout, this);

            // Manage this object
            this.lookouts.push(lookout);

            this.fire(wmt.EVENT_FIRE_LOOKOUT_ADDED, lookout);
        };

        /**
         * Finds the fire lookout with the given id.
         * @param {String} id System assigned id for the lookout.
         * @returns {FireLookout} The lookout object if found, else null.
         */
        FireLookoutManager.prototype.findLookout = function (id) {
            var lookout, i, len;

            for (i = 0, len = this.lookouts.length; i < len; i += 1) {
                lookout = this.lookouts[i];
                if (lookout.id === id) {
                    return lookout;
                }
            }
            return null;
        };

        /**
         * Removes the given lookout from the manager.
         * @param {FireLookout} lookout
         * @returns {Boolean}
         */
        FireLookoutManager.prototype.removeLookout = function (lookout) {
            var i, max,
                removed;

            // Find the lookout item with the given id (should create an associative array)
            for (i = 0, max = this.lookouts.length; i < max; i++) {
                if (this.lookouts[i].id === lookout.id) {
                    removed = this.lookouts.splice(i, 1);
                    break;
                }
            }
            if (removed && removed.length > 0) {
                // Remove our subscription/reference to the lookout
                lookout.cancelSubscription(wmt.EVENT_OBJECT_REMOVED, this.removeLookout, this);
                // Notify others.
                this.fire(wmt.EVENT_FIRE_LOOKOUT_REMOVED, removed[0]);
                return true;
            }
            return false;
        };

        /**
         * Saves the fire lookouts collection to local storage.
         */
        FireLookoutManager.prototype.saveLookouts = function () {
            var validLookouts = this.lookouts.filter(
                function (lookout) {
                    return !lookout.invalid;
                }),
                string = JSON.stringify(validLookouts, ['id', 'name', 'duration', 'rules', 'latitude', 'longitude']);

            localStorage.setItem(wmt.FIRE_LOOKOUTS_STORAGE_KEY, string);
        };

        /**
         * Restores the fire lookouts collection from local storage.
         */
        FireLookoutManager.prototype.restoreLookouts = function () {
            var string = localStorage.getItem(wmt.FIRE_LOOKOUTS_STORAGE_KEY),
                array,
                i, max;
            if (!string || string === 'null') {
                return;
            }
            // Convert JSON array to array of FireLookout objects
            array = JSON.parse(string);
            for (i = 0, max = array.length; i < max; i++) {
                this.addLookout(new FireLookout(
                    array[i].name,
                    array[i].duration,
                    array[i].rules,
                    array[i].latitude,
                    array[i].longitude,
                    array[i].id));
            }
        };

        /**
         * Generates a unique name by appending a suffix '(n)'.
         * @param {String} name
         * @returns {String}
         */
        FireLookoutManager.prototype.generateUniqueName = function (name) {
            var uniqueName = name.trim(),
                isUnique,
                suffixes,
                seqNos,
                n,
                i,
                len;

            do {
                // Assume uniqueness, set to false if we find a matching name
                isUnique = true;

                for (i = 0, len = this.lookouts.length; i < len; i += 1) {
                    if (this.lookouts[i].name === uniqueName) {

                        isUnique = false;

                        // check for existing suffix '(n)' and increment
                        suffixes = uniqueName.match(/[(]\d+[)]$/);
                        if (suffixes) {
                            seqNos = suffixes[0].match(/\d+/);
                            n = parseInt(seqNos[0], 10) + 1;
                            uniqueName = uniqueName.replace(/[(]\d+[)]$/, '(' + n + ')');
                        } else {
                            // else if no suffix, create one
                            uniqueName += ' (2)';   // The first duplicate is #2
                        }
                        // Break out of for loop and recheck uniqueness
                        break;
                    }
                }
            } while (!isUnique);

            return uniqueName;
        };

        return FireLookoutManager;
    }
);

