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

/*global define, WorldWind*/

/**
 * The IcsMarker draws an ICS Symbol on the globe.
 * @param {Log} log Console logging.
 * @param {Wmt} wmt Constants.
 * @param {WorldWind} ww 
 * @returns {IcsMarker}
 * 
 * @author Bruce Schubert
 */
define([
    'wmt/util/Log',
    'wmt/Wmt',
    'worldwind'],
    function (
        log,
        wmt,
        ww) {
        "use strict";

        var IcsMarker = function (latitude, longitude, icsSymbolType, eyeDistanceScaling) {
            // Inherit Placemark properties
            WorldWind.Placemark.call(this, new WorldWind.Position(latitude, longitude, 0), eyeDistanceScaling);

            this.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
            //this.eyeDistanceScalingThreshold = 2500000;

            // Establish the common attributes for ICS Markers
            this.attributes = new WorldWind.PlacemarkAttributes(null);
            this.attributes.depthTest = true;
            this.attributes.imageScale = 1.5;
            this.attributes.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 0.0);
            this.attributes.labelAttributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 1.0);
            this.attributes.labelAttributes.color = WorldWind.Color.YELLOW;
            this.attributes.labelAttributes.depthTest = true;
            this.attributes.drawLeaderLine = true;
            this.attributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;
            this.attributes.leaderLineAttributes.outlineWidth = 2;

            this.highlightAttributes = new WorldWind.PlacemarkAttributes(this.attributes);
            this.highlightAttributes.imageScale = this.attributes.imageScale * 1.2;

            // Set the image source and name for the placemark
            this.updateMarker(IcsMarker.findTemplate(icsSymbolType));

        };
        // Inherit Placemark functions
        IcsMarker.prototype = Object.create(WorldWind.Placemark.prototype);

        // ICS Marker Types
        IcsMarker.templates = [
            {type: "ics-aerial-hazard", name: "Aerial Hazard ", symbol: "Aerial_Hazard24.png"},
            {type: "ics-aerial-ignition", name: "Aerial Ignition ", symbol: "Aerial_Ignition24.png"},
            {type: "ics-airport", name: "Airport ", symbol: "Airport_124.png"},
            {type: "ics-archaeological-site", name: "Archaeological Site ", symbol: "Archaeological_Site_124.png"},
            {type: "ics-branch-break", name: "Branch Break ", symbol: "Branch_Break24.png"},
            {type: "ics-camp", name: "Camp ", symbol: "Camp24.png"},
            {type: "ics-division-break", name: "Division Break ", symbol: "Division_Break24.png"},
            {type: "ics-drop-point", name: "Drop Point ", symbol: "Drop_Point24.png"},
            {type: "ics-fire-location", name: "Fire Location ", symbol: "Fire_Location24.png"},
            {type: "ics-fire-origin", name: "Fire Origin ", symbol: "Fire_Origin24.png"},
            {type: "ics-fire-station", name: "Fire Station ", symbol: "Fire_Station24.png"},
            {type: "ics-first-aid", name: "First Aid ", symbol: "First_Aid_124.png"},
            {type: "ics-heat-sorce", name: "Heat Source ", symbol: "Heat_Source24.png"},
            {type: "ics-helibase", name: "Helibase ", symbol: "Helibase24.png"},
            {type: "ics-helispot", name: "Helispot ", symbol: "Helispot24.png"},
            {type: "ics-historical-site", name: "Historical Site ", symbol: "Historical_Site24.png"},
            {type: "ics-incident-base", name: "Incident Base ", symbol: "Incident_Base24.png"},
            {type: "ics-incident-command-post", name: "Incident Command Post ", symbol: "Incident_Command_Post24.png"},
            {type: "ics-medi-vac", name: "MediVac Site ", symbol: "MediVac_Site24.png"},
            {type: "ics-mobile-weather-unit", name: "Mobile Weather Unit ", symbol: "Mobile_Weather_Unit24.png"},
            {type: "ics-repeater", name: "Repeater ", symbol: "Repeater24.png"},
            {type: "ics-retardant-pickup", name: "Retardant Pickup ", symbol: "Retardant_Pickup24.png"},
            {type: "ics-safety-zone", name: "Safety Zone ", symbol: "Safety_Zone_024.png"},
            {type: "ics-staging-area", name: "Staging Area ", symbol: "Staging_Area24.png"},
            {type: "ics-water-source", name: "Water Source ", symbol: "Water_Source24.png"}
        ];

        /**
         * Finds the ICS marker template for the given type.
         * @param {String} type An IcsMarker.templates[] type.
         * @returns {IcsMarker.templates[] item} The matching template object.
         */
        IcsMarker.findTemplate = function (type) {
            var i, max;
            for (i = 0, max = IcsMarker.templates.length; i < max; i++) {
                if (type === IcsMarker.templates[i].type) {
                    return IcsMarker.templates[i];
                }
            }
            // Not found!
            throw new Error(log.error('IcsMarker', 'findTemplate', 'Invalid symbol type: ' + type));
        };

        /**
         * Updates this placemark's symbol and display name based on the type.
         * @param {Object} type An IcsMarker.templates[] item.
         */
        IcsMarker.prototype.updateMarker = function (template) {
            this.attributes.imageSource = wmt.IMAGE_PATH + 'ics/' + template.symbol;
            this.highlightAttributes.imageSource = this.attributes.imageSource;
            this.displayName = template.name;
        };


        return IcsMarker;
    }
);

