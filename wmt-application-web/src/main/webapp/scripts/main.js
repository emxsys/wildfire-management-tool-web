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

/*global requirejs*/

/**
 * Top-level script file that does not define a module containing a configuration object.
 * @link http://requirejs.org/docs/api.html#config
 * @author Bruce Schubert
 */
requirejs.config({
    baseUrl: "scripts/wmt",
    waitSeconds: 60,
    "paths": {
//        // Specify a path to jquery, the second declaration is local fallback
//        jquery: [
//            "//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min",
//            "../../thirdparty/jquery-2.1.4.min"],
//        jqueryui: [
//            "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min",
//            "../../thirdparty/jquery-ui-1.11.4/jquery-ui.min"],
//        primeui: "../../thirdparty/primeui-1.1/production/primeui-1.1-min",
    }
});

requirejs([
    './WmtClient',
    '../nasa/WorldWind'],
    function (WmtClient, ww) {
        "use strict";
        var app = new WmtClient();
    });
