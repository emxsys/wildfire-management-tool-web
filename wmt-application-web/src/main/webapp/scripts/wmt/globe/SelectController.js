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

/*global define, $, WorldWind */

define([
    'wmt/util/WmtUtil',
    'worldwind'],
    function (
        util,
        ww) {
        "use strict";
        /**
         * @constructor
         * @param {WorldWindow} worldWindow
         * @returns {SelectController}
         */
        var SelectController = function (worldWindow) {
            this.wwd = worldWindow;

            // When dragging, the mouse event is consumed, i.e., not propagated.
            this.isDragging = false;
            // The list of selected items under the mouse cursor
            this.selectedItems = [];
            // The top item in the pick list
            this.pickedItem = null;
            // The clicked/double-clicked 
            this.clickedItem = null;

            var self = this,
                tapRecognizer;

//            $('#globeContextMenu-popup').puimenu();

            // Listen for mouse down to select an item
            this.wwd.addEventListener("mousedown", function (event) {
                self.handlePick(event);
            });
            // Listen for mouse moves and tap gestutes to move an item
            this.wwd.addEventListener("mousemove", function (event) {
                self.handlePick(event);
            });
            // Listen for mouse up to release an item
            this.wwd.addEventListener("mouseup", function (event) {
                self.handlePick(event);
            });
            // Listen for single clicks to select an item
            this.wwd.addEventListener("click", function (event) {
                self.handlePick(event);
            });
            // Listen for double clicks to open an item
            this.wwd.addEventListener("dblclick", function (event) {
                self.handlePick(event);
            });
            // Listen for right clicks to open menu
            this.wwd.addEventListener("contextmenu", function (event) {
                self.handlePick(event);
            });

            // Listen for tap gestures on mobile devices
//            tapRecognizer = new WorldWind.TapRecognizer(this.wwd);
//            tapRecognizer.addGestureListener(function (event) {
//                self.handlePick(event);
//            });

        };

        /**
         * Performs the pick apply the appropriate action on the selected item.
         * @param {Event or TapRecognizer} o The input argument is either an Event or a TapRecognizer. Both have the 
         *  same properties for determiningthe mouse or tap location.
         */
        SelectController.prototype.handlePick = function (o) {
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var type = o.type,
                x = o.clientX,
                y = o.clientY,
                button = o.button,
                redrawRequired,
                pickList,
                terrainObject;

            redrawRequired = false;

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            pickList = this.wwd.pick(this.wwd.canvasCoordinates(x, y));

            switch (type) {
                case 'mousedown':
                    // Handles right and left-clicks 
                    if (pickList.hasNonTerrainObjects()) {

                        // Establish the picked item - may be used by mousemove, click, dblclick and contextmenu handlers
                        this.pickedItem = pickList.topPickedObject();

                        if (this.pickedItem) {
                            // Capture the initial mouse down points for comparison in mousemove
                            // to detemine if whether to initiate dragging of the picked item.
                            this.mouseDownX = x;
                            this.mouseDownY = y;
                        }
                    } else {
                        this.pickedItem = null;
                    }
                    break;
                case 'mousemove':
                    if (this.pickedItem) {
                        // Handle left-click drag/move
                        if (button === 0) {
                            // Initiate dragging only if the mouse has moved a few pixels.
                            if (!this.isDragging &&
                                (Math.abs(this.mouseDownX - x) > 2 || Math.abs(this.mouseDownY - y) > 2)) {
                                this.isDragging = true;
                                // "Start" the move if the object has a "Movable" capability
                                if (this.pickedItem.userObject.moveStarted) {
                                    // Fires EVENT_OBJECT_MOVE_STARTED
                                    this.pickedItem.userObject.moveStarted();
                                }
                            }
                            // Perform the actual move of the picked object
                            if (this.isDragging) {
                                // Get the new terrain coords at the pick point
                                terrainObject = pickList.terrainObject();
                                if (terrainObject) {
                                    // Do the move if the object has a "Movable" capability
                                    if (this.pickedItem.userObject.moveToLatLon) {
                                        // Fires EVENT_OBJECT_MOVED
                                        this.pickedItem.userObject.moveToLatLon(
                                            terrainObject.position.latitude,
                                            terrainObject.position.longitude);
                                    }
                                }
// Uncomment to allow ordinary renderables to be moved.                        
//                            // Or, move the object (a Renderable) if it has a position object
//                            else if (this.pickedItem.userObject.position) {
//                                this.pickedItem.userObject.position =
//                                    new WorldWind.Position(
//                                        terrainObject.position.latitude,
//                                        terrainObject.position.longitude,
//                                        this.pickedItem.userObject.position.elevation);
//                                redrawRequired = true;
//                            }
                            }
                        }
                    }
                    break;
                case 'mouseup':
                    if (this.pickedItem) {
                        // Finish the move if the object a "Movable" capability    
                        if (this.isDragging) {
                            if (this.pickedItem.userObject.moveFinished) {
                                // Fires EVENT_OBJECT_MOVE_FINISHED
                                this.pickedItem.userObject.moveFinished();
                            }
                            this.pickedItem = null;
                        }
                    }
                    this.isDragging = false;
                    break;
                case 'click':
                    // TODO: implement Selectable capabilities
                    // Remember the clicked item for dblclick processing
                    this.clickedItem = this.pickedItem;
                    if (this.clickedItem.userObject.select) {
                        this.clickedItem.userObject.select();
                    }
                    // Release the picked item so mousemove doesn't act on it
                    this.pickedItem = null;
                    break;
                case 'dblclick':
                    if (this.clickedItem) {
                        if (this.clickedItem.userObject.open) {
                            this.clickedItem.userObject.open();
                        }
                        // Release the picked item so mousemove doesn't act on it
                        this.pickedItem = null;
                    }
                    break;
                case 'contextmenu':
                    this.isDragging = false;
                    if (this.pickedItem) {
                        // Invoke the object's context menu if it has one
                        if (this.pickedItem.userObject.showContextMenu) {
                            this.pickedItem.userObject.showContextMenu();
                        } else {
                            // Otherwise, build a context menu from standard capabilities
//                            $('#globeContextMenu-popup').puimenu('show');
                        }
                        // Release the picked item so mousemove doesn't act on it
                        this.pickedItem = null;
                    }
                    break;
            }
            // Prevent pan/drag operations on the globe when we're dragging an object.
            if (this.isDragging) {
                o.preventDefault();
            }
            // Update the window if we changed anything.
            if (redrawRequired) {
                this.wwd.redraw(); // redraw to make the highlighting changes take effect on the screen
            }
        }
        ;

        return SelectController;
    }
);