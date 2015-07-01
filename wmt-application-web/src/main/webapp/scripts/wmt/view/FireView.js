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
 * The FireView module is responsible for rendering Fire Lookouts 
 * on the globe and within lists in a panel.
 * 
 * @param {Controller} controller MVC.
 * @param {Log} log Error logger.
 * @param {FireLookout} FireLookout
 * @param {Messenger} messenger User notifications.
 * @param {Wmt} wmt Constants.
 * @returns {FireView}
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/controller/Controller',
    'wmt/util/Log',
    'wmt/util/Messenger',
    'wmt/model/FireLookout',
    'wmt/Wmt',
    'worldwind'],
    function (
        controller,
        log,
        messenger,
        FireLookout,
        wmt,
        ww) {
        "use strict";
        var FireView = {
            initialize: function () {

                this.manager = controller.model.fireLookoutManager;
                this.manager.on(wmt.EVENT_FIRE_LOOKOUT_ADDED, this.handleFireLookoutAddedEvent, this);
                this.manager.on(wmt.EVENT_FIRE_LOOKOUT_REMOVED, this.handleFireLookoutRemovedEvent, this);

                // Get the RenderableLayer that we'll add the fires to.
                this.fireLayer = controller.globe.findLayer(wmt.FIRE_BEHAVIOR_LAYER_NAME);
                if (!this.fireLayer) {
                    throw new Error(
                        log.error("FireView", "constructor",
                            "Could not find a Layer named " + wmt.FIRE_BEHAVIOR_LAYER_NAME));
                }

                // Add button event handlers
                $("#createFireLookout").on("click", function (event) {
                    controller.dropFireLookoutOnGlobe(new FireLookout());
                });               
                
                // Initially show the Lookouts tab
                $('#fireLookoutsBody').collapse('show');
                
                this.loadExistingFireLookouts();
            },
            /**
             * Load lookouts from persistant storage
             */
            loadExistingFireLookouts: function () {
                var lookouts = this.manager.lookouts,
                    i, max;
                // Invoke our add event handler for each lookout
                for (i = 0, max = lookouts.length; i < max; i++) {
                    this.handleFireLookoutAddedEvent(lookouts[i]);
                }
            },
            /**
             * Creates a renderable and UI representatiions for the given lookout object
             * @param {FireLookout} lookout 
             */
            handleFireLookoutAddedEvent: function (lookout) {
                if (!this.fireLayer) {
                    return;
                }
                try {
                    // Create the symbol on the globe
                    this.createRenderable(lookout);
                    // Update our list of lookouts
                    this.synchronizeFireList();
                }
                catch (e) {
                    log.error("FireView", "handleFireAddedEvent", e.toString());
                }
            },
            /**
             * Removes the given lookout from the globe and the lookout list.
             * @param {FireLookout} lookout
             */
            handleFireLookoutRemovedEvent: function (lookout) {
                var i, max, renderable;

                if (!this.fireLayer) {
                    // The model is initialized before this panel is initialized
                    return;
                }
                try {
                    for (i = 0, max = this.fireLayer.renderables.length; i < max; i++) {
                        renderable = this.fireLayer.renderables[i];
                        if (renderable.lookout.id === lookout.id) {
                            this.fireLayer.renderables.splice(i, 1);
                            break;
                        }
                    }
                    this.synchronizeFireList();
                }
                catch (e) {
                    log.error("FireView", "handleFireRemovedEvent", e.toString());
                }
            },
            /**
             * Creates a Placemark renderable for the given lookout object.
             * @param {FireLookout} lookout
             */
            createRenderable: function (lookout) {
                // Add the fire lookout symbol on the globe
                this.fireLayer.addRenderable(new FireMapSymbol(lookout));
            },
            /**
             * Synchronize the fire list with the fire lookout model.
             */
            synchronizeFireList: function () {
                var self = this,
                    $list = $("#fireLookoutList"),
                    lookouts = this.manager.lookouts,
                    lookout, i, len, item;

                // This preliminary implemenation does a brute force "clear and repopulate" of the list
                $list.children().remove();
                for (i = 0, len = lookouts.length; i < len; i += 1) {
                    lookout = lookouts[i];
                    item =
                        '<div class="btn-group btn-block btn-group-sm">' +
                        ' <button type="button" class="col-sm-8 btn btn-default lookout-goto" lookoutId="' + lookout.id + '">' + lookout.name + '</button>' +
                        ' <button type="button" class="col-sm-2 btn btn-default lookout-open glyphicon glyphicon-pencil" style="top: 0" lookoutId="' + lookout.id + '"></button>' +
                        ' <button type="button" class="col-sm-2 btn btn-default lookout-remove glyphicon glyphicon-trash" style="top: 0" lookoutId="' + lookout.id + '"></button>' +
                        '</div>';
                    $list.append(item);
                }

                // Add event handler to the buttons
                $list.find('button.lookout-goto').on('click', function (event) {
                    self.onFireItemClick($(this).attr('lookoutId'), "goto");
                });
                $list.find('button.lookout-open').on('click', function (event) {
                    self.onFireItemClick($(this).attr('lookoutId'), "open");
                });
                $list.find('button.lookout-remove').on('click', function (event) {
                    self.onFireItemClick($(this).attr('lookoutId'), "remove");
                });
            },
            /**
             * Handler for clicking any one of the fire buttons in the fire list.  
             * @param {$(li)} lookoutId List item element
             * @param {string} action "goto", "edit", or remove
             */
            onFireItemClick: function (lookoutId, action) {
                var lookout = this.manager.findLookout(lookoutId);

                if (!lookout) {
                    messenger.notify(log.error("FireView", "onFireItemClick", "Could not find selected lookout with ID: " + lookoutId));
                    return;
                }
                switch (action) {
                    case 'goto':
                        controller.lookAtLatLon(lookout.latitude, lookout.longitude);
                        break;
                    case 'open':
                        lookout.open();
                        break;
                    case 'remove':
                        lookout.remove();
                        break;
                    default:
                        log.error("FireView", "onFireItemClick", "Unhandled action: " + action);
                }
            }
        };

        return FireView;
    }
);