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
 * The World Wind View Controls are horizontal in nature, this implementation orients the controls vertically.
 */
define([
        '../../webworldwind/geom/Angle',
        '../../webworldwind/error/ArgumentError',
        '../../webworldwind/layer/Layer',
        '../../webworldwind/geom/Location',
        '../../webworldwind/util/Logger',
        '../../webworldwind/util/Offset',
        '../../webworldwind/shapes/ScreenImage',
        '../../webworldwind/geom/Vec2',
        '../../webworldwind/layer/ViewControlsLayer',
        '../../webworldwind/util/WWUtil'
    ],
    function (Angle,
              ArgumentError,
              Layer,
              Location,
              Logger,
              Offset,
              ScreenImage,
              Vec2,
              ViewControlsLayer,
              WWUtil) {        
                  "use strict";
              
        /**
         * Constructs a view controls layer.
         * @alias VerticalViewControlsLayer
         * @constructor
         * @augments {WorldWindow}
         * @classdesc Displays and manages view controls.
         * @param {WorldWindow} worldWindow The World Window associated with this layer.
         * This layer may not be associated with more than one World Window. Each World Window must have it's own
         * instance of this layer if each window is to have view controls.
         */
        var EnhancedViewControlsLayer = function (worldWindow) {
            
            // Classic Pattern #2 - Rent-a-Constructor. See JavaScript Patterns - Code Reuse Patterns
            ViewControlsLayer.call(this, worldWindow);
            
            this.placement = new Offset(WorldWind.OFFSET_FRACTION, 0.98, WorldWind.OFFSET_FRACTION, 0.90);
            this.alignment = new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 1);
            
            this.showExaggerationControl = Wmt.configuration.showExaggerationControl;
        };

        // Classic Pattern #3 - Rent and Set Prototype. See JavaScript Patterns - Code Reuse Patterns
        EnhancedViewControlsLayer.prototype = Object.create(ViewControlsLayer.prototype);

        return EnhancedViewControlsLayer;
    }
);