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

/*global define, $ */


/**
 * The DateTimeControls module is responsible for the Time Slider that updates the application time.
 * @param {Controller} controller The Controller singleton.
 * @returns {DateTimeControls}
 * 
 * @author Theodore Walton
 */
define([
    'wmt/controller/Controller',
    'wmt/util/WmtUtil'],
    function (
        controller,
        util) {
        "use strict";
        var DateTimeControls = {
            intervalID: -1,
            initialize: function () {
                $('#timeControlSlider').slider({
                    animate: 'fast',
                    min: -100,
                    max: 100,
                    orientation: 'horizontal',
                    stop: function () {
                        $("#timeControlSlider").slider("value", "0");
                    }
                });
                $("#timeControlSlider").on('mousedown', $.proxy(this.onMousedown, this));
                $("#timeControlSlider").on('mouseup', $.proxy(this.onMouseup, this));
                
                // The slide event provides events from the keyboard
                $("#timeControlSlider").on('slide', $.proxy(this.onSlide, this));

                // Time control button click handlers
                $("#time-fast-back").on('click', function() {controller.incrementDateTime(-60 * 24);});
                $("#time-step-back").on('click', function() {controller.incrementDateTime(-60);});
                $("#time-reset").on('click', function() {controller.model.updateAppTime(new Date());});
                $("#time-step-forward").on('click', function() {controller.incrementDateTime(60);});
                $("#time-fast-forward").on('click', function() {controller.incrementDateTime(60 * 24);});

            },
            onMousedown: function (event) {
                //console.log("onMousedown: setting interval timer");
                if (this.intervalID === -1) {   // Prevent dupicates
                    var self = this;
                    this.intervalID = setInterval(function () {
                        self.whileMousedown();
                    }, 100);
                }
            },
            whileMousedown: function () {
                var value = $("#timeControlSlider").slider("value");
                //console.log("whileMousedown: " + value);
                controller.incrementDateTime(this.sliderValueToMilliseconds(value));
            },
            onMouseup: function (event) {
                //console.log("onMouseup: clearing interval timer");
                if (this.intervalID !== -1) {  //Only stop if exists
                    clearInterval(this.intervalID);
                    this.intervalID = -1;
                }
            },
            onSlide: function (event, ui) {
                //console.log("onSlide: " + ui.value);
                controller.incrementDateTime(this.sliderValueToMilliseconds(ui.value));
            },
            sliderValueToMilliseconds: function (value) {
                var val,
                    factor = 50;

                if (value < 45 && value > -45) {
                    val = Math.min(Math.max(value, -45), 45);
                    return Math.sin(val * util.DEG_TO_RAD) * factor;
                }
                val = Math.abs(value) - 44;
                return Math.pow(val, 1.5) * (value < 0 ? -1 : 1) * factor;

            }
        };
        return DateTimeControls;
    }

);
