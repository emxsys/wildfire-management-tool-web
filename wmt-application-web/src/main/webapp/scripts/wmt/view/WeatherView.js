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


/**
 * The WeatherView module is responsible for rendering Weather Lookouts and Weather Stations
 * on the globe and within lists in a panel.
 * 
 * @param {type} Log
 * @param {type} WeatherLookout
 * @param {type} Messenger
 * @param {type} Wmt
 * @returns {WeatherView}
 */
define([
    '../util/Log',
    '../model/WeatherLookout',
    '../view/WeatherMapSymbol',
    '../util/Messenger',
    '../Wmt',
    'worldwind'],
    function (
        Log,
        WeatherLookout,
        WeatherMapSymbol,
        Messenger,
        Wmt,
        ww) {
        "use strict";
        /**
         * @constructor
         * @param {type} controller
         * @returns {WeatherView}
         */
        var WeatherView = function (controller) {

            this.ctrl = controller;
            this.manager = this.ctrl.model.weatherLookoutManager;
            this.manager.on(Wmt.EVENT_WEATHER_LOOKOUT_ADDED, this.handleWeatherAddedEvent, this);
            this.manager.on(Wmt.EVENT_WEATHER_LOOKOUT_REMOVED, this.handleWeatherRemovedEvent, this);

            // Get the RenderableLayer that we'll add the weathers to.
            this.weatherLayer = this.ctrl.findLayer(Wmt.WEATHER_LAYER_NAME);
            if (!this.weatherLayer) {
                throw new Error(
                    Log.error("WeatherView", "constructor",
                        "Could not find a Layer named " + Wmt.WEATHER_LAYER_NAME));
            }

            // Initialize the common attributes for the weather lookout Placemark symbol
            this.commonAttr = new WorldWind.PlacemarkAttributes(null);
            this.commonAttr.imageColor = WorldWind.Color.WHITE;
            this.commonAttr.imageScale = 1.0;
            this.commonAttr.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 0.0);
            this.commonAttr.labelAttributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 1.0);
            this.commonAttr.labelAttributes.color = WorldWind.Color.YELLOW;
            this.commonAttr.drawLeaderLine = true;
            this.commonAttr.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

            // Load markers from local storage
            this.loadExistingWeatherLookouts();

            // Add button event handlers
            var self = this;
            $("#createWeatherLookout").on("click", function (event) {
                self.ctrl.addWeatherLookoutToGlobe(new WeatherLookout());
            });
            // Initially show the Lookouts tab
            $('#weatherLookoutsBody').collapse('show');
        };



        WeatherView.prototype.loadExistingWeatherLookouts = function () {
            var lookouts = this.manager.wxLookouts,
                i, max;
            // Invoke our add event handler for each lookout
            for (i = 0, max = lookouts.length; i < max; i++) {
                this.handleWeatherAddedEvent(lookouts[i]);
            }
        };


        WeatherView.prototype.handleWeatherAddedEvent = function (wxLookout) {
            if (!this.weatherLayer) {
                return;
            }
            try {
                // Create the symbol on the globe
                this.createRenderable(wxLookout);
                // Update our list of lookouts
                this.synchronizeWeatherList();
            }
            catch (e) {
                Log.error("WeatherView", "handleWeatherAddedEvent", e.toString());
            }
        };


        /**
         * Removes the given lookout from the globe and the lookout list.
         * @param {WeatherLookout} wxLookout
         */
        WeatherView.prototype.handleWeatherRemovedEvent = function (wxLookout) {
            var i, max, renderable;

            if (!this.weatherLayer) {
                // The model is initialized before this panel is initialized
                return;
            }
            try {
                for (i = 0, max = this.weatherLayer.renderables.length; i < max; i++) {
                    renderable = this.weatherLayer.renderables[i];
                    if (renderable.displayName === wxLookout.name) {
                        this.weatherLayer.renderables.splice(i, 1);
                        break;
                    }
                }
                this.synchronizeWeatherList();
            }
            catch (e) {
                Log.error("WeatherView", "handleWeatherRemovedEvent", e.toString());
            }
        };


        /**
         * Creates a Placemark renderable for the given lookout object.
         * @param {WeatherLookout} wxLookout
         */
        WeatherView.prototype.createRenderable = function (wxLookout) {
            var wxMapSymbol,
                placemark,
                placemarkAttr,
                highlightAttr,
                canvas = document.createElement("canvas"),
                ctx2d = canvas.getContext("2d"),
                img;

            wxMapSymbol = new WeatherMapSymbol(wxLookout);


            // Add the weather lookout symbol on the globe
            this.weatherLayer.addRenderable(wxMapSymbol);
        };


        /**
         * Synchronize the weather list with the weather lookout model.
         */
        WeatherView.prototype.synchronizeWeatherList = function () {
            var self = this,
                $list = $("#weatherLookoutList"),
                lookouts = this.manager.wxLookouts,
                lookout, i, len, item;

            // This preliminary implemenation does a brute force "clear and repopulate" of the list
            $list.children().remove();
            for (i = 0, len = lookouts.length; i < len; i += 1) {
                lookout = lookouts[i];
                item =
                    '<div class="btn-group btn-block btn-group-sm">' +
                    ' <button type="button" class="col-sm-8 btn btn-default wxlookout-goto">' + lookout.name + '</button>' +
                    ' <button type="button" class="col-sm-2 btn btn-default wxlookout-edit glyphicon glyphicon-pencil" style="top: 0" lookoutName="' + lookout.name + '"></button>' +
                    ' <button type="button" class="col-sm-2 btn btn-default wxlookout-remove glyphicon glyphicon-trash" style="top: 0" lookoutName="' + lookout.name + '"></button>' +
                    '</div>';
                $list.append(item);
            }
            this.ctrl.redrawGlobe();

            // Add event handler to the buttons
            $list.find('button.wxlookout-goto').on('click', function (event) {
                self.onWeatherItemClick($(this).text(), "goto");
            });
            $list.find('button.wxlookout-edit').on('click', function (event) {
                self.onWeatherItemClick($(this).attr('lookoutName'), "edit");
            });
            $list.find('button.wxlookout-remove').on('click', function (event) {
                self.onWeatherItemClick($(this).attr('lookoutName'), "remove");
            });
        };

        /**
         * Handler for clicking any one of the weather buttons in the weather list.  
         * @param {$(li)} lookoutName List item element
         * @param {string} action "goto", "edit", or remove
         */
        WeatherView.prototype.onWeatherItemClick = function (lookoutName, action) {
            var lookouts = this.manager.wxLookouts,
                lookout,
                i, len;

            for (i = 0, len = lookouts.length; i < len; i += 1) {
                lookout = lookouts[i];
                if (lookout.name === lookoutName) {
                    switch (action) {
                        case 'goto':
                            this.ctrl.lookAtLatLon(lookout.latitude, lookout.longitude);
                            break;
                        case 'edit':
                            Messenger.infoGrowl('Rename is not implemented yet.');
                            Log.error("WeatherView", "onWeatherItemClick", "Not implemented action: " + action);
                            break;
                        case 'remove':
                            this.manager.removeLookout(lookout.name);
                            break;
                        default:
                            Log.error("WeatherView", "onWeatherItemClick", "Unhandled action: " + action);
                    }
                    return;
                }
            }
            Log.error("WeatherView", "onWeatherItemClick", "Could not find selected weather in Weathers layer.");
        };


        return WeatherView;
    }
);