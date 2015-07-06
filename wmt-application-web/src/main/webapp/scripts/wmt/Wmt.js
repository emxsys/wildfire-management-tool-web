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

/**
 * WMT Configuration and constants
 * 
 * @author Bruce Schubert
 */
define([],
    function () {
        "use strict";
        /**
         * This is the top-level WMT module. It is global.
         * @exports Wmt
         * @global
         */
        var Wmt = {
            /**
             * The WMT version number.
             * @constant
             */
            VERSION: "0.4.0",
            BUTTON_TEXT_CANCEL: 'Cancel',
            BUTTON_TEXT_GOTO: 'Go To',
            BUTTON_TEXT_NO: 'No',
            BUTTON_TEXT_OK: 'OK',
            BUTTON_TEXT_SAVE: 'Save',
            BUTTON_TEXT_YES: 'Yes',
            EVENT_FIRE_BEHAVIOR_CHANGED: "fireBehaviorChanged",
            EVENT_FIRE_LOOKOUT_ADDED: "fireLookoutAdded",
            EVENT_FIRE_LOOKOUT_CHANGED: "fireLookoutChanged",
            EVENT_FIRE_LOOKOUT_REMOVED: "fireLookoutRemoved",
            EVENT_FUELMOISTURE_CHANGED: "fuelMoistureChanged",
            EVENT_MARKER_ADDED: "markerAdded",
            EVENT_MARKER_CHANGED: "markerChanged",
            EVENT_MARKER_REMOVED: "markerRemoved",
            /**
             * Publish/subscibe event name for notifcation of mouse position on the globe.
             * @constant
             */
            EVENT_MOUSE_MOVED: "mouseMoved",
            EVENT_OBJECT_OPENED: "objectOpened",
            EVENT_OBJECT_CHANGED: "objectChanged",
            EVENT_OBJECT_MOVE_STARTED: "objectMoveStarted",
            EVENT_OBJECT_MOVED: "objectMoved",
            EVENT_OBJECT_MOVE_FINISHED: "objectMoveFinished",
            EVENT_OBJECT_REMOVED: "objectRemoved",
            EVENT_OBJECT_SELECTED: "objectSelected",
            EVENT_PLACE_CHANGED: "placeChanged",
            /**
             * Publish/subscibe event name for notifcation of changes in the sunlight.
             * @constant
             */
            EVENT_SUNLIGHT_CHANGED: "sunlightChanged",
            EVENT_SURFACEFUEL_CHANGED: "surfaceFuelChanged",
            EVENT_SURFACEFIRE_CHANGED: "surfaceFireChanged",
            EVENT_TERRAIN_CHANGED: "terrainChanged",
            /**
             * Publish/subscibe event name for notifcation of changes in the application time.
             * @constant
             */
            EVENT_TIME_CHANGED: "timeChanged",
            /**
             * Publish/subscribe event name for notification of changes in the globe viewpoint.
             * @constant
             */
            EVENT_VIEWPOINT_CHANGED: "viewpointChanged",
            EVENT_WEATHER_CHANGED: "weatherChanged",
            EVENT_WEATHER_SCOUT_ADDED: "weatherScoutAdded",
            EVENT_WEATHER_SCOUT_CHANGED: "weatherScoutChanged",
            EVENT_WEATHER_SCOUT_REMOVED: "weatherScoutRemoved",
            /**
             * The display name for the layer that displays fire behavior lookouts.
             */
            FIRE_BEHAVIOR_LAYER_NAME: "Fire Lookouts",
            /**
             * The display name for the layer that displays fire perimeters and related data.
             */
            FIRE_PERIMETERS_LAYER_NAME: "Fire Perimeters",
            /**
             * The URL for the fuel models REST service.
             */
            FUELMODELS_REST_SERVICE: "/wmt-rest/rs/fuelmodels",
            /**
             * The URL for the fuel models REST service.
             */
            FUELMOISTURE_REST_SERVICE: "/wmt-rest/rs/fuelmoisture",
            /**
             * Base URL for WMT application images. (Do not use a relative path.)
             */
            IMAGE_PATH: "scripts/wmt/images/",
            /**
             * The display name for the layer that displays markers.
             */

            LAYER_NAME_COMPASS: "Compass",
            LAYER_NAME_RETICLE: "Crosshairs",
            LAYER_NAME_SKY: "Sky",
            LAYER_NAME_VIEW_CONTROLS: "Controls",
            LAYER_NAME_WIDGETS: "Widgets",
            MARKERS_LAYER_NAME: "Markers",
            MAP_SYMBOL_ALTITUDE_WEATHER: 500,
            MAP_SYMBOL_ALTITUDE_WILDFIRE: 250,
            /**
             * The maximum range that the globe can be zoomed out to.
             * @default 20,000,000 meters.
             */
            NAVIGATOR_MAX_RANGE: 20000000,
            PROJECTION_NAME_3D: "3D",
            PROJECTION_NAME_EQ_RECT: "Equirectangular",
            PROJECTION_NAME_MERCATOR: "Mercator",
            PROJECTION_NAME_NORTH_POLAR: "North Polar",
            PROJECTION_NAME_SOUTH_POLAR: "South Polar",
            PROJECTION_NAME_NORTH_UPS: "North UPS",
            PROJECTION_NAME_SOUTH_UPS: "South UPS",
            /**
             * The local storage key for fire lookouts.
             */
            STORAGE_KEY_FIRE_LOOKOUTS: "firelookouts",
            /**
             * The local storage key for markers.
             */
            STORAGE_KEY_MARKERS: "markers",
            /**
             * The local storage key for weather scouts.
             */
            STORAGE_KEY_WEATHER_SCOUTS: "wxscouts",
            /**
             * The URL for the sunlight REST service.
             */
            SUNLIGHT_REST_SERVICE: "/wmt-rest/rs/sunlight",
            /**
             * The URL for the surface fuel REST service.
             */
            SURFACEFUEL_REST_SERVICE: "/wmt-rest/rs/surfacefuel",
            /**
             * The URL for the surface fire REST service.
             */
            SURFACEFIRE_REST_SERVICE: "/wmt-rest/rs/surfacefire",
            /**
             * The URL for the terrain REST service.
             */
            TERRAIN_REST_SERVICE: "/wmt-rest/rs/terrain",
            /**
             * The display name for the layer that displays weather stations and lookouts.
             */
            WEATHER_LAYER_NAME: "Weather",
            /**
             * The URL for the weather REST service.
             */
            WEATHER_REST_SERVICE: "/wmt-rest/rs/weather",
            /**
             * Base URL for Web World Wind SDK. (Do not use a reltive path.)
             * @default "scripts/nasa/"
             * @constant
             */
            WORLD_WIND_PATH: "thirdparty/nasa/"

        };
        /**
         * Holds configuration parameters for WMT. Applications may modify these parameters prior to creating
         * their first WMT objects. Configuration properties are:
         * <ul>
         *     <li><code>startupLatitude</code>: Initial "look at" latitude. Default is Ventura, CA.
         *     <li><code>startupLongitude</code>: Initial "look at" longitude. Default is Venura, CA.
         *     <li><code>startupLongitude</code>: Initial altitude/eye position. Default 0.
         *     <li><code>startupHeading</code>: Initial view heading. Default 0.
         *     <li><code>startupTilt</code>: Initial view tilt. Default 0.
         *     <li><code>startupRoll</code>: Initial view roll. Default 0.
         *     <li><code>viewControlOrientation</code>: horizontal or vertical. Default vertical.
         *     <li><code>showPanControl</code>: Show pan (left/right/up/down) controls. Default false.
         *     <li><code>showExaggerationControl</code>: Show vertical exaggeration controls. Default false.
         *     <li><code>wxForecastDurationHours</code>: Number hours for a weather forecast. Default 24.
         * </ul>
         */
        Wmt.configuration = {
            defaultFuelModel: 6,
            defaultFuelMoistureScenario:'Very Low Dead, Fully Cured Herb',
            startupLatitude: 34.29,
            startupLongitude: -119.29,
            startupAltitude: 5000,
            startupHeading: 0,
            startupTilt: 0,
            startupRoll: 0,
            viewControlOrientation: "vertical",
            showPanControl: false,
            showExaggerationControl: false,
            showFieldOfViewControl: false,
            wxForecastDurationHours: 48
        };

        return Wmt;
    }
);