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
 * The TimeWidget module renders a composite WorldWind.Renderable representing a time and sunlight data.
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/controller/Controller',
    'wmt/util/Formatter',
    'wmt/Wmt',
    'worldwind'],
    function (
        controller,
        formatter,
        wmt,
        ww) {
        "use strict";

        var TimeWidget = function () {
            // Inherit Renderable properties
            WorldWind.Renderable.call(this);

            // Position in lower right corner
            var LEFT_MARGIN = 10,
                BOTTOM_MARGIN = 25,
                BG_HEIGHT = 104,
                DIAL_HEIGHT = 95,
                DIAL_RADIUS = DIAL_HEIGHT / 2,
                DIAL_MARGIN = (BG_HEIGHT - DIAL_HEIGHT) / 2,
                DIAL_ORIGIN_X = DIAL_RADIUS + LEFT_MARGIN ,
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
                    WorldWind.OFFSET_PIXELS, -LEFT_MARGIN,
                    WorldWind.OFFSET_PIXELS, -BOTTOM_MARGIN),
                dialOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_PIXELS, -LEFT_MARGIN - DIAL_MARGIN,
                    WorldWind.OFFSET_PIXELS, -BOTTOM_MARGIN - DIAL_MARGIN),
                faceOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_PIXELS, -LEFT_MARGIN - DIAL_MARGIN - 2.5,
                    WorldWind.OFFSET_PIXELS, -BOTTOM_MARGIN - DIAL_MARGIN - 2.5),
                dialOrigin = new WorldWind.Offset(
                    WorldWind.OFFSET_PIXELS, DIAL_ORIGIN_X,
                    WorldWind.OFFSET_PIXELS, DIAL_ORIGIN_Y),
                timeOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_PIXELS, LEFT_MARGIN + 52,
                    WorldWind.OFFSET_PIXELS, BOTTOM_MARGIN + 65),
                dateOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_PIXELS, LEFT_MARGIN + 52,
                    WorldWind.OFFSET_PIXELS, BOTTOM_MARGIN + 35),
                riseOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_PIXELS, 0,
                    WorldWind.OFFSET_PIXELS, BOTTOM_MARGIN - 25),
                setsOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_PIXELS, 65,
                    WorldWind.OFFSET_PIXELS, BOTTOM_MARGIN - 25),
                rise2Offset = new WorldWind.Offset(
                    WorldWind.OFFSET_PIXELS, -25,
                    WorldWind.OFFSET_PIXELS, BOTTOM_MARGIN - 45),
                sets2Offset = new WorldWind.Offset(
                    WorldWind.OFFSET_PIXELS, -85,
                    WorldWind.OFFSET_PIXELS, BOTTOM_MARGIN - 45),
                textAttr = new WorldWind.TextAttributes(null);
            // Graphics
            this.background = new WorldWind.ScreenImage(lowerLeft, wmt.IMAGE_PATH + "widget-circle-bg.png");
            this.background.imageOffset = backgroundOffset;

            this.daytime = new WorldWind.ScreenImage(lowerLeft, wmt.IMAGE_PATH + "time-widget_day-sky.png");
            this.daytime.imageOffset = dialOffset;

            this.night = new WorldWind.ScreenImage(lowerLeft, wmt.IMAGE_PATH + "time-widget_night-sky.png");
            this.night.imageOffset = dialOffset;

            this.clockface = new WorldWind.ScreenImage(lowerLeft, wmt.IMAGE_PATH + "time-widget_clockface.png");
            this.clockface.imageOffset = faceOffset;

            this.sunIcon = new WorldWind.ScreenImage(dialOrigin, wmt.IMAGE_PATH + "sun-icon.png");
            this.sunIcon.imageOffset = center;

            this.sunriseMarker = new WorldWind.ScreenImage(dialOrigin, wmt.IMAGE_PATH + "time-widget_sunrise-marker.png");
            this.sunriseMarker.imageOffset = center;

            this.sunsetMarker = new WorldWind.ScreenImage(dialOrigin, wmt.IMAGE_PATH + "time-widget_sunset-marker.png");
            this.sunsetMarker.imageOffset = center;

            this.sunriseIcon = new WorldWind.ScreenImage(lowerLeft, wmt.IMAGE_PATH + "time-widget_sunrise-icon.png");
            this.sunriseIcon.imageOffset = rise2Offset;

            this.sunsetIcon = new WorldWind.ScreenImage(lowerLeft, wmt.IMAGE_PATH + "time-widget_sunset-icon.png");
            this.sunsetIcon.imageOffset = sets2Offset;

            // Text
            // Common Attributes
            textAttr.color = WorldWind.Color.WHITE;
            textAttr.font = new WorldWind.Font(18);
            textAttr.offset = center;

            this.date = new WorldWind.ScreenText(dateOffset, "Date");
            this.date.alwaysOnTop = true;
            this.date.attributes = textAttr;

            this.time = new WorldWind.ScreenText(timeOffset, "Time");
            this.time.alwaysOnTop = true;
            this.time.attributes = textAttr;

            this.sunrise = new WorldWind.ScreenText(riseOffset, "Sunrise");
            this.sunrise.alwaysOnTop = true;
            this.sunrise.attributes = new WorldWind.TextAttributes(textAttr);
            this.sunrise.attributes.offset = lowerLeft;

            this.sunset = new WorldWind.ScreenText(setsOffset, "Sunset");
            this.sunset.alwaysOnTop = true;
            this.sunset.attributes = new WorldWind.TextAttributes(textAttr);
            this.sunset.attributes.offset = lowerLeft;

            // Initial time
            this.apptime = new Date();

            /**
             * Handles EVENT_TIME_CHANGED.
             */
            this.handleTimeChangedEvent = function (time) {
                this.apptime = time;
                this.updateDateTimeText();
                controller.globe.redraw();
            };
            /**
             * Handles EVENT_SUNLIGHT_CHANGED.
             */
            this.handleSunlightChangedEvent = function (sunlight) {
                this.sunlight = sunlight;
                this.updateSunlightText();
                controller.globe.redraw();
            };
            controller.model.on(wmt.EVENT_TIME_CHANGED, this.handleTimeChangedEvent, this);
            controller.model.on(wmt.EVENT_SUNLIGHT_CHANGED, this.handleSunlightChangedEvent, this);
        };
        // Inherit Renderable functions.
        TimeWidget.prototype = Object.create(WorldWind.Renderable.prototype);


        TimeWidget.prototype.updateDateTimeText = function () {
            var timeOptions = {hour: "2-digit", minute: "2-digit", timeZoneName: "short", hour12: false},
            dateOptions = {"month": "2-digit", "day": "2-digit"};
            this.time.text = this.apptime.toLocaleTimeString('en', timeOptions);
            this.date.text = this.apptime.toLocaleDateString('en', dateOptions);
        };


        TimeWidget.prototype.updateSunlightText = function () {
            var shortTimeOptions = {hour: "2-digit", minute: "2-digit", hour12: false},
            isoDate = this.apptime.toISOString().substr(0, 11),
                sunriseTime = new Date(isoDate + this.sunlight.sunriseTime),
                sunsetTime = new Date(isoDate + this.sunlight.sunsetTime);
            this.sunrise.text = sunriseTime.toLocaleTimeString('en', shortTimeOptions);
            this.sunset.text = sunsetTime.toLocaleTimeString('en', shortTimeOptions);
        };

        /**
         * Render this LocationWidget. 
         * @param {DrawContext} dc The current draw context.
         */
        TimeWidget.prototype.render = function (dc) {

            // HACK: Don't allow rotation values to go to zero 
            // else z-ording gets confused with non-rotated images
            // appearing on top of rotated images.
            var localHour = this.sunlight.localHourAngle.value,
                sunriseHour = this.sunlight.sunriseHourAngle.value,
                sunsetHour = this.sunlight.sunsetHourAngle.value,
                RADIUS = 50,
                solarPt = TimeWidget.rotatePoint(0, -RADIUS, 0, 0, -localHour); // rotate from 6 o'clock
//                Pt = LocationWidget.rotatePoint(0, -RADIUS, 0, 0, heading - aspect), // rotate from 6 o'clock
//                azimuth = this.sunlight.azimuthAngle.value,
//
//            // Translate icons around the dial
//            this.sunriseMarker.imageOffset = new WorldWind.Offset(
//                WorldWind.OFFSET_PIXELS, aspectPt.x,
//                WorldWind.OFFSET_PIXELS, aspectPt.y);
//            // Rotate the aspect "diamond" icon
//            // No need to rotate the solar icon - it's a circle
//            this.sunriseMarker.imageRotation = 180 + heading - aspect;
            this.sunIcon.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_PIXELS, solarPt.x,
                WorldWind.OFFSET_PIXELS, solarPt.y);

//            // Rotate the dials
//            //  Rotate the these static images as a hack to force it behind the other rotated images
            this.background.imageRotation = 0.0001; // HACK
            this.clockface.imageRotation = 0.0001;
            this.daytime.imageRotation = 0.0001;

            this.background.render(dc);
            this.daytime.render(dc);
            //this.night.render(dc);
            this.clockface.render(dc);
            this.sunriseMarker.render(dc);
            this.sunsetMarker.render(dc);
            this.sunIcon.render(dc);
            this.sunriseIcon.render(dc);
            this.sunsetIcon.render(dc);

            this.date.render(dc);
            this.time.render(dc);
            this.sunrise.render(dc);
            this.sunset.render(dc);
        };

        TimeWidget.rotatePoint = function (pointX, pointY, originX, originY, angle) {
            angle = angle * Math.PI / 180.0;
            return {
                x: Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
                y: Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY};
        };

        return TimeWidget;
    }
);
