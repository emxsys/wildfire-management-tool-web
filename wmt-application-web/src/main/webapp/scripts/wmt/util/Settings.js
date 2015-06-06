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

/*global define */

/**
 * The Settings module is responsible for saving and restoring the globe view between sessions.
 * 
 * @author Bruce Schubert
 */
define([
    '../util/Log',
    '../Wmt'],
    function (
        Log,
        Wmt) {
        "use strict";
        var Settings = {
            /**
             * 
             * @param {Controller} controller
             */
            saveSessionSettings: function (controller) {
                if (!window.localStorage) {
                    Log.warning("Settings", "saveSessionSettings", "Local Storage is not supported!");
                    return;
                }

                var pos = controller.wwd.navigator.lookAtLocation,
                    alt = controller.wwd.navigator.range,
                    heading = controller.wwd.navigator.heading,
                    tilt = controller.wwd.navigator.tilt,
                    roll = controller.wwd.navigator.roll;

                // Save the eye position
                localStorage.setItem("latitude", pos.latitude);
                localStorage.setItem("longitude", pos.longitude);
                localStorage.setItem("altitude", alt);

                // Save the globe orientation.
                localStorage.setItem("heading", heading);
                localStorage.setItem("tilt", tilt);
                localStorage.setItem("roll", roll);

            },
            /**
             * 
             * @param {Controller} controller
             */
            restoreSessionSettings: function (controller) {
                try {
                    if (!localStorage) {
                        Log.warning("Settings", "restoreSessionSettings", "Local Storage is not enabled!");
                        return;
                    }
                    var lat = localStorage.getItem("latitude"),
                        lon = localStorage.getItem("longitude"),
                        alt = localStorage.getItem("altitude"),
                        head = localStorage.getItem("heading"),
                        tilt = localStorage.getItem("tilt"),
                        roll = localStorage.getItem("roll");

                    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
                        Log.warning("Settings", "restoreSessionSettings", "Previous state invalid: Using default lat/lon.");
                        lat = Wmt.configuration.startupLatitude;
                        lon = Wmt.configuration.startupLongitude;
                    }
                    if (!alt || isNaN(alt)) {
                        Log.warning("Settings", "restoreSessionSettings", "Previous state invalid: Using default altitude.");
                        alt = Wmt.configuration.startupAltitude;
                    }
                    if (!head || !tilt || !roll || isNaN(head) || isNaN(tilt) || isNaN(roll)) {
                        Log.warning("Settings", "restoreSessionSettings", "Previous state invalid: Using default view angles.");
                        head = Wmt.configuration.startupHeading;
                        tilt = Wmt.configuration.startupTilt;
                        roll = Wmt.configuration.startupRoll;
                    }
                    controller.wwd.navigator.lookAtLocation.latitude = lat;
                    controller.wwd.navigator.lookAtLocation.longitude = lon;
                    controller.wwd.navigator.range = alt;
                    controller.wwd.navigator.heading = head;
                    controller.wwd.navigator.tilt = tilt;
                    controller.wwd.navigator.roll = roll;
                    controller.wwd.redraw();
                    
                } catch (e) {
                    Log.error("Settings", "restoreSessionSettings",
                        "Exception occurred processing cookie: " + e.toString());
                }

            }
        };
        return Settings;
    }
);
