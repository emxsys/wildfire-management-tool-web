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

/*global define, WorldWind*/

define([
    '../globe/EnhancedPlacemark',
    '../Wmt',
    '../../nasa/WorldWind'],
    function (
        EnhancedPlacemark,
        Wmt,
        ww) {
        "use strict";

        var WindBarbPlacemark = function (latitude, longitude, windSpdKts, windDirDeg, eyeDistanceScaling) {

            EnhancedPlacemark.call(this, new WorldWind.Position(latitude, longitude, 1000), eyeDistanceScaling);

            this.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            this.attributes = new WorldWind.PlacemarkAttributes(null);
            this.attributes.depthTest = false;
            this.attributes.imageScale = 0.3;
            this.attributes.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5, // Width centered
                WorldWind.OFFSET_FRACTION, 0.5);// Height centered

            //this.highlightAttributes = new WorldWind.PlacemarkAttributes(this.attributes);

            this.imageRotation = 0;

            var img = new Image(),
                knots = Math.round(windSpdKts / 5) * 5, // rounded to 5 kts
                imgName = 'wind_spd-' + knots + 'kts.svg',
                self = this;

            // Draw the image in the canvas after loading
            img.onload = function () {
                var canvas = document.createElement("canvas"),
                    context = canvas.getContext("2d"),
                    size = Math.max(img.width, img.height) * 2,
                    center = size / 2;

                // Create a square canvase
                canvas.width = size;
                canvas.height = size;

                // Draw the image at the center of the canvas
                self.rotateAbout(context, 90 * (Math.PI / 180), center, center);
                context.drawImage(img, center, center);

                //context.translate(48, 32); // center
                //context.rotate(225 * (Math.PI / 180));
                //self.rotateAbout(context, 225 * (Math.PI / 180), 48, 48);
                //context.drawImage(img, 48, 48, img.width, img.height);

                // Assign the loaded image to the placemark
                // Set override the default "unique" key in order to reuse the texture
                self.attributes.imageSource = new WorldWind.ImageSource(canvas);
                //self.attributes.imageSource.key = imgName;
                //self.highlightAttributes.imageSource = new WorldWind.ImageSource(canvas);
            };
            if (windSpdKts === undefined || isNaN(windSpdKts)) {
                imgName = 'wind_spd-50kts.svg';
            }
            else {
                // Wind speed rounded to 5 kts
                imgName = 'wind_spd-' + (Math.round(windSpdKts / 5) * 5) + 'kts.svg';
            }
            // Fire the onload event
            img.src = Wmt.IMAGE_PATH + 'weather/' + imgName;

        };
        // Inherit the Placemark methods (Note: calls the Placemark constructor a 2nd time).
        WindBarbPlacemark.prototype = Object.create(EnhancedPlacemark.prototype);


        /**
         * Rotates theta radians counterclockwise around the point (x,y). This can also be accomplished with a 
         * translate,rotate,translate sequence.
         * @param {Context} c
         * @param {Number} theta Radians
         * @param {Number} x
         * @param {Number} y
         */
        WindBarbPlacemark.prototype.rotateAbout = function (c, theta, x, y) {
            var ct = Math.cos(theta), st = Math.sin(theta);
            c.transform(ct, -st, st, ct, -x * ct - y * st + x, x * st - y * ct + y);
        };

//        /**
//         * Creates a new placemark that is a copy of this placemark.
//         * @returns {WindBarbPlacemark} The new placemark.
//         */
//        WindBarbPlacemark.prototype.clone = function () {
//            var clone = new WindBarbPlacemark(this.position);
//
//            clone.copy(this);
//            clone.pickDelegate = this.pickDelegate ? this.pickDelegate : this;
//            // We used the super's copy() to initialize the clone. Now we have init
//            // our derived object's wind barb properties
//            clone.imageRotation = this.imageRotation;
//
//            return clone;
//        };
//
//        /**
//         * Overrides the Placemark doDrawOrderedPlacemark.
//         * COPIED FROM Placemark. ADDED imageRotation block from ScreenImage.
//         * @param {DeviceContext} dc
//         */
//        WindBarbPlacemark.prototype.doDrawOrderedPlacemark = function (dc) {
//            var gl = dc.currentGlContext,
//                program = dc.currentProgram,
//                depthTest = true,
//                textureBound;
//
//            if (dc.pickingMode) {
//                this.pickColor = dc.uniquePickColor();
//            }
//
//            if (this.eyeDistanceScaling && (this.eyeDistance > this.eyeDistanceScalingLabelThreshold)) {
//                // Target visibility is set to 0 to cause the label to be faded in or out. Nothing else
//                // here uses target visibility.
//                this.targetVisibility = 0;
//            }
//
//            // Compute the effective visibility. Use the current value if picking.
//            if (!dc.pickingMode && this.mustDrawLabel()) {
//                if (this.currentVisibility != this.targetVisibility) {
//                    var visibilityDelta = (dc.timestamp - dc.previousTimestamp) / dc.fadeTime;
//                    if (this.currentVisibility < this.targetVisibility) {
//                        this.currentVisibility = Math.min(1, this.currentVisibility + visibilityDelta);
//                    } else {
//                        this.currentVisibility = Math.max(0, this.currentVisibility - visibilityDelta);
//                    }
//                    dc.redrawRequested = true;
//                }
//            }
//
//            program.loadOpacity(gl, dc.pickingMode ? 1 : this.layer.opacity);
//
//            // Draw the leader line first so that the image and label have visual priority.
//            if (this.mustDrawLeaderLine(dc)) {
//                if (!this.leaderLinePoints) {
//                    this.leaderLinePoints = new Float32Array(6);
//                }
//
//                this.leaderLinePoints[0] = this.groundPoint[0]; // computed during makeOrderedRenderable
//                this.leaderLinePoints[1] = this.groundPoint[1];
//                this.leaderLinePoints[2] = this.groundPoint[2];
//                this.leaderLinePoints[3] = this.placePoint[0]; // computed during makeOrderedRenderable
//                this.leaderLinePoints[4] = this.placePoint[1];
//                this.leaderLinePoints[5] = this.placePoint[2];
//
//                if (!this.leaderLineCacheKey) {
//                    this.leaderLineCacheKey = dc.gpuResourceCache.generateCacheKey();
//                }
//
//                var leaderLineVboId = dc.gpuResourceCache.resourceForKey(this.leaderLineCacheKey);
//                if (!leaderLineVboId) {
//                    leaderLineVboId = gl.createBuffer();
//                    dc.gpuResourceCache.putResource(this.leaderLineCacheKey, leaderLineVboId,
//                        this.leaderLinePoints.length * 4);
//                }
//
//                program.loadTextureEnabled(gl, false);
//                program.loadColor(gl, dc.pickingMode ? this.pickColor :
//                    this.activeAttributes.leaderLineAttributes.outlineColor);
//
//                WorldWind.Placemark.matrix.copy(dc.navigatorState.modelviewProjection);
//                program.loadModelviewProjection(gl, WorldWind.Placemark.matrix);
//
//                if (!this.activeAttributes.leaderLineAttributes.depthTest) {
//                    gl.disable(WebGLRenderingContext.DEPTH_TEST);
//                }
//
//                gl.lineWidth(this.activeAttributes.leaderLineAttributes.outlineWidth);
//
//                gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, leaderLineVboId);
//                gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, this.leaderLinePoints, WebGLRenderingContext.STATIC_DRAW);
//                dc.frameStatistics.incrementVboLoadCount(1);
//                gl.vertexAttribPointer(program.vertexPointLocation, 3, WebGLRenderingContext.FLOAT, false, 0, 0);
//                gl.drawArrays(WebGLRenderingContext.LINES, 0, 2);
//            }
//
//            // Turn off depth testing for the placemark image if requested. The placemark label and leader line have
//            // their own depth-test controls.
//            if (!this.activeAttributes.depthTest) {
//                depthTest = false;
//                gl.disable(WebGLRenderingContext.DEPTH_TEST);
//            }
//
//            // Suppress frame buffer writes for the placemark image and its label.
//            // tag, 6/17/15: It's not clear why this call was here. It was carried over from WWJ.
//            //gl.depthMask(false);
//
//            gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, dc.unitQuadBuffer3());
//            gl.vertexAttribPointer(program.vertexPointLocation, 3, WebGLRenderingContext.FLOAT, false, 0, 0);
//
//            // Compute and specify the MVP matrix.
//            WorldWind.Placemark.matrix.copy(dc.screenProjection);
//            WorldWind.Placemark.matrix.multiplyMatrix(this.imageTransform);
//
//            // BDS: Added this block
//            if (this.imageRotation !== 0) {
//                WorldWind.Placemark.matrix.multiplyByTranslation(0.5, 0.5, 0.5);
//                WorldWind.Placemark.matrix.multiplyByRotation(0, 0, 1, this.imageRotation);
//                WorldWind.Placemark.matrix.multiplyByTranslation(-0.5, -0.5, 0);
//            }
//
//            program.loadModelviewProjection(gl, WorldWind.Placemark.matrix);
//
//            // Enable texture for both normal display and for picking. If picking is enabled in the shader (set in
//            // beginDrawing() above) then the texture's alpha component is still needed in order to modulate the
//            // pick color to mask off transparent pixels.
//            program.loadTextureEnabled(gl, true);
//
//            if (dc.pickingMode) {
//                program.loadColor(gl, this.pickColor);
//            } else {
//                program.loadColor(gl, this.activeAttributes.imageColor);
//            }
//
//            this.texCoordMatrix.setToIdentity();
//            if (this.activeTexture) {
//                this.texCoordMatrix.multiplyByTextureTransform(this.activeTexture);
//            }
//            program.loadTextureMatrix(gl, this.texCoordMatrix);
//
//            if (this.activeTexture) {
//                if (this.activeTexture != WorldWind.Placemark.currentTexture) { // avoid unnecessary texture state changes
//                    textureBound = this.activeTexture.bind(dc); // returns false if active texture is null or cannot be bound
//                    program.loadTextureEnabled(gl, textureBound);
//                    WorldWind.Placemark.currentTexture = this.activeTexture;
//                }
//            } else {
//                program.loadTextureEnabled(gl, false);
//            }
//
//            // Draw the placemark's image quad.
//            gl.drawArrays(WebGLRenderingContext.TRIANGLE_STRIP, 0, 4);
//
//            if (this.mustDrawLabel() && this.currentVisibility > 0) {
//                program.loadOpacity(gl, dc.pickingMode ? 1 : this.layer.opacity * this.currentVisibility);
//
//                WorldWind.Placemark.matrix.copy(dc.screenProjection);
//                WorldWind.Placemark.matrix.multiplyMatrix(this.labelTransform);
//                program.loadModelviewProjection(gl, WorldWind.Placemark.matrix);
//
//                if (!dc.pickingMode && this.labelTexture) {
//                    this.texCoordMatrix.setToIdentity();
//                    this.texCoordMatrix.multiplyByTextureTransform(this.labelTexture);
//
//                    program.loadTextureMatrix(gl, this.texCoordMatrix);
//                    program.loadColor(gl, this.activeAttributes.labelAttributes.color);
//
//                    textureBound = this.labelTexture.bind(dc);
//                    program.loadTextureEnabled(gl, textureBound);
//                    WorldWind.Placemark.currentTexture = this.labelTexture;
//                } else {
//                    program.loadTextureEnabled(gl, false);
//                    program.loadColor(gl, this.pickColor);
//                }
//
//                if (this.activeAttributes.labelAttributes.depthTest) {
//                    if (!depthTest) {
//                        depthTest = true;
//                        gl.enable(WebGLRenderingContext.DEPTH_TEST);
//                    }
//                } else {
//                    depthTest = false;
//                    gl.disable(WebGLRenderingContext.DEPTH_TEST);
//                }
//
//                gl.drawArrays(WebGLRenderingContext.TRIANGLE_STRIP, 0, 4);
//            }
//
//            if (!depthTest) {
//                gl.enable(WebGLRenderingContext.DEPTH_TEST);
//            }
//
//            // tag, 6/17/15: See note on depthMask above in this function.
//            //gl.depthMask(true);
//        };


        return WindBarbPlacemark;
    }
);

