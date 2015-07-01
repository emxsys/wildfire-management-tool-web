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
    'wmt/model/MarkerNode',
    'wmt/util/Publisher',
    'wmt/Wmt'],
    function (
        MarkerNode,
        Publisher,
        Wmt) {
        "use strict";
        /**
         * @constructor
         * @param {Model} model
         * @returns {MarkerManager}
         */
        var MarkerManager = function (model) {

            // Mix-in Publisher capability for publish/subscribe subject/observer pattern
            Publisher.makePublisher(this);

            this.model = model;
            this.markers = [];

            this.restoreMarkers();
        };

        MarkerManager.prototype.addMarker = function (name, type, lat, lon) {
            // Add marker to managed list
            var marker = new MarkerNode(this.generateUniqueName(name), type, lat, lon);

            this.markers.push(marker);
            this.fire(Wmt.EVENT_MARKER_ADDED, marker);
        };

        MarkerManager.prototype.removeMarker = function (uniqueName) {
            var i,
                max,
                removed;

            for (i = 0, max = this.markers.length; i < max; i++) {
                if (this.markers[i].name === uniqueName) {
                    removed = this.markers.splice(i, 1);
                    break;
                }
            }
            this.fire(Wmt.EVENT_MARKER_REMOVED, removed[0]);
        };


        /**
         * Saves the markers list to local storage.
         */
        MarkerManager.prototype.saveMarkers = function () {
            // Ignore markers that have been flagged as "invalid"
            var validMarkers = this.markers.filter(function (marker) {
                return !marker.invalid;
            }),
                string = JSON.stringify(validMarkers);

            localStorage.setItem(Wmt.STORAGE_KEY_MARKERS, string);
        };


        /**
         * Restores the markers list from local storage.
         */
        MarkerManager.prototype.restoreMarkers = function () {
            var string = localStorage.getItem(Wmt.STORAGE_KEY_MARKERS),
                i;

            if (!string || string === 'null') {
                return;
            }
            // Load the entire collection
            this.markers = JSON.parse(string);

            // Notify all observers/subscribers
            for (i = 0; i < this.markers.length; i++) {
                this.fire(Wmt.EVENT_MARKER_ADDED, this.markers[i]);
            }
        };


        /**
         * Generates a unique name by appending a suffix '(n)'.
         * @param {String} name
         * @returns {String}
         */
        MarkerManager.prototype.generateUniqueName = function (name) {
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

                for (i = 0, len = this.markers.length; i < len; i += 1) {
                    if (this.markers[i].name === uniqueName) {

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

        return MarkerManager;
    }

);

