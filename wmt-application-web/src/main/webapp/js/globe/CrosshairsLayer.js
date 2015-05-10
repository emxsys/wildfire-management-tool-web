/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports CrosshairsLayer
 * @version $Id: CrosshairsLayer.js 2978 2015-04-03 22:55:55Z tgaskins $
 */
define(['../globe/Crosshairs',
    '../../thirdparty/webworldwind/WorldWind'],
    function (
        Crosshairs,
        WorldWind) {
        "use strict";

        /**
         * Constructs a crosshairs layer.
         * @alias CrosshairsLayer
         * @constructor
         * @augments RenderableLayer
         * @classdesc Displays a crosshairs. Crosshairs layers cannot be shared among World Windows. Each World Window if it
         * is to have a crosshairs layer must have its own. See the MultiWindow example for guidance.
         */
        var CrosshairsLayer = function () {
            WorldWind.RenderableLayer.call(this, "Crosshairs");

            this._crosshairs = new Crosshairs(null, null);

            this.addRenderable(this._crosshairs);
        };

        CrosshairsLayer.prototype = Object.create(WorldWind.RenderableLayer.prototype);

        Object.defineProperties(CrosshairsLayer.prototype, {
            /**
             * The crosshairs to display.
             * @type {Crosshairs}
             * @default {@link Crosshairs}
             * @memberof CrosshairsLayer.prototype
             */
            crosshairs: {
                get: function () {
                    return this._crosshairs;
                },
                set: function (crosshairs) {
                    if (crosshairs && crosshairs instanceof Crosshairs) {
                        this.removeAllRenderables();
                        this.addRenderable(crosshairs);
                        this._crosshairs = crosshairs;
                    }
                }
            }
        });

        return CrosshairsLayer;
    }
);