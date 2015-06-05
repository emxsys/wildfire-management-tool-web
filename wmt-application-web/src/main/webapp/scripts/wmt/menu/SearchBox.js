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

define([
    '../../nasa/WorldWind'],
    function (
        WorldWind) {
        "use strict";
        var SearchBox = function (worldWindow) {
            this.wwd = worldWindow;
            this.geocoder = new WorldWind.NominatimGeocoder();
            this.goToAnimator = new WorldWind.GoToAnimator(this.wwd);

            var self = this;
            $("#searchText").on("keypress", function (e) {
                self.onSearchTextKeyPress($(this), e);
            });

        };


        SearchBox.prototype.onSearchButton = function (event) {
            this.performSearch($("#searchText")[0].value);
        };


        SearchBox.prototype.onSearchTextKeyPress = function (searchInput, event) {
            if (event.keyCode === 13) {
                searchInput.blur();
                this.performSearch($("#searchText")[0].value);
            }
        };


        SearchBox.prototype.performSearch = function (queryString) {
            var self = this,
                tokens,
                latitude,
                longitude;

            if (queryString) {

                if (queryString.match(WorldWind.WWUtil.latLonRegex)) {
                    tokens = queryString.split(",");
                    latitude = parseFloat(tokens[0]);
                    longitude = parseFloat(tokens[1]);
                    self.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
                } else {
                    this.geocoder.lookup(queryString, function (geocoder, result) {
                        if (result.length > 0) {
                            latitude = parseFloat(result[0].lat);
                            longitude = parseFloat(result[0].lon);

                            WorldWind.Logger.log(
                                WorldWind.Logger.LEVEL_INFO, queryString + ": " + latitude + ", " + longitude);

                            self.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
                        }
                    });
                }
            }
        };

        return SearchBox;
    }
);
