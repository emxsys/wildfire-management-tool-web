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
    '../../nasa/geom/Angle',
    '../util/Log',
    '../../nasa/navigate/LookAtNavigator',
    '../../nasa/geom/Matrix',
    '../../nasa/navigate/NavigatorState',
    '../../nasa/geom/Location',
    '../../nasa/geom/Position',
    '../../nasa/geom/Vec3',
    '../../nasa/util/WWMath'],
    function (
        Angle,
        Log,
        LookAtNavigator,
        Matrix,
        NavigatorState,
        Location,
        Position,
        Vec3,
        WWMath) {
        "use strict";
        var EnhancedLookAtNavigator = function (worldWindow) {
            // Using Classic Inheriticance Pattern #3 - Rent and Set Prototype. See JavaScript Patterns
            LookAtNavigator.call(this, worldWindow);

            this.wwd = worldWindow;
            this.lastEyePosition = new Position();
            // Use the parent object's 'safe' settings for our initial 'last' settings
            this.lastLookAtLocation = new Location(this.lookAtLocation.latitude, this.lookAtLocation.longitude);
            this.lastRange = this.range;
            this.lastHeading = this.heading;
            this.lastTilt = this.tilt;
            this.lastRoll = this.roll;

        };
        EnhancedLookAtNavigator.prototype = Object.create(LookAtNavigator.prototype);


        /**
         * Limit the navigator's position and orientation appropriately for the current scene.
         */
        EnhancedLookAtNavigator.prototype.applyLimits = function () {

            if (!this.validateEyePosition()) {
                // Eye position is invalid, so restore the last navigator settings
                this.lookAtLocation.latitude = this.lastLookAtLocation.latitude;
                this.lookAtLocation.longitude = this.lastLookAtLocation.longitude;
                this.range = this.lastRange;
                this.heading = this.lastHeading;
                this.tilt = this.lastTilt;
                this.roll = this.lastRoll;
            }
            // Clamp latitude to between -90 and +90, and normalize longitude to between -180 and +180.
            this.lookAtLocation.latitude = WWMath.clamp(this.lookAtLocation.latitude, -90, 90);
            this.lookAtLocation.longitude = Angle.normalizedDegreesLongitude(this.lookAtLocation.longitude);

            // Clamp range to values greater than 1 in order to prevent degenerating to a first-person navigator when
            // range is zero.
            this.range = WWMath.clamp(this.range, 1, Number.MAX_VALUE);

            // Normalize heading to between -180 and +180.
            this.heading = Angle.normalizedDegrees(this.heading);

            // Clamp tilt to between 0 and +90 to prevent the viewer from going upside down.
            this.tilt = WWMath.clamp(this.tilt, 0, 90);

            // Normalize heading to between -180 and +180.
            this.roll = Angle.normalizedDegrees(this.roll);

            // Apply 2D limits when the globe is 2D.
            if (this.worldWindow.globe.is2D() && this.enable2DLimits) {
                // Clamp range to prevent more than 360 degrees of visible longitude.
                var nearDist = this.nearDistance,
                    nearWidth = WWMath.perspectiveFrustumRectangle(this.worldWindow.viewport, nearDist).width,
                    maxRange = 2 * Math.PI * this.worldWindow.globe.equatorialRadius * (nearDist / nearWidth);
                this.range = WWMath.clamp(this.range, 1, maxRange);

                // Force tilt to 0 when in 2D mode to keep the viewer looking straight down.
                this.tilt = 0;
            }
            // Cache the nav settings 
            this.lastLookAtLocation.latitude = this.lookAtLocation.latitude;
            this.lastLookAtLocation.longitude = this.lookAtLocation.longitude;
            this.lastRange = this.range;
            this.lastHeading = this.heading;
            this.lastTilt = this.tilt;
            this.lastRoll = this.roll;

        };
        /**
         * Validate the eye position is not below the terrain.
         * @returns {Boolean}
         */
        EnhancedLookAtNavigator.prototype.validateEyePosition = function () {
            var wwd = this.wwd,
                navigatorState = this.intermediateState(),
                eyePoint = navigatorState.eyePoint,
                eyePos = new Position(),
                terrainElev;

            // Get the eye position in geographic coords
            wwd.globe.computePositionFromPoint(eyePoint[0], eyePoint[1], eyePoint[2], eyePos);
            if (!eyePos.equals(this.lastEyePosition)) {
                // Validate the new eye position to ensure it doesn't go below the terrain surface
                terrainElev = wwd.globe.elevationAtLocation(eyePos.latitude, eyePos.longitude);
                if (eyePos.altitude < terrainElev) {
                    //Log.error("EnhancedLookAtNavigator", "validateEyePosition", "eyePos (" + eyePos.altitude + ") is below ground level (" + terrainElev + ").");
                    return false;
                }
            }
            this.lastEyePosition.copy(eyePos);
            return true;
        };
        
        
        /**
         * 
         * @returns {EnhancedLookAtNavigator_L44.EnhancedLookAtNavigator.prototype@call;currentStateForModelview}
         */
        EnhancedLookAtNavigator.prototype.intermediateState = function () {
            //this.applyLimits();
            var globe = this.worldWindow.globe,
                lookAtPosition = new Position(this.lookAtLocation.latitude, this.lookAtLocation.longitude, 0),
                modelview = Matrix.fromIdentity();
            
            modelview.multiplyByLookAtModelview(lookAtPosition, this.range, this.heading, this.tilt, this.roll, globe);

            return this.currentStateForModelview(modelview);
        };

        return EnhancedLookAtNavigator;
    }
);

