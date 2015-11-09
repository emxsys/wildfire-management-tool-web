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
define(['wmt/controller/Controller'],
    function (controller) {
        "use strict";
        var LayerMenu = function () {
            var self = this;

            this.wwd = controller.wwd;
            this.layerManager = controller.globe.layerManager;

            // Populate the Layers menu with menu items
            this.synchronizeLayerList();

            // Attach a click handler to the new layer menu items
            $('#layerList').find('li').on('click', function (event) {
                self.onLayerClick($(this));
            });
            // Attach a click handler to the layer refresh button
            $('#refreshLayers').on('click', function (event) {
                controller.globe.refreshLayers();
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
                    LayerMenu.highlightItemIfEnabled(layer, layerItem);

                    controller.globe.redraw();
                }
            }
        };

        LayerMenu.prototype.synchronizeLayerList = function () {
            var $list = $("#layerList"),
                item,
                layer, i, len,
                currCategory, collapseId, headingId,
                $categoryDiv, $heading, $title, $anchor, $bodyParent, $body;

            //$list.remove('a');
            $list.children().remove();

            // Synchronize the displayed layer list with the World Window's layer list.
            for (i = 0, len = this.wwd.layers.length; i < len; i++) {
                layer = this.wwd.layers[i];
                if (layer.hideInMenu) {
                    continue;
                }

                if (layer.category !== currCategory) {

                    // Create an accordion panel for the category
                    currCategory = layer.category;
                    headingId = 'layer-category-heading-' + currCategory;
                    collapseId = 'layer-category-body-' + currCategory;
                    $categoryDiv = $('<div class="panel panel-default"></div>');
                    $heading = $('<div class="panel-heading" data-toggle="collapse" data-target="#' + collapseId + '" role="tab" id="' + headingId + '"></div>');
                    $title = $('<h4 class="panel-title"></h4>');
                    $anchor = $('<a data-toggle="collapse" href="#' + collapseId + '"' +
                        ' aria-expanded="true" aria-controls="' + collapseId + '">' + currCategory + ' Layers</a>');
                    $bodyParent = $('<div id="' + collapseId + '" class="panel-collapse collapse" role="tabpanel"' +
                        ' aria-labelledby="' + headingId + '"></div>');
                    $body = $('<div style=""></div>');

                    // Assemble the accordion panel
                    $title.append($anchor);
                    $heading.append($title);
                    $categoryDiv.append($heading);
                    $bodyParent.append($body);
                    $categoryDiv.append($bodyParent);

                    $list.append($categoryDiv);
                }
                item = $('<li class="list-group-item">' + layer.displayName + '</li>');
//                    item =
//                        '<div class= "btn-group btn-block btn-group-sm">' +
//                        ' <button type="button" class="col-xs-8 btn btn-default wildland-fire-goto" fireId="' + fire.id + '">' + fire.state + ' ' + fire.name + ' (' + fire.featureType + ') </button>' +
//                        ' <button type="button" class="col-xs-2 btn btn-default wildland-fire-open glyphicon glyphicon-open" style="top: 0" fireId="' + fire.id + '"></button>' +
////                        ' <button type="button" class="col-sm-2 btn btn-default wildland-fire-remove glyphicon glyphicon-trash" style="top: 0" fireId="' + fire.id + '"></button>' +
//                        '</div>';

                $body.append(item);
                LayerMenu.highlightItemIfEnabled(layer, item);
            }


        };

        LayerMenu.highlightItemIfEnabled = function (layer, layerItem) {
            if (layer.enabled) {
                layerItem.addClass("active");
            } else {
                layerItem.removeClass("active");
            }
        };

        return LayerMenu;
    });