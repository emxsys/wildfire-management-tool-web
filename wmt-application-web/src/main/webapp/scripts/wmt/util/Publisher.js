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

define([],
    function () {
        "use strict";
        var Publisher = {
            subscribers: {
                any: []
            },
            on: function (type, fn, context) {
                type = type || 'any';
                fn = typeof fn === "function" ? fn : context[fn];

                if ((typeof this.subscribers[type]) === "undefined") {
                    this.subscribers[type] = [];
                }
                this.subscribers[type].push({fn: fn, context: context || this});
            },
            remove: function (type, fn, context) {
                this.visitSubscribers('unsubscribe', type, fn, context);
            },
            fire: function (type, publication) {
                this.visitSubscribers('publish', type, publication);
            },
            visitSubscribers: function (action, type, arg, context) {
                var pubtype = type || 'any',
                    subscribers = this.subscribers[pubtype],
                    i,
                    max = subscribers ? subscribers.length : 0;

                for (i = 0; i < max; i += 1) {
                    if (action === 'publish') {
                        subscribers[i].fn.call(subscribers[i].context, arg);
                    } else {
                        if (subscribers[i].fn === arg && subscribers[i].context === context) {
                            subscribers.splice(i, 1);
                        }
                    }
                }
            },
            makePublisher: function (o) {
                var i;
                for (i in Publisher) {
                    if (Publisher.hasOwnProperty(i) && typeof Publisher[i] === 'function') {
                        o[i] = Publisher[i];
                    }
                }
                o.subscribers = {any: []};
            }
        };
        return Publisher;
    }
);

