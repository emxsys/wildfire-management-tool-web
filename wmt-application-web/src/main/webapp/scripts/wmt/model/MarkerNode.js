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
    'wmt/util/ContextSensitive',
    'wmt/util/Openable',
    'wmt/util/Log',
    'wmt/view/MarkerViewer',
    'wmt/util/Messenger',
    'wmt/util/Movable',
    'wmt/util/Removable',
    'wmt/util/WmtUtil'],
    function (
        contextSensitive,
        openable,
        log,
        markerViewer,
        messenger,
        movable,
        removable,
        util) {
        "use strict";

        var MarkerNode = function (params) {
            
            var arg = params || {};

            // Make movable by the SelectController: Fires the EVENT_OBJECT_MOVE... events.
            movable.makeMovable(this);

            // Make openable via menus: Fires the EVENT_OBJECT_OPENED event on success.
            openable.makeOpenable(this, function () {
                markerViewer.show(this);
                return true; // return true to fire EVENT_OBJECT_OPENED event.
            });
            // Make deletable via menu: Fires the EVENT_OBJECT_REMOVED event on success.
            removable.makeRemovable(this, function () {
                // TODO: Ask for confirmation; return false if veto'd
                return true;    // return true to fire a notification that allows the delete to proceed.
            });
            // Make context sensiive by the SelectController: shows the context menu.
            contextSensitive.makeContextSenstive(this, function () {
                messenger.infoGrowl("Show menu with delete, open, and lock/unlock", "TODO");
            });

            /**
             * The unique id used to identify this particular marker object
             */
            this.id = arg.id || util.guid();
            this.name = arg.name === undefined ? 'Marker' : arg.name;
            this.type = arg.type;
            this.latitude = arg.latitude;
            this.longitude = arg.longitude;
            this.isMovable = arg.isMovable === undefined ? true : arg.isMovable;
        };


        return MarkerNode;

    }
);

