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

/*global requirejs, WorldWind*/

/**
 * Top-level script file that does not define a module.
 * @link http://requirejs.org/docs/api.html#config
 * @author Bruce Schubert
 */
requirejs.config({
    waitSeconds: 7,
    // By default load any module IDs from NASA WorldWind folder.
    // This is required to satisfy the relative paths in the WW source
    // when using the local WorldWind resources.
    baseUrl: 'js/libs/webworldwind',
    // Paths are essentially named variables used in define and requre 
    paths: {
        'knockout': '../knockout/knockout-3.3.0',
        'jquery': '../jquery/jquery-2.1.4.min',
        'jqueryui-amd': '../jquery/jqueryui-amd-1.11.4.min',
        'promise': '../es6-promise/promise-1.0.0.min',
        'hammerjs': '../hammer/hammer-2.0.4.min',
//        'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0.min',
//        'ojs': 'libs/oj/v1.1.2/debug',
//        'ojL10n': 'libs/oj/v1.1.2/ojL10n',
//        'ojtranslations': 'libs/oj/v1.1.2/resources',
        'primeui': "../primeui/production/primeui-2.0-min",
        'signals': '../js-signals/signals.min',
        'text': '../require/text',
        'wmt': "../../modules", // WMT root path
        'worldwind': [
            "WorldWind",    // Global 
                //"http://worldwindserver.net/webworldwind/worldwindlib"
        ]
    },
    // Shim configurations for modules that do not expose AMD
    shim: {
        'jquery': {
            exports: ['jQuery', '$']
        },
        'crossroads': {
            deps: ['signals'],
            exports: 'crossroads'
        }
    },
    // This section configures the i18n plugin. It is merging the Oracle JET built-in translation 
    // resources with a custom translation file.
    // Any resource file added, must be placed under a directory named "nls". You can use a path mapping or you can define
    // a path that is relative to the location of this main.js file.
    config: {
//        ojL10n: {
//            merge: {
//                //'ojtranslations/nls/ojtranslations': 'resources/nls/menu'
//            }
//        }
    }
});

/**
 * A top-level require call executed by the Application.
 */
requirejs(['wmt/Wmt', 'wmt/WmtClient', 'worldwind'],
    function (wmt, WmtClient, ww) {
        "use strict";

        // Specify the where the World Wind resources are located.
        ww.configuration.baseUrl = wmt.WORLD_WIND_PATH;
        // Set the logging level for the World Wind library
        ww.Logger.setLoggingLevel(ww.Logger.LEVEL_WARNING);

        // Create the WMT app and make it accessable via a global variable.
        // This is the only global variable created by the WMT.
        window.WMT = new WmtClient();
    });
