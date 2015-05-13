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

/**
 * The Messenger module is responsible for user notifications.
 */
define([
    '../../../thirdparty/primeui-1.1/production/primeui-1.1-min'],
    function (
        PrimeUI) {
        "use strict";
        /**
         * @constructor
         * @exports Messenger
         */
        var Messenger = {
            /**
             * Displays popup message for a few seconds.
             * @param {String} style "info", "warn" or "error".
             * @param {String} title Message summary.
             * @param {String} message Message detail.
             * @param {Number} duration Time to show message in milliseconds.
             */
            growl: function (style, title, message, duration) {
                //initialize
                $('#growl').puigrowl({life: duration});
                //show messages
                $('#growl').puigrowl('show',
                    [{
                            severity: style,
                            summary: title,
                            detail: message}]
                    );
            },
            notify: function (html) {
                //initialize
                //$('#notify').puinotify();
                $('#notify').puinotify({
                    easing: 'easeInOutCirc',
                    position: 'bottom'
                });
                $('#notify').puinotify('show', html);
            }
        };
        return Messenger;
    }
);