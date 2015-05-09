/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports Crosshairs
 * @version $Id: Crosshairs.js 2939 2015-03-30 16:50:49Z tgaskins $
 */
define([
    '../thirdparty/webworldwind/error/ArgumentError',
    '../thirdparty/webworldwind/util/Logger',
    '../thirdparty/webworldwind/util/Offset',
    '../thirdparty/webworldwind/shapes/ScreenImage',
    '../thirdparty/webworldwind/geom/Vec3',
    '../thirdparty/webworldwind/util/WWUtil'
],
        function (ArgumentError,
                Logger,
                Offset,
                ScreenImage,
                Vec3,
                WWUtil) {
            "use strict";

            /**
             * Constructs crosshairs.
             * @alias Crosshairs
             * @constructor
             * @augments ScreenImage
             * @classdesc Displays a crosshairs image centered in the World Window. 
             * Use [the image offset property]{@link ScreenImage#imageOffset} to position the image relative to the
             * screen point.
             * @param {String} imagePath The URL of the image to display. If null or undefined, a default crosshairs image is used.
             */
            var Crosshairs = function (imagePath) {

                var sOffset = new Offset(WorldWind.OFFSET_FRACTION, .5, WorldWind.OFFSET_FRACTION, .5), // centered placement
                        iPath = imagePath ? imagePath : WWUtil.currentUrlSansFilePart() + "/../images/32x32-crosshair-outline.png";

                ScreenImage.call(this, sOffset, iPath);

                // Must set the default image offset and scale after calling the constructor above.

                // Align the upper right corner of the image with the screen point, and give the image some padding.
                this.imageOffset = new Offset(WorldWind.OFFSET_FRACTION, 0.6, WorldWind.OFFSET_FRACTION, 0.6);

//                if (!imagePath) {
//                    // Scale the default image.
//                    this.imageScale = 0.4;
//                }
            };

            Crosshairs.prototype = Object.create(ScreenImage.prototype);

            return Crosshairs;
        })
        ;