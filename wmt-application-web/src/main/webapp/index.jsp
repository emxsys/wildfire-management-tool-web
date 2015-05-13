<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
<!--
Copyright (c) 2015, Bruce Schubert <bruce@emxsys.com>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

    - Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.

    - Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

    - Neither the name of Bruce Schubert, Emxsys nor the names of its 
      contributors may be used to endorse or promote products derived
      from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
-->
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Wildfire Management Tool (WMT)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
        <link rel="stylesheet" href="./css/WMT.css">

        <link rel="stylesheet" href="./thirdparty/jquery-ui.css" />   
        <link rel="stylesheet" href="./thirdparty/primeui-1.1/development/primeui-1.1.css" />   

        <script src="./thirdparty/jquery-2.1.4.js" type="text/javascript"></script>
        <script src="./thirdparty/jquery-ui-1.11.4.js" type="text/javascript"></script>
        <script src="./thirdparty/primeui-1.1/development/primeui-1.1.js" type="text/javascript"></script>

        <!--        <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js" type="text/javascript"></script>-->
        <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>

        <script data-main="./scripts/main" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.17/require.min.js"></script>
    </head>
    <body>

        <div class="container">
            <div class="jumbotron">
                <h1 style="text-align:center">Wildfire Management Tool</h1>
            </div>
            <div class="row">
                <div class="col-sm-3">
                    <h4>Projection</h4>
                    <div class="dropdown" id="projectionDropdown">
                    </div>
                    <br>
                    <h4>Layers</h4>
                    <div class="list-group" id="layerList">
                    </div>
                </div>
                <div class="col-sm-9">
                    <ul class="nav nav-pills">
                        <li class="dropdown">
                            <a class="dropdown-toggle" data-toggle="dropdown" href="#">Main Menu
                                <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li><a href="#">Submenu 2-1</a></li>
                                <li><a href="#">Submenu 2-2</a></li>
                                <li><a href="#">Submenu 2-3</a></li>
                            </ul>
                        </li>
                        <li><a href="#">Date/Time: </a></li>
                        <li><a id="crosshairsCoord2D" href="#">Location</a></li>
                    </ul>
                    <div id="globe">
                        <canvas id="canvasOne" width="1000" height="1000" style="width: 100%; height: auto">
                            Your browser does not support HTML5 Canvas.
                        </canvas>
                        <table id="coordinateOverlay">
                            <tr><td>Eye Alt</td><td id="eyeAltitude"></td></tr>
                            <tr><td>Lat</td><td id="terrainLatitude"></td></tr>
                            <tr><td>Lon</td><td id="terrainLongitude"></td></tr>
                            <tr><td>Height</td><td id="terrainElevation"></td></tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <!--Prime UI Growl Widget--> 
        <div id="growl"/>  
        <!--Prime UI Notify Widget--> 
        <div id="notify"/>  
    </body>
</html>
