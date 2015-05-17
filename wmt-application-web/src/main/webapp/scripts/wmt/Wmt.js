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

/**
 * WMT Configuration and constants
 * 
 * @author Bruce Schubert
 */
define([],
    function () {
        "use strict";
        /**
         * This is the top-level WMT module. It is global.
         * @exports Wmt
         * @global
         */
        var Wmt = {
            /**
             * The WMT version number.
             * @default "0.0.0"
             * @constant
             */
            VERSION: "0.0.0",
            /**
             * Base URL for Web World Wind SDK. (Do not use a reltive path.)
             * @default "scripts/nasa/"
             * @constant
             */
            WORLD_WIND_PATH: "scripts/nasa/",
            /**
             * Base URL for WMT application images. (Do not use a relative path.)
             */
            IMAGE_PATH: "scripts/wmt/images/"
            
        };
        /**
         * Holds configuration parameters for WMT. Applications may modify these parameters prior to creating
         * their first World Wind objects. Configuration properties are:
         * <ul>
         *     <li><code>startupLatitude</code>: Initial "look at" latitude. Default is Ventura, CA.
         *     <li><code>startupLongitude</code>: Initial "look at" longitude. Default is Venura, CA.
         *     <li><code>startupLongitude</code>: Initial altitude/eye position. Default 0.
         *     <li><code>startupHeading</code>: Initial view heading. Default 0.
         *     <li><code>startupTilt</code>: Initial view tilt. Default 0.
         *     <li><code>startupRoll</code>: Initial view roll. Default 0.
         *     <li><code>viewControlOrientation</code>: horizontal or vertical. Default vertical.
         *     <li><code>showPanControl</code>: Show pan (left/right/up/down) controls. Default false.
         *     <li><code>showExaggerationControl</code>: Show vertical exaggeration controls. Default false.
         * </ul>
         */
        Wmt.configuration = {
            startupLatitude: 34.29,
            startupLongitude: -119.29,
            startupAltitude: 5000,
            startupHeading: 0,
            startupTilt: 0,
            startupRoll: 0,
            viewControlOrientation: "vertical",
            showPanControl: false,
            showExaggerationControl: false
        };

        /**
         * Declaration of the Wmt global.
         */
        //window.Wmt = Wmt;

        return Wmt;
    }
);