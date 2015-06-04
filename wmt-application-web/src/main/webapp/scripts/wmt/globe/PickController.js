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
         * @returns {PickController}
         */
        var PickController = function (worldWindow) {
            this.wwd = worldWindow;

            // The list of items under the mouse cursor
            this.highlightedItems = [];

            // The top item in the pick list
            this.pickedItem = null;

            var self = this,
                tapRecognizer;

            // Listen for mouse moves and tap gestutes
            this.wwd.addEventListener("mousemove", function (event) {
                self.handlePick(event);
            });
            // Listen for tap gestures on mobile devices
            tapRecognizer = new WorldWind.TapRecognizer(this.wwd);
            tapRecognizer.addGestureListener(function (event) {
                self.handlePick(event);
            });

        };

        /**
         * The HandlePick function selects and highlights items on the globe under the mouse 
         * or touch point, aka the pick point.  The code was copied from Web World Wind examples:
         * 
         *     PlacemarksAndPicking.js 3121 2015-05-28 02:42:13Z tgaskins
         *     
         *     Copyright (C) 2014 United States Government as represented by the Administrator of the
         *     National Aeronautics and Space Administration. All Rights Reserved.
         *
         * @param {Event or a TapRecognizer} o The input argument is either an Event or a TapRecognizer.
         */
        PickController.prototype.handlePick = function (o) {
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var x = o.clientX,
                y = o.clientY,
                redrawRequired,
                pickList,
                h,
                p;

            redrawRequired = this.highlightedItems.length > 0;

            // De-highlight any previously highlighted placemarks.
            for (h = 0; h < this.highlightedItems.length; h += 1) {
                this.highlightedItems[h].highlighted = false;
            }
            this.highlightedItems = [];

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            pickList = this.wwd.pick(this.wwd.canvasCoordinates(x, y));
            if (pickList.objects.length > 0) {
                this.pickedItem = pickList.objects[0];
                redrawRequired = true;
            } else {
                this.pickedItem = null;
            }

            // Highlight the items picked by simply setting their highlight flag to true.
            if (pickList.objects.length > 0) {
                for (p = 0; p < pickList.objects.length; p += 1) {
                    pickList.objects[p].userObject.highlighted = true;

                    // Keep track of highlighted items in order to de-highlight them later.
                    this.highlightedItems.push(pickList.objects[p].userObject);

                    // Detect whether the placemark's label was picked. If so, the "labelPicked" property is true.
                    // If instead the user picked the placemark's image, the "labelPicked" property is false.
                    // Applications might use this information to determine whether the user wants to edit the label
                    // or is merely picking the placemark as a whole.
                    if (pickList.objects[p].labelPicked) {
                        console.log("Label picked");
                    }
                }
            }

            // Update the window if we changed anything.
            if (redrawRequired) {
                this.wwd.redraw(); // redraw to make the highlighting changes take effect on the screen
            }
        };

        return PickController;
    }
);