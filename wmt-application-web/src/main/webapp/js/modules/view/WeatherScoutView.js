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
 * The WeatherScoutViewManager module is responsible for rendering Weather Scouts and Weather Stations
 * on the globe and within lists in a panel.
 * 
 * @param {Controller} controller MVC.
 * @param {Log} log Error logger.
 * @param {WeatherScout} WeatherScout
 * @param {Messenger} messenger User notifications.
 * @param {Wmt} wmt Constants.
 * @returns {WeatherScoutViewManager}
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/controller/Controller',
    'wmt/util/Log',
    'wmt/util/Messenger',
    'wmt/view/symbols/weather/WeatherMapSymbol',
    'wmt/model/WeatherScout',
    'wmt/Wmt',
    'worldwind'],
    function (
        controller,
        log,
        messenger,
        WeatherMapSymbol,
        WeatherScout,
        wmt,
        ww) {
        "use strict";
        /**
         * 
         * @type type
         */
        var WeatherScoutViewManager = {
            /**
             * Initilizes the event handlers. Called once during the application startup.
             */
            initialize: function () {

                this.manager = controller.model.weatherScoutManager;
                this.manager.on(wmt.EVENT_WEATHER_SCOUT_ADDED, this.handleWeatherScoutAddedEvent, this);
                this.manager.on(wmt.EVENT_WEATHER_SCOUT_REMOVED, this.handleWeatherScoutRemovedEvent, this);

                // Get the RenderableLayer that we'll add the weathers to.
                this.weatherLayer = controller.globe.findLayer(wmt.LAYER_NAME_WEATHER);
                if (!this.weatherLayer) {
                    throw new Error(
                        log.error("WeatherScoutViewManager", "constructor",
                            "Could not find a Layer named " + wmt.LAYER_NAME_WEATHER));
                }

                // Add button event handlers
                $(".createWeatherScoutButton").on("click", function (event) {
                    controller.dropWeatherScoutOnGlobe(new WeatherScout());
                });

                // Initially show the Scouts tab
                $('#weatherScoutsBody').collapse('show');

            },
            /**
             * Creates a renderable and UI representatiions for the given scout object
             * @param {WeatherScout} wxScout 
             */
            handleWeatherScoutAddedEvent: function (wxScout) {
                if (!this.weatherLayer) {
                    return;
                }
                try {
                    // Create the symbol on the globe
                    this.createRenderable(wxScout);
                    // Update our list of scouts
                    this.synchronizeWeatherList();
                }
                catch (e) {
                    log.error("WeatherScoutViewManager", "handleWeatherAddedEvent", e.toString());
                }
            },
            /**
             * Removes the given scout from the globe and the scout list.
             * @param {WeatherScout} wxScout
             */
            handleWeatherScoutRemovedEvent: function (wxScout) {
                var i, max, renderable;

                if (!this.weatherLayer) {
                    // The model is initialized before this panel is initialized
                    return;
                }
                try {
                    for (i = 0, max = this.weatherLayer.renderables.length; i < max; i++) {
                        renderable = this.weatherLayer.renderables[i];
                        if (renderable.wxScout.id === wxScout.id) {
                            this.weatherLayer.renderables.splice(i, 1);
                            break;
                        }
                    }
                    this.synchronizeWeatherList();
                }
                catch (e) {
                    log.error("WeatherScoutViewManager", "handleWeatherRemovedEvent", e.toString());
                }
            },
            /**
             * Creates a Placemark renderable for the given scout object.
             * @param {WeatherScout} wxScout
             */
            createRenderable: function (wxScout) {
                // Add the weather scout symbol on the globe
                this.weatherLayer.addRenderable(new WeatherMapSymbol(wxScout));
            },
            /**
             * Synchronize the weather list with the weather scout model.
             */
            synchronizeWeatherList: function () {
                var self = this,
                    $list = $("#weatherScoutList"),
                    scouts = this.manager.scouts,
                    scout, i, len, item;

                // This preliminary implemenation does a brute force "clear and repopulate" of the list
                $list.children().remove();
                for (i = 0, len = scouts.length; i < len; i += 1) {
                    scout = scouts[i];
                    item =
                        '<div class="btn-group btn-block btn-group-sm">' +
                        ' <button type="button" class="col-sm-8 btn btn-default wxscout-goto" scoutId="' + scout.id + '">'
                            + scout.name + ': ' + scout.latitude.toFixed(3) + ',' + scout.longitude.toFixed(3) + '</button>' +
                        ' <button type="button" class="col-sm-2 btn btn-default wxscout-open glyphicon glyphicon-pencil" style="top: 0" scoutId="' + scout.id + '"></button>' +
                        ' <button type="button" class="col-sm-2 btn btn-default wxscout-remove glyphicon glyphicon-trash" style="top: 0" scoutId="' + scout.id + '"></button>' +
                        '</div>';
                    $list.append(item);
                }

                // Add event handler to the buttons
                $list.find('button.wxscout-goto').on('click', function (event) {
                    self.onWeatherItemClick($(this).attr('scoutId'), "goto");
                });
                $list.find('button.wxscout-open').on('click', function (event) {
                    self.onWeatherItemClick($(this).attr('scoutId'), "open");
                });
                $list.find('button.wxscout-remove').on('click', function (event) {
                    self.onWeatherItemClick($(this).attr('scoutId'), "remove");
                });
            },
            /**
             * Handler for clicking any one of the weather buttons in the weather list.  
             * @param {$(li)} scoutId List item element
             * @param {string} action "goto", "edit", or remove
             */
            onWeatherItemClick: function (scoutId, action) {
                var scout = this.manager.findScout(scoutId);

                if (!scout) {
                    messenger.notify(log.error("WeatherScoutViewManager", "onWeatherItemClick", "Could not find selected scout with ID: " + scoutId));
                    return;
                }
                switch (action) {
                    case 'goto':
                        controller.lookAtLatLon(scout.latitude, scout.longitude);
                        break;
                    case 'open':
                        scout.open();
                        break;
                    case 'remove':
                        scout.remove();
                        break;
                    default:
                        log.error("WeatherScoutViewManager", "onWeatherItemClick", "Unhandled action: " + action);
                }
            }
        };

        return WeatherScoutViewManager;
    }
);