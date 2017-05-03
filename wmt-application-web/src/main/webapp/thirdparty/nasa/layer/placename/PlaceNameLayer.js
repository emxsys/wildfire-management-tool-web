/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports PlaceNameLayer
 */
define([
        '../../util/AbsentResourceList',
        '../../error/ArgumentError',
        '../../geom/BoundingBox',
        '../../shapes/GeographicText',
        '../Layer',
        '../../util/Logger',
        '../../cache/MemoryCache',
        '../../geom/Position',
        './QuadTree',
        '../../shapes/TextAttributes'
    ],
    function (AbsentResourceList,
              ArgumentError,
              BoundingBox,
              GeographicText,
              Layer,
              Logger,
              MemoryCache,
              Position,
              QuadTree,
              TextAttributes) {
        "use strict";

        var PlaceNameLayer = function (sector, featureFormat, cacheKey) {

            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "PlaceNameLayer", "constructor", "missingSector"));
            }

            if (!featureFormat) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "PlaceNameLayer", "constructor",
                        "The specified feature format is null or undefined."));
            }

            if (!cacheKey) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "PlaceNameLayer", "constructor",
                        "The specified cache key is null or undefined."));
            }

            Layer.call(this, "Placename Layer");

            this.tree = new QuadTree(sector, 0);

            this.retrievalFeatureFormat = featureFormat;

            this.cacheKey = cacheKey;

            this.loadTree();

            this.currentRetrievals = [];

            this.absentResourceList = new AbsentResourceList(3, 50e3);

            this.featureCache = new MemoryCache(10000, 8000);
        };

        PlaceNameLayer.prototype = Object.create(Layer.prototype);

        PlaceNameLayer.prototype.loadTree = function () {
            for (var i = 0; i < this.featuresArray.length; i++) {
                this.addFeaturesToTree(this.tree, this.featuresArray[i])
            }
        };

        PlaceNameLayer.prototype.addFeaturesToTree = function (tree, feature) {
            var url, xhr, self = this;

            xhr = new XMLHttpRequest();
            url = self.urlBuilder.urlForHits(tree.sector, feature.featureName);
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var xmlDom = xhr.responseXML;
                    var children = xmlDom.children || xmlDom.childNodes;
                    var numOfFeatures = Number(children[0].getAttribute("numberOfFeatures"));

                    if (tree.featureCount + numOfFeatures <= self.maxNodeFeatureCount) {
                        tree.features.push({
                            featureName: feature.featureName, minAltitude: feature.minAltitude,
                            maxAltitude: feature.maxAltitude
                        });
                        tree.featureCount += numOfFeatures;
                    }
                    else {
                        //subdivide
                        if (tree.nodes.length == 0) {
                            tree.subdivide();
                        }
                        for (var i = 0; i < tree.nodes.length; i++) {
                            self.addFeaturesToTree(tree.nodes[i], feature);
                        }
                    }
                }
            };
            xhr.send();
        };

        PlaceNameLayer.prototype.doRender = function (dc) {
            var featureList = [];
            this.traverseTree(dc, featureList, this.tree);

            for (var i = 0; i < featureList.length; i++) {
                var featureCacheKey = this.cacheKey +
                    "_" + featureList[i].featureName +
                    "_" + featureList[i].sector.minLatitude +
                    "_" + featureList[i].sector.maxLatitude +
                    "_" + featureList[i].sector.minLongitude +
                    "_" + featureList[i].sector.maxLongitude;
                //console.log(featureCacheKey);

                //daca deja exista in cache, desenam
                if(this.featureCache.containsKey(featureCacheKey)){
                    var renderables = this.featureCache.entryForKey(featureCacheKey);

                    for (var j = 0, len = renderables.length; j < len; j++) {
                        try {
                            renderables[j].render(dc);
                        } catch (e) {
                            Logger.logMessage(Logger.LEVEL_SEVERE, "RenderableLayer", "doRender",
                                "Error while rendering shape " + this.renderables[j].displayName + ".\n" + e.toString());
                            // Keep going. Render the rest of the shapes.
                        }
                    }
                }
                //daca nu, dam comanda sa downloadam
                else{
                    this.retrieveFeaturesForNode(featureList[i].sector, featureList[i].featureName, featureCacheKey);
                }
            }
        }

        PlaceNameLayer.prototype.resourceUrlForSector = function (sector, featureName, featureFormat) {
            if (this.urlBuilder) {
                return this.urlBuilder.urlForSector(sector, featureName, featureFormat);
            } else {
                return null;
            }
        };

        PlaceNameLayer.prototype.traverseTree = function (dc, featureList, tree) {
            if (tree.level == 0) {
                for (var j = 0; j < tree.features.length; j++) {
                    var boundingBoxForNode = new BoundingBox();
                    boundingBoxForNode.setToSector(tree.sector, dc.globe,
                        tree.features[j].minAltitude, tree.features[j].maxAltitude);
                    if (boundingBoxForNode.intersectsFrustum(dc.navigatorState.frustumInModelCoordinates) &&
                        dc.eyePosition.altitude > tree.features[j].minAltitude &&
                        dc.eyePosition.altitude < tree.features[j].maxAltitude) {

                        featureList.push({featureName: tree.features[j].featureName, sector: tree.sector});
                    }
                }
            }
            for (var i = 0; i < tree.nodes.length; i++) {
                for (var j = 0; j < tree.nodes[i].features.length; j++) {
                    var boundingBoxForNode = new BoundingBox();
                    boundingBoxForNode.setToSector(tree.nodes[i].sector, dc.globe,
                        tree.nodes[i].features[j].minAltitude, tree.nodes[i].features[j].maxAltitude);
                    if (boundingBoxForNode.intersectsFrustum(dc.navigatorState.frustumInModelCoordinates) &&
                        dc.eyePosition.altitude > tree.nodes[i].features[j].minAltitude &&
                        dc.eyePosition.altitude < tree.nodes[i].features[j].maxAltitude) {

                        featureList.push({
                            featureName: tree.nodes[i].features[j].featureName,
                            sector: tree.nodes[i].sector
                        });
                    }
                }
                this.traverseTree(dc, featureList, tree.nodes[i]);
            }
        }

        PlaceNameLayer.prototype.removeFromCurrentRetrievals = function (featureCacheKey) {
            var index = this.currentRetrievals.indexOf(featureCacheKey);
            if (index > -1) {
                this.currentRetrievals.splice(index, 1);
            }
        };

        PlaceNameLayer.prototype.retrieveFeaturesForNode = function (sector, featureName, featureCacheKey) {
            if (this.currentRetrievals.indexOf(featureCacheKey) < 0) {
                if (this.absentResourceList.isResourceAbsent(featureCacheKey)) {
                    return;
                }

                var url = this.resourceUrlForSector(sector, featureName, this.retrievalFeatureFormat),
                    layer = this,
                    featureCache = this.featureCache;

                if (!url) {
                    return;
                }

                var xhr = new XMLHttpRequest();

                xhr.open("GET", url, true);
                xhr.onreadystatechange = (function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            var renderables = layer.createRenderablesForNode(xhr.responseText);
                            layer.removeFromCurrentRetrievals(featureCacheKey);

                            if (renderables && renderables.length > 0) {
                                featureCache.putEntry(featureCacheKey, renderables, renderables.length);
                                layer.absentResourceList.unmarkResourceAbsent(featureCacheKey);
                            }
                        }
                        else {
                            layer.removeFromCurrentRetrievals(featureCacheKey);
                            layer.absentResourceList.markResourceAbsent(featureCacheKey);
                            Logger.log(Logger.LEVEL_WARNING,
                                "Place name data retrieval failed (" + xhr.statusText + "): " + url);
                        }
                    }
                }).bind(this);

                xhr.onerror = function () {
                    layer.removeFromCurrentRetrievals(featureCacheKey);
                    layer.absentResourceList.markResourceAbsent(featureCacheKey);
                    Logger.log(Logger.LEVEL_WARNING, "Place name data retrieval failed: " + url);
                };

                xhr.send(null);

                this.currentRetrievals.push(featureCacheKey);
            }
        };

        PlaceNameLayer.prototype.createRenderablesForNode = function(resourceText){
            var renderables = [];
            var feature = JSON.parse(resourceText);
            if (feature) {
                feature.features.map(function (feature, featureIndex, features) {
                    var coordinate = feature.geometry.coordinates;
                    var position = new Position(coordinate[0], coordinate[1], 0);
                    var placeName = new GeographicText(position, feature.properties.full_name_nd);
                    //placeName.attributes = layer.textAttributes;
                    renderables.push(placeName);
                });
            }
            return renderables;
        }

        return PlaceNameLayer;
    });