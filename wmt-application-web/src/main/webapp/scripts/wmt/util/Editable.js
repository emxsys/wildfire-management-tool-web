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

define(['wmt/util/Publisher', 'wmt/Wmt'],
    function (Publisher, Wmt) {
        "use strict";
        var Editable = {
            edit: function () {
                if (this.isEditable) {
                    if (this.editMe()) {
                        this.fire(Wmt.EVENT_OBJECT_EDITED, this);
                    }
                }
            },
            /**
             * Adds the the editable capabilities to the given object.
             * @param {Object} o The object that will become editable.
             * @param {Boolean Function()} editCallback The function that performs the edit.
             */
            makeEditable: function (o, editCallback) {
                // Ensure we don't duplicate 
                if (o.edit) {
                    return; // o is already editable
                }
                // Add the function(s)
                var i;
                for (i in Editable) {
                    if (Editable.hasOwnProperty(i) && typeof Editable[i] === 'function') {
                        if (Editable[i] === this.makeEditable) {
                            continue;
                        }
                        o[i] = Editable[i];
                    }
                }
                // Add the properties
                o.isEditable = true;
                o.editMe = editCallback;
                
                // Add the Publisher capability so that events can be generated.
                Publisher.makePublisher(o);
            }
        };
        return Editable;
    }
);

