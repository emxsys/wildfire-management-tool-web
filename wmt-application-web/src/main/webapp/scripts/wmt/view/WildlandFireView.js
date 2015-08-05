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
 * The WildlandFireView module is responsible for rendering Weather Fires and Weather Stations
 * on the globe and within lists in a panel.
 * 
 * @param {Controller} controller MVC.
 * @param {Log} log Error logger.
 * @param {Messenger} messenger User notifications.
 * @param {Wmt} wmt Constants.
 * @param {WorldWind} ww 
 * @returns {WildlandFireView}
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/controller/Controller',
    'wmt/util/Log',
    'wmt/util/Messenger',
    'wmt/view/symbols/fire/WildlandFireSymbol',
    'wmt/Wmt',
    'worldwind'],
    function (
        controller,
        log,
        messenger,
        WildlandFireSymbol,
        wmt,
        ww) {
        "use strict";
        /**
         * 
         * @type type
         */
        var WildlandFireView = {
            /**
             * Initilizes the event handlers. Called once during the application startup.
             */
            initialize: function () {

                this.manager = controller.model.wildlandFireManager;
                this.manager.on(wmt.EVENT_WILDLAND_FIRE_ADDED, this.handleWildlandFireAddedEvent, this);
                this.manager.on(wmt.EVENT_WILDLAND_FIRES_ADDED, this.handleWildlandFiresAddedEvent, this);
                this.manager.on(wmt.EVENT_WILDLAND_FIRE_REMOVED, this.handleWildlandFireRemovedEvent, this);
                // Get the RenderableLayer that we'll add the weathers to.
                this.activeFiresLayer = controller.globe.findLayer(wmt.LAYER_NAME_WILDLAND_FIRES);
                this.activeFirePerimetersLayer = controller.globe.findLayer(wmt.LAYER_NAME_WILDLAND_FIRE_PERIMETERS);
                if (!this.activeFiresLayer) {
                    throw new Error(
                        log.error("WildlandFireView", "constructor",
                            "Could not find a Layer named " + wmt.LAYER_NAME_WILDLAND_FIRES));
                }
            },
            /**
             * Creates a renderable and UI representatiions for the given fire object
             * @param {WildlandFire} fire 
             */
            handleWildlandFireAddedEvent: function (fire) {
                if (!this.activeFiresLayer) {
                    return;
                }
                // Create the symbol on the globe
                this.createRenderable(fire);
                // Update our list of fires
                this.synchronizeFiresList();
            },
            /**
             * Creates a renderable and UI representatiions for the array of fire objects
             * @param {WildlandFire[]} fires 
             */
            handleWildlandFiresAddedEvent: function (fires) {
                if (!this.activeFiresLayer) {
                    return;
                }
                for (var i = 0, max = fires.length; i < max; i++) {
                    // Create the symbol on the globe
                    this.createRenderable(fires[i]);
                }
                // Update our list of fires
                this.synchronizeFiresList();
            },
            /**
             * Removes the given fire from the globe and the fire list.
             * @param {WildlandFire} fire
             */
            handleWildlandFireRemovedEvent: function (fire) {
                var i, max, renderable;
                if (!this.activeFiresLayer) {
                    // The model is initialized before this panel is initialized
                    return;
                }
                try {
                    for (i = 0, max = this.activeFiresLayer.renderables.length; i < max; i++) {
                        renderable = this.activeFiresLayer.renderables[i];
                        if (renderable.wxFire.id === fire.id) {
                            this.activeFiresLayer.renderables.splice(i, 1);
                            break;
                        }
                    }
                    this.synchronizeFiresList();
                }
                catch (e) {
                    log.error("WildlandFireView", "handleWildlandFireRemovedEvent", e.toString());
                }
            },
            /**
             * Creates a renderable for the given fire object.
             * @param {WildlandFire} fire
             */
            createRenderable: function (fire) {
                // Add the wildland fire symbol on the globe
                if (fire.geometry) {
                    var symbol = new WildlandFireSymbol(fire);
                    if (fire.featureType === wmt.WILDLAND_FIRE_POINT) {
                        this.activeFiresLayer.addRenderable(symbol);
                    } else if (fire.featureType === wmt.WILDLAND_FIRE_PERIMETER) {
                        this.activeFirePerimetersLayer.addRenderable(symbol);
                    }
                }
            },
            findRenderable: function (fire) {
                // Add the wildland fire symbol on the globe
                var layer, i, max, renderable;
                if (fire.featureType === wmt.WILDLAND_FIRE_POINT) {
                    layer = this.activeFiresLayer;
                } else if (fire.featureType === wmt.WILDLAND_FIRE_PERIMETER) {
                    layer = this.activeFirePerimetersLayer;
                }
                for (i = 0, max = layer.renderables.length; i < max; i++) {
                    renderable = layer.renderables[i];
                    if (renderable.fire && renderable.fire.id === fire.id) {
                        return renderable;
                    }
                }
                return null;
            },
            /**
             * Synchronize the wildland fires list with the wildland fires model.
             */
            synchronizeFiresList: function () {
                var self = this,
                    $list = $("#wildlandFireList"),
                    fires = this.manager.fires.slice(0), // naive copy
                    fire, i, len, item,
                    currState, collapseId, headingId,
                    $stateDiv, $heading, $title, $anchor, $bodyParent, $body;

                // This preliminary implemenation does a brute force "clear and repopulate" of the list
                $list.children().remove();

                // Sort by State, Name
                fires.sort(function (a, b) {
                    if (a.state < b.state) {
                        return -1;
                    }
                    if (a.state > b.state) {
                        return 1;
                    }
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                });

                for (i = 0, len = fires.length; i < len; i += 1) {
                    fire = fires[i];
                    if (fire.state !== currState) {
                        // Create an accordion panel for the state
                        currState = fire.state;
                        headingId = 'wildfire-state-heading-' + currState;
                        collapseId = 'wildfire-state-body-' + currState;
                        $stateDiv = $('<div class="panel panel-default"></div>');
                        $heading = $('<div class="panel-heading" role="tab" id="' + headingId + '"></div>');
                        $title = $('<h4 class="panel-title"></h4>');
                        $anchor = $('<a data-toggle="collapse" href="#' + collapseId + '"' +
                            ' aria-expanded="true" aria-controls="' + collapseId + '">' + currState + '</a>');
                        $bodyParent = $('<div id="' + collapseId + '" class="panel-collapse collapse" role="tabpanel"' +
                            ' aria-labelledby="' + headingId + '"></div>');
                        $body = $('<div style=""></div>');

                        // Assemble the accordion panel
                        $title.append($anchor);
                        $heading.append($title);
                        $stateDiv.append($heading);
                        $bodyParent.append($body);
                        $stateDiv.append($bodyParent);

                        $list.append($stateDiv);
                    }
                    item =
                        '<div class= "btn-group btn-block btn-group-sm">' +
                        ' <button type="button" class="col-xs-8 btn btn-default wildland-fire-goto" fireId="' + fire.id + '">' + fire.state + ' ' + fire.name + ' (' + fire.featureType + ') </button>' +
                        ' <button type="button" class="col-xs-2 btn btn-default wildland-fire-open glyphicon glyphicon-open" style="top: 0" fireId="' + fire.id + '"></button>' +
//                        ' <button type="button" class="col-sm-2 btn btn-default wildland-fire-remove glyphicon glyphicon-trash" style="top: 0" fireId="' + fire.id + '"></button>' +
                        '</div>';

                    $body.append(item);
                }

                // Add event handler to the buttons
                $list.find('button.wildland-fire-goto').on('click', function (event) {
                    self.onFireItemClick($(this).attr('fireId'), "goto");
                });
                $list.find('button.wildland-fire-open').on('click', function (event) {
                    self.onFireItemClick($(this).attr('fireId'), "open");
                });
                $list.find('button.wildland-fire-remove').on('click', function (event) {
                    self.onFireItemClick($(this).attr('fireId'), "remove");
                });
            },
            /**
             * Handler for clicking any one of the wildland fire buttons in the wildland fires list.  
             * @param {$(li)} fireId List item element
             * @param {string} action "goto", "edit", or remove
             */
            onFireItemClick: function (fireId, action) {
                var fire = this.manager.findFire(fireId);
                if (!fire) {
                    messenger.notify(log.error("WildlandFireView", "onFireItemClick", "Could not find selected fire with ID: " + fireId));
                    return;
                }
                switch (action) {
                    case 'goto':
                        this.goto(fire);
                        break;
                    case 'show':
                        this.show(fire);
                        break;
                    case 'open':
                        fire.open();
                        break;
                    case 'remove':
                        // TODO: find the renderable(s) and set enabled to false
                        break;
                    default:
                        log.error("WildlandFireView", "onWeatherItemClick", "Unhandled action: " + action);
                }
            },
            goto: function (fire) {
                if (fire.geometry) {
                    controller.lookAtLatLon(fire.latitude, fire.longitude);
                    return;
                }
                var deferred = $.Deferred(),
                    self = this;
                // Load the fire's geometry before continuing
                fire.loadDeferredGeometry(deferred);
                $.when(deferred).done(function (resolvedFire) {
                    // Center the crosshairs on the fire
                    controller.lookAtLatLon(resolvedFire.latitude, resolvedFire.longitude);
                    // Now that we have geometry, go ahead and load the new symbol/shape for the fire
                    self.createRenderable(resolvedFire);
                });

            },
            show: function (fire) {
                var renderable = this.findRenderable(fire),
                    deferred = $.Deferred(),
                    self = this;

                if (renderable) {
                    renderable.enabled = true;
                    return;
                }

                this.loadDeferredGeometry(deferred);
                $.when(deferred).done(function (resolvedFire) {
                    self.createRenderable(resolvedFire);
                });
            },
            hide: function (fire) {
                var renderable = this.findRenderable(fire);
                if (renderable) {
                    renderable.enabled = false;
                }
            }

        };
        return WildlandFireView;
    }
);