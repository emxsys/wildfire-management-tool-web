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

/*global define, $, WorldWind */

/**
 * The LocationWidget module renders a composite WorldWind.Renderable representing 
 * location, orientation, terrain and solar data.
 * 
 * @param {Controller} controller
 * @param {Formatter} formatter
 * @param {Viewpoint} Viewpoint
 * @param {Wmt} wmt
 * @param {WorldWind} ww
 * @returns {LocationWidget}
 * @author Bruce Schubert
 */
define([
    'wmt/controller/Controller',
    'wmt/util/Formatter',
    'wmt/globe/Viewpoint',
    'wmt/Wmt',
    'worldwind'],
    function (
        controller,
        formatter,
        Viewpoint,
        wmt,
        ww) {
        "use strict";

        var LocationWidget = function () {
            // Inherit Renderable properties
            WorldWind.Renderable.call(this);

            // Position in lower right corner
            var RIGHT_MARGIN = 10,
                BOTTOM_MARGIN = 25,
                BG_HEIGHT = 104,
                DIAL_HEIGHT = 95,
                DIAL_RADIUS = DIAL_HEIGHT / 2,
                DIAL_MARGIN = (BG_HEIGHT - DIAL_HEIGHT) / 2,
                DIAL_ORIGIN_X = DIAL_RADIUS + RIGHT_MARGIN + 10,
                DIAL_ORIGIN_Y = DIAL_RADIUS + BOTTOM_MARGIN - 2,
                center = new WorldWind.Offset(
                    WorldWind.OFFSET_FRACTION, 0.5,
                    WorldWind.OFFSET_FRACTION, 0.5),
                lowerLeft = new WorldWind.Offset(
                    WorldWind.OFFSET_FRACTION, 0,
                    WorldWind.OFFSET_FRACTION, 0),
                lowerRight = new WorldWind.Offset(
                    WorldWind.OFFSET_FRACTION, 1,
                    WorldWind.OFFSET_FRACTION, 0),
                backgroundOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_INSET_PIXELS, -RIGHT_MARGIN,
                    WorldWind.OFFSET_INSET_PIXELS, BOTTOM_MARGIN + BG_HEIGHT),
                dialOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_INSET_PIXELS, -RIGHT_MARGIN - DIAL_MARGIN,
                    WorldWind.OFFSET_INSET_PIXELS, BOTTOM_MARGIN + DIAL_MARGIN + DIAL_HEIGHT),
                dialOrigin = new WorldWind.Offset(
                    WorldWind.OFFSET_INSET_PIXELS, DIAL_ORIGIN_X,
                    WorldWind.OFFSET_PIXELS, DIAL_ORIGIN_Y),
//                dialOrigin = new WorldWind.Offset(
//                    WorldWind.OFFSET_INSET_PIXELS, -RIGHT_MARGIN - DIAL_MARGIN - DIAL_RADIUS,
//                    WorldWind.OFFSET_INSET_PIXELS, BOTTOM_MARGIN + DIAL_MARGIN + DIAL_RADIUS),
                latOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_INSET_PIXELS, 65,
                    WorldWind.OFFSET_PIXELS, BOTTOM_MARGIN + 65),
                lonOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_INSET_PIXELS, 65,
                    WorldWind.OFFSET_PIXELS, BOTTOM_MARGIN + 35),
                elvOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_INSET_PIXELS, RIGHT_MARGIN,
                    WorldWind.OFFSET_PIXELS, BOTTOM_MARGIN - 25),
                slpOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_INSET_PIXELS, RIGHT_MARGIN + 110,
                    WorldWind.OFFSET_PIXELS, BOTTOM_MARGIN - 25),
                textAttr = new WorldWind.TextAttributes(null);
            // Graphics
            this.background = new WorldWind.ScreenImage(lowerRight, wmt.IMAGE_PATH + "widget-circle-bg.png");
            this.background.imageOffset = backgroundOffset;

            this.inclinometer = new WorldWind.ScreenImage(lowerRight, wmt.IMAGE_PATH + "location-widget_inclinometer.png");
            this.inclinometer.imageOffset = dialOffset;

            this.compassRose = new WorldWind.ScreenImage(lowerRight, wmt.IMAGE_PATH + "location-widget_compass.png");
            this.compassRose.imageOffset = dialOffset;

            this.aspectIcon = new WorldWind.ScreenImage(dialOrigin, wmt.IMAGE_PATH + "location-widget_aspect-icon.png");
            this.aspectIcon.imageOffset = center;

            this.solarIcon = new WorldWind.ScreenImage(dialOrigin, wmt.IMAGE_PATH + "sun-icon.png");
            this.solarIcon.imageOffset = center;


            // Text
            // Common Attributes
            textAttr.color = WorldWind.Color.WHITE;
            textAttr.font = new WorldWind.Font(18);
            textAttr.offset = center;

            this.latitude = new WorldWind.ScreenText(latOffset, "Latitude");
            this.latitude.alwaysOnTop = true;
            this.latitude.attributes = textAttr;

            this.longitude = new WorldWind.ScreenText(lonOffset, "Longitude");
            this.longitude.alwaysOnTop = true;
            this.longitude.attributes = textAttr;

            this.elevation = new WorldWind.ScreenText(elvOffset, "Elevation");
            this.elevation.alwaysOnTop = true;
            this.elevation.attributes = new WorldWind.TextAttributes(textAttr);
            this.elevation.attributes.offset = lowerRight;

            this.slope = new WorldWind.ScreenText(slpOffset, "Slope");
            this.slope.alwaysOnTop = true;
            this.slope.attributes = new WorldWind.TextAttributes(textAttr);
            this.slope.attributes.offset = lowerLeft;

            /**
             * Handles EVENT_VIEWPOINT_CHANGED.
             */
            this.handleViewpointChangedEvent = function (viewpoint) {
                this.viewpoint = viewpoint;
                this.updateLocationText();
                controller.globe.redraw();
            };
            /**
             * Handles EVENT_SUNLIGHT_CHANGED.
             */
            this.handleSunlightChangedEvent = function (sunlight) {
                this.sunlight = sunlight;
                controller.globe.redraw();
            };
            
            // Subscribe to changes
            controller.model.on(wmt.EVENT_VIEWPOINT_CHANGED, this.handleViewpointChangedEvent, this);
            controller.model.on(wmt.EVENT_SUNLIGHT_CHANGED, this.handleSunlightChangedEvent, this);
            
            // Load Initial values
            this.handleViewpointChangedEvent(controller.model.viewpoint);
            this.handleSunlightChangedEvent(controller.model.sunlight);
            
        };
        // Inherit Renderable functions.
        LocationWidget.prototype = Object.create(WorldWind.Renderable.prototype);

        // Updates the text components
        LocationWidget.prototype.updateLocationText = function () {
            this.latitude.text = formatter.formatDecimalDegreesLat(this.viewpoint.target.latitude, 3);
            this.longitude.text = formatter.formatDecimalDegreesLon(this.viewpoint.target.longitude, 3);
            this.elevation.text = formatter.formatAltitude(this.viewpoint.target.elevation, 'm');
            this.slope.text = formatter.formatAngle360(this.viewpoint.target.slope, 0);
        };

        /**
         * Render this LocationWidget. 
         * @param {DrawContext} dc The current draw context.
         */
        LocationWidget.prototype.render = function (dc) {

            // HACK: Don't allow rotation values to go to zero 
            // else z-ording gets confused with non-rotated images
            // appearing on top of rotated images.
            var RADIUS = 50,
                heading = dc.navigatorState.heading || 0.001,
                slope = this.viewpoint.target.slope || 0.001,
                aspect = this.viewpoint.target.aspect || 0.001,
                aspectPt = LocationWidget.rotatePoint(0, -RADIUS, 0, 0, heading - aspect), // rotate from 6 o'clock
                azimuth = this.sunlight.azimuthAngle ? this.sunlight.azimuthAngle.value : 0,
                solarPt = LocationWidget.rotatePoint(0, -RADIUS, 0, 0, heading - azimuth); // rotate from 6 o'clock

            // Translate icons around the dial
            this.aspectIcon.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_PIXELS, aspectPt.x,
                WorldWind.OFFSET_PIXELS, aspectPt.y);
            this.solarIcon.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_PIXELS, solarPt.x,
                WorldWind.OFFSET_PIXELS, solarPt.y);
            // Rotate the aspect "diamond" icon
            // No need to rotate the solar icon - it's a circle
            this.aspectIcon.imageRotation = 180 + heading - aspect;

            // Rotate the dials
            //  Rotate the background as a hack to force it behind the other layers
            this.background.imageRotation = heading; // HACK
            this.compassRose.imageRotation = heading;
            this.inclinometer.imageRotation = slope;

            this.background.render(dc);
            this.inclinometer.render(dc);
            this.compassRose.render(dc);
            this.aspectIcon.render(dc);
            this.solarIcon.render(dc);

            this.latitude.render(dc);
            this.longitude.render(dc);
            this.elevation.render(dc);
            this.slope.render(dc);
        };

        LocationWidget.rotatePoint = function (pointX, pointY, originX, originY, angle) {
            angle = angle * Math.PI / 180.0;
            return {
                x: Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
                y: Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY};
        };

        return LocationWidget;
    }
);
