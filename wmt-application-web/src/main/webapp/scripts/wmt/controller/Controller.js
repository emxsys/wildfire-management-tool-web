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
    '../model/Model',
    '../view/CoordinatesView',
    '../view/ReticuleView',
    '../../nasa/WorldWind'],
    function (
        Model,
        CoordinatesView,
        ReticuleView,
        WorldWind) {
        "use strict";
        var Controller = function (worldWindow) {
            this.wwd = worldWindow;

            // Create the MVC Model
            this.model = new Model(worldWindow);

            // Create MVC Views
            this.coordinatesView = new CoordinatesView(worldWindow);
            this.reticuleView = new ReticuleView(worldWindow);

            // Assemble MVC connections
            this.model.on("mouseMoved", this.coordinatesView.handleMouseMoved, this.coordinatesView);
            this.model.on("reticuleMoved", this.reticuleView.handleReticuleMoved, this.reticuleView);

            // Internal. Intentionally not documented.
            this.updateTimeout = null;
            this.updateInterval = 50;

            // Setup to update each time the World Window is repainted.
            var self = this;
            this.wwd.redrawCallbacks.push(function () {
                self.handleRedraw();
            });

            // Setup to track the cursor position relative to the World Window's canvas. Listen to touch events in order
            // to recognize and ignore simulated mouse events in mobile browsers.
            window.addEventListener("mousemove", function (event) {
                self.handleMouseEvent(event);
            });
            window.addEventListener("touchstart", function (event) {
                self.handleTouchEvent(event);
            });


        };

        Controller.prototype.handleRedraw = function () {
            var self = this;
            if (self.updateTimeout) {
                return; // we've already scheduled an update; ignore redundant redraw events
            }

            self.updateTimeout = window.setTimeout(function () {
                self.update();
                self.updateTimeout = null;
            }, self.updateInterval);
        };

        Controller.prototype.handleMouseEvent = function (event) {
            if (this.isTouchDevice) {
                return; // ignore simulated mouse events in mobile browsers
            }
            this.mousePoint = this.wwd.canvasCoordinates(event.clientX, event.clientY);
            this.wwd.redraw();
        };

        //noinspection JSUnusedLocalSymbols
        Controller.prototype.handleTouchEvent = function (event) {
            this.isTouchDevice = true; // suppress simulated mouse events in mobile browsers
            this.mousePoint = null;
        };


        Controller.prototype.update = function () {
            var wwd = this.wwd,
                mousePoint = this.mousePoint,
                centerPoint = new WorldWind.Vec2(wwd.canvas.width / 2, wwd.canvas.height / 2);

            // Pick the terrain at the mouse point when we've received at least one mouse event. Otherwise assume that we're
            // on a touch device and pick at the center of the World Window's canvas.
            if (!mousePoint) {
                this.model.updateTerrainUnderMouse(centerPoint);
            } else if (wwd.viewport.containsPoint(mousePoint)) {
                this.model.updateTerrainUnderMouse(mousePoint);
            }
            this.model.updateTerrainUnderReticule();
        };
        return Controller;
    }
);

