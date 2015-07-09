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
            // Flag to signal that dragging/moving has been initiated.
            // When dragging, the mouse event is consumed, i.e., not propagated.
            this.isDragging = false;
            // Flag to signal if a touch tap has occured.
            // Used to determine single or double tap.
            this.tapped = false;
            // The list of selected items under the mouse cursor
            this.selectedItems = [];
            // The top item in the pick list
            this.pickedItem = null;
            // Caches the clicked item for dblclick to process 
            this.clickedItem = null;

            var self = this,
                tapRecognizer,
                clickRecognizer;
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
            this.wwd.addEventListener("mouseout", function (event) {
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

            // Listen for touch
            this.wwd.addEventListener("touchstart", function (event) {
                self.handlePick(event);
            });
            this.wwd.addEventListener("touchmove", function (event) {
                self.handlePick(event);
            });
            this.wwd.addEventListener("touchend", function (event) {
                self.handlePick(event);
            });

//            // Listen for tap gestures on mobile devices
//            tapRecognizer = new WorldWind.TapRecognizer(this.wwd, function (event) {
//                self.handlePick(event);
//            });
//            // Listen for tap gestures on mobile devices
//            clickRecognizer = new WorldWind.ClickRecognizer(this.wwd, function (event) {
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
                x, y,
                button = o.button,
                redrawRequired,
                pickList,
                terrainObject,
                tapped,
                isTouchDevice = false;

            if (type.substring(0, 5) === 'touch') {
                isTouchDevice = true;
                // x, y remain undefined for touchend
                if (o.touches.length > 0) {
                    x = o.touches[0].clientX;
                    y = o.touches[0].clientY;
                }
            } else {
                // Prevent handling of simulated mouse events on touch devices.
                if (isTouchDevice) {
                    return;
                }
                x = o.clientX;
                y = o.clientY;
            }
            redrawRequired = false;
            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            pickList = this.wwd.pick(this.wwd.canvasCoordinates(x, y));
            switch (type) {
                case 'touchstart':
                case 'mousedown':
                    // Handles right and left-clicks 
                    if (pickList.hasNonTerrainObjects()) {

                        // Establish the picked item - may be used by mousemove, click, dblclick and contextmenu handlers
                        this.pickedItem = pickList.topPickedObject();
                        if (this.pickedItem) {
                            // Capture the initial mouse down points for comparison in mousemove
                            // to detemine if whether to initiate dragging of the picked item.
                            this.startX = x;
                            this.startY = y;
                        }
                    } else {
                        this.pickedItem = null;
                    }
                    break;
                case 'touchmove':
                case 'mousemove':
                    if (this.pickedItem) {
                        // Handle left-click drag/move
                        if (button === 0 || type === 'touchmove') {
                            // Initiate dragging only if the mouse has moved a few pixels.
                            if (!this.isDragging &&
                                (Math.abs(this.startX - x) > 2 || Math.abs(this.startY - y) > 2)) {
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
                case 'touchend':
                case 'touchcancel':
                case 'mouseup':
                case 'mouseout':
                    // The end of a touch can signal either the end of a 
                    // drag/move operation or a tap/double-tap
                    if (this.pickedItem) {
                        // If our isDragging flag is set, then it's a given
                        // that the touch/mouse event signals a move finished.
                        if (this.isDragging) {
                            // Test for a "Movable" capability    
                            if (this.pickedItem.userObject.moveFinished) {
                                // Fires EVENT_OBJECT_MOVE_FINISHED
                                this.pickedItem.userObject.moveFinished();
                            }
                            this.pickedItem = null;
                        } else if (type === 'touchend') {
                            // Determine if touch event is a single tap or double tap
                            if (!this.tapped) {
                                // Wait 300ms for another tap, if if doesn't happen,
                                // then execute the Selectable capability
                                this.tapped = setTimeout(function () {
                                    this.tapped = null;
                                    if (this.pickedItem.userObject.select) {
                                        this.pickedItem.userObject.select();
                                    }
                                }, 300);
                            } else {
                                // A double tap has occured. Clear the pending
                                // single tap and execute the Openable capability
                                clearTimeout(this.tapped);
                                tapped = null;
                                if (this.pickedItem.userObject.open) {
                                    this.pickedItem.userObject.open();
                                }
                                // Release the picked item 
                                this.pickedItem = null;

                            }
                        }
                    }
                    this.isDragging = false;
                    break;
                case 'click':
                    // Remember the clicked item for dblclick processing
                    this.clickedItem = this.pickedItem;
                    if (this.clickedItem) {
                        if (this.clickedItem.userObject.select) {
                            this.clickedItem.userObject.select();
                        }
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
                o.stopImmediatePropagation();   // Try and prevent WW PanRecognizer TouchEvent from processing event
                o.stopPropagation();
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