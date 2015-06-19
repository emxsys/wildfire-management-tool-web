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

define(['../util/Publisher', '../model/WeatherLookout', '../Wmt'],
    function (Publisher, WeatherLookout, Wmt) {
        "use strict";
        var WeatherLookoutManager = function (model) {
            // Mix-in Publisher capability (publish/subscribe pattern)
            Publisher.makePublisher(this);
            this.model = model;
            this.wxLookouts = [];

        };

        WeatherLookoutManager.prototype.addLookout = function (lookout) {
            lookout.name = this.generateUniqueName(lookout.name || "Wx Lookout");
            this.wxLookouts.push(lookout);
            this.fire(Wmt.EVENT_WEATHER_LOOKOUT_ADDED, lookout);
        };

        WeatherLookoutManager.prototype.removeLookout = function (uniqueName) {
            var i,
                max,
                removed;

            for (i = 0, max = this.wxLookouts.length; i < max; i++) {
                if (this.wxLookouts[i].name === uniqueName) {
                    removed = this.wxLookouts.splice(i, 1);
                    break;
                }
            }
            if (removed && removed.length > 0) {
                this.fire(Wmt.EVENT_WEATHER_LOOKOUT_REMOVED, removed[0]);
            }
        };


        /**
         * Saves the weather lookouts collection to local storage.
         */
        WeatherLookoutManager.prototype.saveLookouts = function () {
            var validLookouts = this.wxLookouts.filter(function (lookout) {
                return !lookout.invalid;
            }),
                string = JSON.stringify(validLookouts, ['name','duration','rules','latitude','longitude']);
            
            localStorage.setItem(Wmt.WEATHER_LOOKOUTS_STORAGE_KEY, string);
        };

        /**
         * Restores the weather lookouts collection from local storage.
         */
        WeatherLookoutManager.prototype.restoreLookouts = function () {
            var string = localStorage.getItem(Wmt.WEATHER_LOOKOUTS_STORAGE_KEY),
                array,
                i, max;
            if (!string || string === 'null') {
                return;
            }
            // Convert JSON array to array of WeatherLookout objects
            array = JSON.parse(string);
            for (i = 0, max = array.length; i < max; i++) {
                this.wxLookouts.push(new WeatherLookout(
                    array[i].name,
                    array[i].duration,
                    array[i].rules,
                    array[i].latitude,
                    array[i].longitude));
            }
        };

        /**
         * Generates a unique name by appending a suffix '(n)'.
         * @param {String} name
         * @returns {String}
         */
        WeatherLookoutManager.prototype.generateUniqueName = function (name) {
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

                for (i = 0, len = this.wxLookouts.length; i < len; i += 1) {
                    if (this.wxLookouts[i].name === uniqueName) {

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


        return WeatherLookoutManager;
    }
);

