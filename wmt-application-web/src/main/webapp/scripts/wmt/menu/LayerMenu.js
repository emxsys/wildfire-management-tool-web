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
 * The LayerMenu manifests buttons in the Layers sidebar to show/hide the World Wind layers.
 * 
 * @returns {LayerMenu}
 */
define([], function () {
    "use strict";
    var LayerMenu = function (controller) {
        var self = this;

        this.ctrl = controller;
        this.wwd = controller.wwd;

        // Populate the Layers menu with menu items
        this.synchronizeLayerList();

        // Attach a click handler to the new layer menu items
        $('#layerList').find('li').on('click', function (event) {
            self.onLayerClick($(this));
        });
    };

    LayerMenu.prototype.onLayerClick = function (layerItem) {
        var layerName = layerItem.text(),
            i,
            len,
            layer;

        // Update the layer state for the selected layer.
        for (i = 0, len = this.wwd.layers.length; i < len; i++) {
            layer = this.wwd.layers[i];
            if (layer.displayName === layerName) {
                layer.enabled = !layer.enabled;
                this.highlightLayer(layer, layerItem);

                this.ctrl.redrawGlobe();
            }
        }
    };

    LayerMenu.prototype.synchronizeLayerList = function () {
        var layerListItem = $("#layerList"),
            layerItem,
            layer,
            i,
            len;

        layerListItem.remove('a');

        // Synchronize the displayed layer list with the World Window's layer list.
        for (i = 0, len = this.wwd.layers.length; i < len; i++) {
            layer = this.wwd.layers[i];
            if (layer.hideInMenu) {
                continue;
            }
            layerItem = $('<li class="list-group-item">' + layer.displayName + '</li>');
            layerListItem.append(layerItem);
            this.highlightLayer(layer, layerItem);
        }
    };

    LayerMenu.prototype.highlightLayer = function (layer, layerItem) {
        if (layer.enabled) {
            layerItem.addClass("active");
        } else {
            layerItem.removeClass("active");
        }
    };

    return LayerMenu;
});