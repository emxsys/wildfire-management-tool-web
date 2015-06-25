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

define(['../util/Publisher', '../Wmt'],
    function (Publisher, Wmt) {
        "use strict";
        var Removable = {
            remove: function () {
                if (this.canRemove) {
                    if (this.removeMe()) {
                        this.fire(Wmt.EVENT_OBJECT_REMOVED, this);
                    }
                }
            },
            /**
             * Adds the the movable capabilities to the given object.
             * @param {Object} o The object that will become removable.
             * @param {Boolean Function()} removeCallback The function that performs the remove.
             */
            makeRemovable: function (o, removeCallback) {
                // Ensure we don't duplicate 
                if (o.removeMe) {
                    return; // o is already removable
                }
                // Add the function(s)
                var i;
                for (i in Removable) {
                    if (Removable.hasOwnProperty(i) && typeof Removable[i] === 'function') {
                        if (Removable[i] === this.makeRemovable) {
                            continue;
                        }
                        o[i] = Removable[i];
                    }
                }
                // Add the properties
                o.canRemove = true;
                o.removeMe = removeCallback;
                
                // Add the Publisher capability so that events can be generated.
                Publisher.makePublisher(o);
            }
        };
        return Removable;
    }
);

