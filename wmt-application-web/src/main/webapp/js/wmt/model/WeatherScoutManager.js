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
    'knockout',
    'wmt/util/Publisher',
    'wmt/model/WeatherScout',
    'wmt/Wmt'],
    function (
        ko,
        publisher,
        WeatherScout,
        wmt) {
        "use strict";
        var WeatherScoutManager = function () {
            // Mix-in Publisher capability (publish/subscribe pattern)
            publisher.makePublisher(this);
            this.scouts = ko.observableArray();

        };

        /**
         * Adds the given scout to to the manager.
         * @param {WeatherScout} scout
         */
        WeatherScoutManager.prototype.addScout = function (scout) {
            // Ensure we have a unique name by appending a (n) to duplicates.
            scout.name = this.generateUniqueName(scout.name || "Wx Scout");

            // Subscribe to removal notifications
            scout.on(wmt.EVENT_OBJECT_REMOVED, this.removeScout, this);

            // Manage this object
            this.scouts.push(scout);

            // Notify views of the new wx scount
            this.fire(wmt.EVENT_WEATHER_SCOUT_ADDED, scout);

            // Do a refresh now that view are attached, so they can get the notifications as they occur
            scout.refresh();
        };

        /**
         * Finds the weather scout with the given id.
         * @param {String} id System assigned id for the scout.
         * @returns {WeatherScout} The scout object if found, else null.
         */
        WeatherScoutManager.prototype.findScout = function (id) {
            var scout, i, len;

            for (i = 0, len = this.scouts().length; i < len; i += 1) {
                scout = this.scouts()[i];
                if (scout.id === id) {
                    return scout;
                }
            }
            return null;
        };

        /**
         * Removes the given scout from the manager.
         * @param {WeatherScout} scout
         * @returns {Boolean}
         */
        WeatherScoutManager.prototype.removeScout = function (scout) {
            var i, max,
                removed;

            // Find the scout item with the given id (should create an associative array)
            for (i = 0, max = this.scouts().length; i < max; i++) {
                if (this.scouts()[i].id === scout.id) {
                    removed = this.scouts.splice(i, 1);
                    break;
                }
            }
            if (removed && removed.length > 0) {
                // Remove our subscription/reference to the scout
                scout.cancelSubscription(wmt.EVENT_OBJECT_REMOVED, this.removeScout, this);
                // Notify others.
                this.fire(wmt.EVENT_WEATHER_SCOUT_REMOVED, removed[0]);
                return true;
            }
            return false;
        };

        /**
         * Invokes refresh on all the scouts managed by this manager.
         */
        WeatherScoutManager.prototype.refreshScouts = function () {
            var i, max;

            for (i = 0, max = this.scouts().length; i < max; i++) {
                this.scouts()[i].refresh();
            }
        };

        /**
         * Saves the weather scouts collection to local storage.
         */
        WeatherScoutManager.prototype.saveScouts = function () {
            var validScouts = this.scouts().filter(
                function (scout) {
                    return !scout.invalid;
                }),
                string = JSON.stringify(validScouts,
                    [
                        'id',
                        'name',
                        'duration',
                        'rules',
                        'latitude',
                        'longitude',
                        'isMovable'
                    ]);

            localStorage.setItem(wmt.STORAGE_KEY_WEATHER_SCOUTS, string);
        };

        /**
         * Restores the weather scouts collection from local storage.
         */
        WeatherScoutManager.prototype.restoreScouts = function () {
            var string = localStorage.getItem(wmt.STORAGE_KEY_WEATHER_SCOUTS),
                array,
                i, max;
            if (!string || string === 'null') {
                return;
            }
            // Convert JSON array to array of WeatherScout objects
            array = JSON.parse(string);
            for (i = 0, max = array.length; i < max; i++) {
                this.addScout(new WeatherScout({
                    id: array[i].id,
                    name: array[i].name,
                    duration: array[i].duration,
                    rules: array[i].rules,
                    latitude: array[i].latitude,
                    longitude: array[i].longitude,
                    isMovable: array[i].isMovable
                }));
            }
        };

        /**
         * Generates a unique name by appending a suffix '(n)'.
         * @param {String} name
         * @returns {String}
         */
        WeatherScoutManager.prototype.generateUniqueName = function (name) {
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

                for (i = 0, len = this.scouts().length; i < len; i += 1) {
                    if (this.scouts()[i].name === uniqueName) {

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

        return WeatherScoutManager;
    }
);

