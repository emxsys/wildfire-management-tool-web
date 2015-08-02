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
 * The WildlandFireViewManager module is responsible for rendering Weather Fires and Weather Stations
 * on the globe and within lists in a panel.
 * 
 * @param {Controller} controller MVC.
 * @param {Log} log Error logger.
 * @param {WildlandFire} WildlandFire
 * @param {Messenger} messenger User notifications.
 * @param {Wmt} wmt Constants.
 * @returns {WildlandFireViewManager}
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/controller/Controller',
    'wmt/util/Log',
    'wmt/util/Messenger',
    'wmt/view/symbols/fire/WildlandFireSymbol',
    'wmt/model/WildlandFire',
    'wmt/Wmt',
    'worldwind'],
    function (
        controller,
        log,
        messenger,
        WildlandFireSymbol,
        WildlandFire,
        wmt,
        ww) {
        "use strict";
        /**
         * 
         * @type type
         */
        var WildlandFireViewManager = {
            /**
             * Initilizes the event handlers. Called once during the application startup.
             */
            initialize: function () {

                this.manager = controller.model.wildlandFireManager;
                this.manager.on(wmt.EVENT_WILDLAND_FIRE_ADDED, this.handleWildlandFireAddedEvent, this);
                this.manager.on(wmt.EVENT_WILDLAND_FIRE_REMOVED, this.handleWildlandFireRemovedEvent, this);

                // Get the RenderableLayer that we'll add the weathers to.
                this.activeFiresLayer = controller.globe.findLayer(wmt.LAYER_NAME_WILDLAND_FIRES);
                this.activeFirePerimetersLayer = controller.globe.findLayer(wmt.LAYER_NAME_WILDLAND_FIRE_PERIMETERS);
                if (!this.activeFiresLayer) {
                    throw new Error(
                        log.error("WildlandFireViewManager", "constructor",
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
                try {
                    // Create the symbol on the globe
                    this.createRenderable(fire);
                    // Update our list of fires
                    this.synchronizeFiresList();
                }
                catch (e) {
                    log.error("WildlandFireViewManager", "handleWildlandFireAddedEvent", e.toString());
                }
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
                    log.error("WildlandFireViewManager", "handleWildlandFireRemovedEvent", e.toString());
                }
            },
            /**
             * Creates a Placemark renderable for the given fire object.
             * @param {WildlandFire} fire
             */
            createRenderable: function (fire) {
                // Add the wildland fire symbol on the globe
                if (fire.type === 'point') {
                    this.activeFiresLayer.addRenderable(new WildlandFireSymbol(fire));
                } else {
                    this.activeFirePerimetersLayer.addRenderable(new WildlandFireSymbol(fire));
                }
            },
            /**
             * Synchronize the wildland fires list with the wildland fires model.
             */
            synchronizeFiresList: function () {
                var self = this,
                    $list = $("#wildlandFireList"),
                    fires = this.manager.fires,
                    fire, i, len, item;

                // This preliminary implemenation does a brute force "clear and repopulate" of the list
                $list.children().remove();
                for (i = 0, len = fires.length; i < len; i += 1) {
                    fire = fires[i];
                    item =
                        '<div class="btn-group btn-block btn-group-sm">' +
                        ' <button type="button" class="col-sm-8 btn btn-default wildland-fire-goto" fireId="' + fire.id + '">' + fire.name + '</button>' +
                        ' <button type="button" class="col-sm-2 btn btn-default wildland-fire-open glyphicon glyphicon-open" style="top: 0" fireId="' + fire.id + '"></button>' +
//                        ' <button type="button" class="col-sm-2 btn btn-default wildland-fire-remove glyphicon glyphicon-trash" style="top: 0" fireId="' + fire.id + '"></button>' +
                        '</div>';
                    $list.append(item);
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
                    messenger.notify(log.error("WildlandFireViewManager", "onFireItemClick", "Could not find selected fire with ID: " + fireId));
                    return;
                }
                switch (action) {
                    case 'goto':
                        controller.lookAtLatLon(fire.latitude, fire.longitude);
                        break;
                    case 'open':
                        fire.open();
                        break;
                    case 'remove':
                        fire.remove();
                        break;
                    default:
                        log.error("WildlandFireViewManager", "onWeatherItemClick", "Unhandled action: " + action);
                }
            }
        };

        return WildlandFireViewManager;
    }
);