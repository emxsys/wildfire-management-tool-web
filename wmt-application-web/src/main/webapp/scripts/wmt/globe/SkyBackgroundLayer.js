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
        /**
         * 
         * @param {WorldWindow} worldWindow
         * @returns {SkyBackgroundLayer}
         */
        var SkyBackgroundLayer = function (worldWindow) {
            WorldWind.Layer.call(this, "Sky");
            this.globeCanvas = $(worldWindow.canvas);
            
            this.MIN_ALT = 100000;
            this.MAX_ALT = 2000000;
            this.MIN_ALT_LIGHTNESS = 70;
            this.MAX_ALT_LIGHTNESS = 20;
            this.SKY_HUE = 240;
            this.SKY_SATURATION = 50;
            
        };
        SkyBackgroundLayer.prototype = Object.create(WorldWind.Layer.prototype);

        /**
         * 
         * @param {DrawContext} dc
         */
        SkyBackgroundLayer.prototype.doRender = function (dc) {
            var eyePosition = dc.eyePosition;
            if (!eyePosition) {
                return;
            }
            this.globeCanvas.css('background-color', this.getCSSHSL(this.skyColor(eyePosition.altitude)));
        };

        SkyBackgroundLayer.prototype.skyColor = function (altitude) {
            var range = this.MAX_ALT - this.MIN_ALT,
                value = Math.min(Math.max(altitude, this.MIN_ALT), this.MAX_ALT),
                lightness = this.interpolate(this.MIN_ALT_LIGHTNESS, this.MAX_ALT_LIGHTNESS, range, value);
            
            return {h: this.SKY_HUE, s: this.SKY_SATURATION, l: lightness};
        };

        SkyBackgroundLayer.prototype.interpolate = function (start, end, steps, count) {
            var s = start,
                e = end,
                final = s + (((e - s) / steps) * count);
            return Math.floor(final);
        };

        SkyBackgroundLayer.prototype.getCSSHSL = function (hsl) {
            // return the CSS HSL colour value
            return 'hsl(' + hsl.h + ',' + hsl.s + '%,' + hsl.l + '%)';
        };

        return SkyBackgroundLayer;
    }
);
