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
        <link rel="icon" type="image/x-icon" href="./favicon.png">

        <!--During development, using local copies of libraries-->
        <link rel="stylesheet" href="./thirdparty/jquery-ui-1.11.4/jquery-ui.min.css" />   
        <link rel="stylesheet" href="./thirdparty/primeui-1.1/themes/afterwork/theme.css" />   
        <link rel="stylesheet" href="./thirdparty/primeui-1.1/production/primeui-1.1-min.css" />   
        <link rel="stylesheet" href="./thirdparty/bootstrap-3.3.4-dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="./css/WMT.css">

        <!--TODO: All of these libraries can be specified with RequireJS in main.js-->
        <script src="./thirdparty/jquery-2.1.4.min.js" type="text/javascript"></script>
        <script src="./thirdparty/jquery-ui-1.11.4/jquery-ui.min.js" type="text/javascript"></script>
        <script src="./thirdparty/primeui-1.1/production/primeui-1.1-min.js" type="text/javascript"></script>
        <script src="./thirdparty/bootstrap-3.3.4-dist/js/bootstrap.min.js" type="text/javascript"></script>

        <script data-main="./scripts/main" src="./thirdparty/require.js"></script>

        <!--For production, use content delivery network (CDN) libraries-->
        <!--<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">-->
        <!--<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js" type="text/javascript"></script>-->
        <!--<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>-->
        <!--<script data-main="./scripts/main" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.17/require.min.js"></script>-->
    </head>
    <body>
        <div id="globe" class="container-full">
            <div id='canvas-wrap'>
                <canvas id="canvasOne">
                    <h1>Your browser does not support HTML5 Canvas.</h1>
                </canvas>
                <!--DOM UI elements go here!-->
                <div class='row'>

                </div>
                <!--/DOM UI elements-->
            </div>
        </div>
        <!--Prime UI Growl Widget--> 
        <div id="growl"></div>  
        <!--Prime UI Notify Widget--> 
        <div id="notify"></div>
        <!--Prime UI Location Dialog--> 
        <div id="location-dlg" title="Set Location" style="display: none;">
            <div class="latitude">
                <label for="latitude" class="required">Latitude:</label>
                <input type="text" placeholder="[+/-] Latitude" 
                       name="latitude" id="latitude" required title="[+/-]DD.DDD, DD MM.MMM, or DD MM SS [N/S]">
            </div>
            <div class="longitude">
                <label for="longitude" class="required">Longitude:</label>
                <input type="text" placeholder="[+/-] Longitude" 
                       name="longitude" id="longitude" required title="[+/-]DD.DDD, DD MM.MMM, or DD MM SS [E/W]">
            </div>
        </div> 
        <!--Prime UI Date/Time Dialog--> 
        <div id="datetime-dlg" title="Set Date and Time" style="display: none;">
            <div class="appdate">
                <label for="datepicker" class="required">Date:</label>
                <input type="text" name="datepicker" id="datepicker">
            </div>
            <div class="apptime">
                <label for="time" class="required">Time:</label>
                <input type="text" name="timepicker" id="timepicker" >
            </div>
        </div>        
        <!--Prime UI Fuel Model Dialog--> 
        <div id="fuelModel-dlg" title="Set Fuel Model" style="display: none;">
            <div id="fuelModel-tbl">
            </div>
        </div>        
        <!--Prime UI Weather Editor Dialog--> 
        <div id="weatherEditor-dlg" title="Edit Weather" style="display: none;">
            <div class="weatherValues">
                <div>                
                    <label for="airTemperature" class="required">Air Temperature:</label>
                    <input type="text" name="airTemperature" id="airTemperature">
                </div>                
                <div>                
                    <label for="relaltiveHumidity" class="required">Relative Humidity:</label>
                    <input type="text" name="relativeHumidity" id="relativeHumidity">
                </div>                
                <div>                
                    <label for="windSpeed" class="required">Wind Speed:</label>
                    <input type="text" name="windSpeed" id="windSpeed">
                </div>                
                <div>                
                    <label for="windDirection" class="required">Wind Direction:</label>
                    <input type="text" name="windDirection" id="windDirection">
                </div>                
                <div>                
                    <label for="cloudCoer" class="required">Cloud Cover:</label>
                    <input type="text" name="cloudCover" id="cloudCover">
                </div>            
            </div>
        </div>        
        <!--Main Menu-->
        <ul class="nav nav-pills">
            <li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown" href="#">Main Menu<span class="caret"></span></a>
                <ul class="dropdown-menu">
                    <li><a id="fuelModel" href="#">Select Fuel Model</a></li>
                    <li><a id="weather" href="#">Edit Weather</a></li>
                    <li><a id="resetHeading" href="#">Reset Heading</a></li>
                    <li><a id="resetView" href="#">Reset View</a></li>
                    <li><a id="resetGlobe" href="#">Reset Globe </a></li>
                    <!--<li><div class="dropdown" id="projectionDropdown"></div></li>-->
                    <li><div class="list-group" id="layerList"></div></li>
                </ul>
            </li>
            <li><a id="datetime" href="#">Date/Time</a></li>
            <li><a id="location" href="#">Location</a></li>
        </ul>
        <!--Coordinates Overlay-->
        <div class='row'>
            <div id="coordinateOverlay" class="col-xs-4 non-interactive">
                <div class="row">
                    <span>Eye Alt: </span><span id="eyeAltitude"></span>
                </div>
                <div class="row">
                    <span>Lat: </span><span id="targetLatitude"></span>
                </div>
                <div class="row">
                    <span>Lon: </span><span id="targetLongitude"></span>
                </div>
            </div>            
        </div>
        <!--REST information overlay-->
        <div id="RESTPanel" class="rest-panel-bottom">
            <div class="row">            
                <div id="restSolarData" class="col-xs-4 col-sm-4 col-md-4 pull-left non-interactive">
                    <div class="row">
                        <span>Time: </span><span id="apptime"></span>
                    </div>
                    <div class="row">
                        <span>Sunrise: </span><span id="sunrise"></span>
                    </div>
                    <div class="row">
                        <span>Sunset: </span><span id="sunset"></span>
                    </div>
                </div>
                <div id="restWeatherData" class="col-xs-4 col-sm-4 col-md-4 non-interactive">

                </div>
                <div id="restTerrainData" class="col-xs-4 col-sm-4 col-md-4 pull-right non-interactive">
                    <div class="row">
                        <span>Elevation: </span><span id="targetElevation"></span>
                    </div>
                    <div class="row">
                        <span>Aspect: </span><span id="targetAspect"></span>
                    </div>
                    <div class="row">
                        <span>Slope: </span><span id="targetSlope"></span>
                    </div>
                </div>
            </div>
        </div>
        <!--        
                <div class='row'>
                    <div class="col-sm-3 col-md-3 hidden-xs">
                        <h4>Projection</h4>
                        <div class="dropdown" id="projectionDropdown">
                        </div>
                        <br>
                        <h4>Layers</h4>
                        <div class="list-group" id="layerList">
                        </div>
                    </div>
                </div>
        -->

        <!--Removed for purpose of testing fullscreen canvas and getting overlays to work-->
        <!--            <div class="jumbotron">
                        <h1 style="text-align:center">Wildfire Management Tool</h1>
                    </div>-->  
        <!--               <div class='row'>
                            <div class="col-sm-3 col-md-3 hidden-xs">
                                <h4>Projection</h4>
                                <div class="dropdown" id="projectionDropdown">
                                </div>
                                <br>
                                <h4>Layers</h4>
                                <div class="list-group" id="layerList">
                                </div>
                            </div>
                        </div>
                        <ul class="nav nav-pills hidden-xs">
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
                        </ul>-->
        <!--Coordinates under mouse-->
        <!--
                <div class='row'>
                    <div id="coordinateOverlay" class="col-xs-4">
                        <div class="row">
                            <span>Eye Alt: </span><span id="eyeAltitude"></span>
                        </div>
                        <div class="row">
                            <span>Lat: </span><span id="terrainLatitude"></span>
                        </div>
                        <div class="row">
                            <span>Lon: </span><span id="terrainLongitude"></span>
                        </div>
                        <div class="row">
                            <span>Height: </span><span id="terrainElevation"></span>
                        </div>
                    </div>
                </div>   
        -->

    </body>
</html>
