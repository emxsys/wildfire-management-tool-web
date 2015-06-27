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

/**
 * 
 * @param {Wmt} Wmt WMT constants.
 * @param {WorldWind} ww WorldWind dependency that doesn't redefine global.
 * @returns {RelativeHumidityText}
 */
define([
    'wmt/Wmt',
    'worldwind'],
    function (
        Wmt,
        ww) {
        "use strict";

        /**
         * Creates a GeographicText component for displaying relative humidity in a WeatherMapSymbol.
         * @constructor
         * @param {Number} latitude
         * @param {Number} longitude
         * @param {String} relHumidityPct
         * @returns {RelativeHumidityText}
         */
        var RelativeHumidityText = function (latitude, longitude, relHumidityPct) {
            WorldWind.GeographicText.call(this, new WorldWind.Position(latitude, longitude, Wmt.WEATHER_MAP_SYMBOL_ALTITUDE), relHumidityPct);

            this.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
            this.alwaysOnTop = true;
            this.attributes = new WorldWind.TextAttributes(null);
            this.attributes.scale = 1.0;
            this.attributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 1.3, // Left
                WorldWind.OFFSET_FRACTION, 1.3);    // Lower
            this.attributes.color = WorldWind.Color.CYAN;
            this.attributes.depthTest = false;
            //this.declutterGroup = 3; // same as airtemp

        };
        // Inherit Placemark parent methods
        RelativeHumidityText.prototype = Object.create(WorldWind.GeographicText.prototype);


        /**
         * Creates a clone of this object.
         * @returns {RelativeHumidityText}
         */
        RelativeHumidityText.prototype.clone = function () {
            var clone = new RelativeHumidityText(this.position.latitude, this.position.longitude, this.text);
            clone.copy(this);
            clone.pickDelegate = this.pickDelegate ? this.pickDelegate : this;
            clone.attributes = new WorldWind.TextAttributes(this.attributes);
            return clone;
        };


        return RelativeHumidityText;
    }
);

