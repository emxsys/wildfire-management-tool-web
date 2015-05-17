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
 * The World Wind view controls are horizontal in nature, this implementation orients the controls vertically.
 * 
 * @exports EnhancedViewControlsLayer
 * @param {Object} Locator
 * @param {Object} Navigator
 * @param {Object} ViewControlsLayer
 * @param {Object} Wmt
 * @param {Object} WorldWind
 * @author Bruce Schubert
 */
define([
    '../location/Locator',
    '../location/Navigator',
    '../../nasa/layer/ViewControlsLayer',
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        Locator,
        Navigator,
        ViewControlsLayer,
        Wmt,
        WorldWind) {
        "use strict";
        /**
         * Constructs a view controls layer.
         * @alias VerticalViewControlsLayer
         * @constructor
         * @augments {ViewControlsLayer}
         * @classdesc Displays and manages view controls.
         * @param {WorldWindow} worldWindow The World Window associated with this layer.
         * This layer may not be associated with more than one World Window. Each World Window must have it's own
         * instance of this layer if each window is to have view controls.
         */
        var EnhancedViewControlsLayer = function (worldWindow) {
            // Classic Pattern #2 - Rent-a-Constructor. See JavaScript Patterns - Code Reuse Patterns
            // Creates a copy of parent members
            ViewControlsLayer.call(this, worldWindow);

            // TODO: Depreciate Locator in favor of separate UI control for invoking Set Location.

            /**  Updates the view */
            this.locator = new Locator(new Navigator(worldWindow));

            // Set defaults from configuration
            this.showPanControl = Wmt.configuration.showPanControl;
            this.showExaggerationControl = Wmt.configuration.showExaggerationControl;
            this.orientation = Wmt.configuration.viewControlOrientation;

            // Top-right placement
//            this.placement = new Offset(
//                WorldWind.OFFSET_FRACTION, 0.973, // Align with Compass width
//                WorldWind.OFFSET_FRACTION, 0.95); // Move down to make room for compass
            this.placement = new WorldWind.Offset(
                WorldWind.OFFSET_INSET_PIXELS, 30, // Align with Compass width
                WorldWind.OFFSET_INSET_PIXELS, 50); // Move down to make room for compass
            this.alignment = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 1);

            // Set the screen and image offsets of each control to the lower left corner.
            // Use same offset values as parent ViewControlsLayer.
            var screenOffset = new WorldWind.Offset(WorldWind.OFFSET_PIXELS, 0, WorldWind.OFFSET_PIXELS, 0),
                imagePath = Wmt.IMAGE_PATH;

            // These controls are all internal and intentionally not documented.
            this.gotoControl = new WorldWind.ScreenImage(screenOffset.clone(), imagePath + "location-goto32.png");
            this.locateControl = new WorldWind.ScreenImage(screenOffset.clone(), imagePath + "location-gps32.png");
            this.gotoControl.imageOffset = screenOffset.clone();
            this.locateControl.imageOffset = screenOffset.clone();
            this.gotoControl.size = 32;
            this.locateControl.size = 32;
            this.gotoControl.opacity = this._inactiveOpacity;
            this.locateControl.opacity = this._inactiveOpacity;
            this.controls.push(this.gotoControl);
            this.controls.push(this.locateControl);

        };

        // Classic Pattern #3 - Rent and Set Prototype. See JavaScript Patterns - Code Reuse Patterns
        EnhancedViewControlsLayer.prototype = Object.create(ViewControlsLayer.prototype);


        // Copied from parent. Modified to perform vertical layout.
        EnhancedViewControlsLayer.prototype.doRender = function (dc) {
            // Let the parent perform the default horizontal layout
            if (this.orientation !== "vertical") {
                ViewControlsLayer.prototype.doRender(dc);
                return;
            }
            // Othewise, do vertical layout (copied from ViewControlsLayer and edited).

            var controlPanelWidth = 64,
                controlPanelHeight = 0,
                panelOffset,
                screenOffset,
                x,
                y;

            this.inCurrentFrame = false; // to track whether any control is displayed this frame

            // Determine the dimensions of the control panel and whether any control is displayed.
            if (this.showPanControl) {
                controlPanelHeight += this.panControl.size;
                this.inCurrentFrame = true;
            }
            if (this.showZoomControl) {
                controlPanelHeight += this.zoomInControl.size;
                this.inCurrentFrame = true;
            }
            if (this.showHeadingControl) {
                controlPanelHeight += this.headingLeftControl.size;
                this.inCurrentFrame = true;
            }
            if (this.showTiltControl) {
                controlPanelHeight += this.tiltDownControl.size;
                this.inCurrentFrame = true;
            }
            if (this.showExaggerationControl) {
                controlPanelHeight += this.exaggerationDownControl.size;
                this.inCurrentFrame = true;
            }
            if (this.showFieldOfViewControl) {
                controlPanelHeight += this.fovNarrowControl.size;
                this.inCurrentFrame = true;
            }

            // Determine the lower-left corner position of the control collection.
            screenOffset = this.placement.offsetForSize(dc.navigatorState.viewport.width,
                dc.navigatorState.viewport.height);
            panelOffset = this.alignment.offsetForSize(controlPanelWidth, controlPanelHeight);
            x = screenOffset[0] - panelOffset[0];
            y = screenOffset[1] - panelOffset[1];

            // Determine the control positions and render the controls.

            if (this.showPanControl) {
                this.panControl.screenOffset.x = x;
                this.panControl.screenOffset.y = y;
                this.panControl.render(dc);
                this.panControlCenter[0] = x + this.panControl.size / 2;
                this.panControlCenter[1] = y + this.panControl.size / 2;
                y -= (this.panControl.size / 2);
            }

            if (this.showZoomControl) {
                this.zoomOutControl.screenOffset.x = x;
                this.zoomOutControl.screenOffset.y = y;
                this.zoomInControl.screenOffset.x = x + this.zoomOutControl.size;
                this.zoomInControl.screenOffset.y = y;
                this.zoomOutControl.render(dc);
                this.zoomInControl.render(dc);
                y -= this.zoomOutControl.size;
            }

            if (this.showHeadingControl) {
                this.headingRightControl.screenOffset.x = x;
                this.headingRightControl.screenOffset.y = y;
                this.headingLeftControl.screenOffset.x = x + this.headingLeftControl.size;
                this.headingLeftControl.screenOffset.y = y;
                this.headingRightControl.render(dc);
                this.headingLeftControl.render(dc);
                y -= this.headingLeftControl.size;
            }

            if (this.showTiltControl) {
                this.tiltDownControl.screenOffset.x = x;
                this.tiltDownControl.screenOffset.y = y;
                this.tiltUpControl.screenOffset.x = x + this.tiltDownControl.size;
                this.tiltUpControl.screenOffset.y = y;
                this.tiltDownControl.render(dc);
                this.tiltUpControl.render(dc);
                y -= this.tiltDownControl.size;
            }

            if (this.showExaggerationControl) {
                this.exaggerationDownControl.screenOffset.x = x;
                this.exaggerationDownControl.screenOffset.y = y;
                this.exaggerationUpControl.screenOffset.x = x + this.exaggerationDownControl.size;
                this.exaggerationUpControl.screenOffset.y = y;
                this.exaggerationUpControl.render(dc);
                this.exaggerationDownControl.render(dc);
                y -= this.exaggerationDownControl.size;
            }

            if (this.showFieldOfViewControl) {
                this.fovNarrowControl.screenOffset.x = x;
                this.fovNarrowControl.screenOffset.y = y;
                this.fovWideControl.screenOffset.x = x + this.fovNarrowControl.size;
                this.fovWideControl.screenOffset.y = y;
                this.fovNarrowControl.render(dc);
                this.fovWideControl.render(dc);
            }
            // TODO: following block to be depreciated in favor of stand alone Goto/Set Location button.
            this.gotoControl.screenOffset.x = x;
            this.gotoControl.screenOffset.y = y;
            this.locateControl.screenOffset.x = x + this.gotoControl.size;
            this.locateControl.screenOffset.y = y;
            this.gotoControl.render(dc);
            this.locateControl.render(dc);
        };

        // Copied from parent. Augmented to include goto and locate controls
        EnhancedViewControlsLayer.prototype.determineOperation = function (ignore, topObject) {
            var operation = null;

            if (topObject && (topObject instanceof WorldWind.ScreenImage)) {
                if (topObject === this.panControl) {
                    operation = this.handlePan;
                } else if (topObject === this.zoomInControl
                    || topObject === this.zoomOutControl) {
                    operation = this.handleZoom;
                } else if (topObject === this.headingLeftControl
                    || topObject === this.headingRightControl) {
                    operation = this.handleHeading;
                } else if (topObject === this.tiltUpControl
                    || topObject === this.tiltDownControl) {
                    operation = this.handleTilt;
                } else if (topObject === this.exaggerationUpControl
                    || topObject === this.exaggerationDownControl) {
                    operation = this.handleExaggeration;
                } else if (topObject === this.fovNarrowControl
                    || topObject === this.fovWideControl) {
                    operation = this.handleFov;
                } else if (topObject === this.gotoControl) {
                    operation = this.handleGoto;
                } else if (topObject === this.locateControl) {
                    operation = this.handleLocate;
                }
            }

            return operation;
        };



        /**
         * Locate handler.
         * @private
         * @param {type} e
         * @param {type} ignore Control.
         */
        EnhancedViewControlsLayer.prototype.handleLocate = function (e, ignore) {
            // Start an operation on left button down or touch start.
            if ((e.type === "mousedown" && e.which === 1) || (e.type === "touchstart")) {
                e.preventDefault();
                setTimeout(this.locator.locateCurrentPosition(), 50);
            }
        };

        /**
         * Goto handler.
         * @private
         * @param {type} e
         * @param {type} ignore Control.
         */
        EnhancedViewControlsLayer.prototype.handleGoto = function (e, ignore) {
            // Start an operation on left button down or touch start.
            if ((e.type === "mousedown" && e.which === 1) || (e.type === "touchstart")) {
                e.preventDefault();
                setTimeout(this.locator.locateCoordinates(), 50);
            }
        };


        return EnhancedViewControlsLayer;
    }
);