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

/*global define*/


/**
 * The KeyboardControls module provides keyboard controls for the globe.
 * 
 * @param {Log} Log
 * @param {WorldWind} WorldWind
 * @returns {KeyboardControls}
 * 
 * @@author Bruce Schubert
 */
define([
    '../util/Log',
    '../../nasa/WorldWind'],
    function (
        Log,
        WorldWind) {
        "use strict";
        var KeyboardControls = function (worldWindow) {
            this.wwd = worldWindow;

            var self = this;
            window.addEventListener('keydown', function (event) {
                self.handleKeyDown(event);
            });
            window.addEventListener('keyup', function (event) {
                self.handleKeyUp(event);
            });

            /**
             * The incremental amount to increase or decrease the eye distance (for zoom) each cycle.
             * @type {Number}
             */
            this.zoomIncrement = 0.01;

            /**
             * The scale factor governing the pan speed. Increased values cause faster panning.
             * @type {Number}
             */
            this.panIncrement = 0.0000000005;

        };

        /**
         * Controls the globe with the keyboard.
         * @param {KeyboardEvent} event
         */
        KeyboardControls.prototype.handleKeyDown = function (event) {
            Log.info('KeyboardControls', 'handleKeyDown', event.keyCode + ' pressed.');
            Log.info('KeyboardControls', 'handleKeyDown', "Target: " + event.target);

            if (event.keyCode === 187) {        // + key
                this.handleZoom("zoomIn");
            }
            else if (event.keyCode === 189) {   // - key
                this.handleZoom("zoomOut");
            }
            else if (event.keyCode === 37) {    // Left arrow
                this.handlePan("panLeft");
            }
            else if (event.keyCode === 38) {    // Up arrow
                this.handlePan("panUp");
            }
            else if (event.keyCode === 39) {    // Right arrow
                this.handlePan("panRight");
            }
            else if (event.keyCode === 40) {    // Down arrow
                this.handlePan("panDown");
            }
            else if (event.keyCode === 78) {    // N key
                this.resetHeading();
            }
            else if (event.keyCode === 82) {    // R key
                this.resetHeadingAndTilt();
            }
        };

        /**
         * Reset the view to North up.
         */
        KeyboardControls.prototype.resetHeading = function () {
            this.wwd.navigator.heading = 0;
            this.wwd.redraw();
        };
        
        /**
         * Reset the view to North up and nadir.
         */
        KeyboardControls.prototype.resetHeadingAndTilt = function () {
            this.wwd.navigator.heading = 0;
            this.wwd.navigator.tilt = 0;
            this.wwd.redraw();
        };

        /**
         * 
         * @param {KeyupEvent} event
         */
        KeyboardControls.prototype.handleKeyUp = function (event) {
            if (this.activeOperation) {
                this.activeOperation = null;
                event.preventDefault();
            }
        };

        /**
         * 
         * @param {type} operation
         */
        KeyboardControls.prototype.handleZoom = function (operation) {
            this.activeOperation = this.handleZoom;

            // This function is called by the timer to perform the operation.
            var self = this, // capture 'this' for use in the function
                setRange = function () {
                    if (self.activeOperation) {
                        if (operation === "zoomIn") {
                            self.wwd.navigator.range *= (1 - self.zoomIncrement);
                        } else if (operation === "zoomOut") {
                            self.wwd.navigator.range *= (1 + self.zoomIncrement);
                        }
                        self.wwd.redraw();
                        setTimeout(setRange, 50);
                    }
                };
            setTimeout(setRange, 50);
            event.preventDefault();

        };

        /**
         * 
         * @param {String} operation
         */
        KeyboardControls.prototype.handlePan = function (operation) {
            this.activeOperation = this.handlePan;

            // This function is called by the timer to perform the operation.
            var self = this, // capture 'this' for use in the function
                setLookAtLocation = function () {
                    if (self.activeOperation) {
                        var heading = self.wwd.navigator.heading,
                            distance = self.panIncrement * Math.min(self.wwd.navigator.range, 25000);

                        switch (operation) {
                            case 'panUp' :
                                break;
                            case 'panDown' :
                                heading -= 180;
                                break;
                            case 'panLeft' :
                                heading -= 90;
                                break;
                            case 'panRight' :
                                heading += 90;
                                break;
                        }
                        WorldWind.Location.greatCircleLocation(self.wwd.navigator.lookAtLocation,
                            heading, distance, self.wwd.navigator.lookAtLocation);
                        self.wwd.redraw();
                        setTimeout(setLookAtLocation, 50);
                    }
                };
            setTimeout(setLookAtLocation, 50);
            event.preventDefault();
        };


        return KeyboardControls;
    }
);