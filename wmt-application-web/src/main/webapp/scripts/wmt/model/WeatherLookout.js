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
    'wmt/util/Editable',
    'wmt/util/Messenger',
    'wmt/util/Movable',
    'wmt/resource/PlaceResource',
    'wmt/util/Removable',
    'wmt/resource/WeatherResource',
    'wmt/Wmt'],
    function (
        Editable,
        Messenger,
        Movable,
        PlaceResource,
        Removable,
        WeatherResource,
        Wmt) {
        "use strict";

        var WeatherLookout = function (name, duration, rules, latitude, longitude) {

            // Make movable by the SelectController: Fires the EVENT_OBJECT_MOVE... events.
            Movable.makeMovable(this);

            // Make editable via menus: Fires the EVENT_OBJECT_EDITED event on success.
            Editable.makeEditable(this, function () {
                Messenger.infoGrowl("Sorry", "The edit feature has not been implemented yet.");
                return false;
            });
            // Make deletable via menu: Fires the EVENT_OBJECT_REMOVED event on success.
            Removable.makeRemovable(this, function () {
                Messenger.infoGrowl("Sorry", "The delete feature has not been implemented yet.");
                return false;
            });

            this.name = name || 'Wx Lookout';
            this.duration = duration || Wmt.configuration.wxForecastDurationHours;
            this.latitude = latitude;
            this.longitude = longitude;

            this.rules = [];

            // Self subscribe to move operations so we can update the forecast and place
            // when the move is finished. We don't want to update during the move itself.
            this.on(Wmt.EVENT_OBJECT_MOVE_FINISHED, this.refresh);

            // Perform initial update
            this.refresh();
        };


        WeatherLookout.prototype.refresh = function () {
            if (!this.latitude || !this.longitude || !this.duration) {
                return;
            }
            var self = this,
                i, max, item, place = [];
            
            // Get the weather forecast at this location
            WeatherResource.pointForecast(
                this.latitude,
                this.longitude,
                this.duration,
                function (json) { // Callback to process JSON result
                    self.wxForecast = json;
                    self.fire(Wmt.EVENT_WEATHER_CHANGED, self);
                }
            );
            
            // Get the place name(s) at this location
            PlaceResource.places(
                this.latitude,
                this.longitude,
                function (json) { // Callback to process YQL Geo.Places result
                    for (i = 0, max = json.query.results.place.length; i < max; i++) {
                        item = json.query.results.place[i];
                        place[i] = {"name": item.name, "type": item.placeTypeName.content};
                    }
                    self.place = place;
                    self.fire(Wmt.EVENT_PLACE_CHANGED, self);
                }
            );
        };

        return WeatherLookout;

    }
);

