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

define(['../util/Publisher', '../Wmt'],
    function (Publisher, Wmt) {
        "use strict";
        var WeatherLookoutManager = function (model) {
            // Mix-in Publisher capability (publish/subscribe pattern)
            Publisher.makePublisher(this);
            this.model = model;
            this.lookouts = [];

        };

        WeatherLookoutManager.prototype.addLookout = function (lookout) {
            this.lookouts.push(lookout);

            // TODO: Add lookout to globe via notify
            //this.fire(Wmt.EVENT_WXLOOKOUT_ADDED, marker);

        };

        WeatherLookoutManager.prototype.removeLookout = function (uniqueName) {
            var i,
                max;

            for (i = 0, max = this.lookouts.length; i < max; i++) {
                if (this.lookouts[i].name === uniqueName) {
                    this.lookouts.splice(i, 1);
                    break;
                }
            }
            // TODO: Remove renderable from globe via notify
            //this.fire(Wmt.EVENT_WXLOOKOUT_REMOVED, marker);

        };


        /**
         * Saves the weather lookouts collection to local storage.
         */
        WeatherLookoutManager.prototype.saveLookouts = function () {
            var validMarkers = this.markers.filter(function (marker) {
                return !marker.invalid;
            }),
                string = JSON.stringify(validMarkers);
            localStorage.setItem(Wmt.WEATHER_LOOKOUTS_STORAGE_KEY, string);
        };

        /**
         * Restores the weather lookouts collection from local storage.
         */
        WeatherLookoutManager.prototype.restoreLookouts = function () {
            var string = localStorage.getItem(Wmt.WEATHER_LOOKOUTS_STORAGE_KEY);
            if (!string || string === 'null') {
                return;
            }
            this.markers = JSON.parse(string);
        };



        return WeatherLookoutManager;
    }
);

