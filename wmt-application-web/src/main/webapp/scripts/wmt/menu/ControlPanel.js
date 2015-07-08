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

/*global define, $, WorldWind*/

/**
 * The ControlPanel manifests a dropdown in the Control Panel:Globe 
 * sidebar to select the projection for the earth.
 * 
 * @param {WorldWind} WorldWind
 * @returns {ControlPanel}
 */
define([
    'wmt/controller/Controller',
    'wmt/util/Locator', 
    'wmt/util/Messenger', 
    'worldwind'], 
function (
    controller,
    locator, 
    messenger, 
    ww) {
    "use strict";
    /**
     * @constructor
     * @param {Controller} controller
     * @returns {ControlPanel}
     */
    var ControlPanel = function () {
        var self = this;

        this.wwd = controller.wwd;
        this.self = this;

        this.roundGlobe = this.wwd.globe;

        // Create the list of supported projections
        this.createProjectionList();

        // Add event handlers to the list items
        $("#projectionDropdown").find(" li").on("click", function (e) {
            self.onProjectionClick(e);
        });

        // Add Control Panel > Globe event handlers
        $("#findMe").on("click", function (event) {
            locator.locateCurrentPosition();
        });
        // Add Control Panel > Globe event handlers
        $("#followMe").on("click", function (event) {
            messenger.infoGrowl("Follow Me not implemented yet.","<h2>Sorry</h2>");
        });
        // Add Control Panel > Globe event handlers
        $("#resetGlobe").on("click", function (event) {
            controller.globe.reset();
        });
        $("#resetHeading").on("click", function (event) {
            controller.globe.resetHeading();
        });
        $("#resetView").on("click", function (event) {
            controller.globe.resetHeadingAndTilt();
        });

        // Initially, show the Location tab
        // TODO: Obsolete with mobile menu? or duplicate ids between mobile and desktop?
        //$('#controlPanelLocationBody').collapse('show'); 

    };

    ControlPanel.prototype.onProjectionClick = function (event) {
        var projectionName = event.target.innerText || event.target.innerHTML;
        $("#projectionDropdown").find("button").html(projectionName + ' <span class="caret"></span>');

        if (projectionName === "3D") {
            if (!this.roundGlobe) {
                this.roundGlobe = new WorldWind.Globe(new WorldWind.EarthElevationModel());
            }

            if (this.wwd.globe !== this.roundGlobe) {
                this.wwd.globe = this.roundGlobe;
            }
        } else {
            if (!this.flatGlobe) {
                this.flatGlobe = new WorldWind.Globe2D();
            }

            if (projectionName === "Equirectangular") {
                this.flatGlobe.projection = new WorldWind.ProjectionEquirectangular();
            } else if (projectionName === "Mercator") {
                this.flatGlobe.projection = new WorldWind.ProjectionMercator();
            } else if (projectionName === "North Polar") {
                this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("North");
            } else if (projectionName === "South Polar") {
                this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("South");
            } else if (projectionName === "North UPS") {
                this.flatGlobe.projection = new WorldWind.ProjectionUPS("North");
            } else if (projectionName === "South UPS") {
                this.flatGlobe.projection = new WorldWind.ProjectionUPS("South");
            }

            if (this.wwd.globe !== this.flatGlobe) {
                this.wwd.globe = this.flatGlobe;
            }
        }
        controller.globe.redraw();
    };

    ControlPanel.prototype.createProjectionList = function () {
        var projectionNames = [
            "3D",
            "Equirectangular",
            "Mercator",
            "North Polar",
            "South Polar",
            "North UPS",
            "Soutn UPS"],
            projectionDropdown = $("#projectionDropdown"),
            ulItem = $('<ul class="dropdown-menu">'),
            dropdownButton = $('<button class="btn btn-info btn-block dropdown-toggle" type="button" data-toggle="dropdown">3D<span class="caret"></span></button>'),
            projectionItem,
            i;

        // Remove "Initilizing..." text
        projectionDropdown.children().remove();

        projectionDropdown.append(dropdownButton);
        projectionDropdown.append(ulItem);
        for (i = 0; i < projectionNames.length; i++) {
            projectionItem = $('<li><a >' + projectionNames[i] + '</a></li>');
            ulItem.append(projectionItem);
        }

        ulItem = $('</ul>');
        projectionDropdown.append(ulItem);
    };

    return ControlPanel;
});