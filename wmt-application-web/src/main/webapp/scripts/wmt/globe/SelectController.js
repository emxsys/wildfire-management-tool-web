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

define([
    '../../nasa/WorldWind'],
    function (
        WorldWind) {
        "use strict";
        /**
         * @constructor
         * @param {WorldWindow} worldWindow
         * @returns {SelectController}
         */
        var SelectController = function (worldWindow) {
            this.wwd = worldWindow;

            this.isDragging = false;
            // The list of selected items under the mouse cursor
            this.selectedItems = [];
            // The top item in the pick list
            this.pickedItem = null;

            var self = this,
                tapRecognizer;

            // Listen for mouse moves and tap gestutes to move an item
            this.wwd.addEventListener("mousemove", function (event) {
                self.handlePick(event);
            });
            // Listen for mouse clicks to select an item
            this.wwd.addEventListener("mousedown", function (event) {
                self.handlePick(event);
            });
            // Listen for mouse clicks to select an item
            this.wwd.addEventListener("mouseup", function (event) {
                self.handlePick(event);
            });

            // Listen for tap gestures on mobile devices
            tapRecognizer = new WorldWind.TapRecognizer(this.wwd);
            tapRecognizer.addGestureListener(function (event) {
                self.handlePick(event);
            });

        };

        SelectController.prototype.handlePick = function (o) {
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var type = o.type,
                x = o.clientX,
                y = o.clientY,
                redrawRequired,
                pickList,
                terrainObject;

            redrawRequired = false;

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            pickList = this.wwd.pick(this.wwd.canvasCoordinates(x, y));

            switch (type) {
                case 'mousedown':
                    pickList = this.wwd.pick(this.wwd.canvasCoordinates(x, y));
                    if (pickList.hasNonTerrainObjects()) {
                        this.pickedItem = pickList.topPickedObject();
                        this.isDragging = true;
                    }
                    break;
                case 'mousemove':
                    if (this.pickedItem) {
                        // Move the object if the picked object has a position
                        if (this.pickedItem.userObject.position) {
                            terrainObject = pickList.terrainObject();
                            if (terrainObject) {
                                this.pickedItem.userObject.position =
                                    new WorldWind.Position(
                                        terrainObject.position.latitude,
                                        terrainObject.position.longitude,
                                        this.pickedItem.userObject.position.elevation);
                                redrawRequired = true;
                            }
                        }
                    }
                    break;
                case 'mouseup':
                    this.pickedItem = null;
                    this.selectedItems = [];
                    this.isDragging = false;
                    break;
            }
            // Prevent pan/drag operations on the globe when we're dragging an object.
            if (this.isDragging) {
                o.stopImmediatePropagation();
            }
            // Update the window if we changed anything.
            if (redrawRequired) {
                this.wwd.redraw(); // redraw to make the highlighting changes take effect on the screen
            }
        };

        return SelectController;
    }
);