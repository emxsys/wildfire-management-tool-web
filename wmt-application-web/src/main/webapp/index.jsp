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
        <title>Wildfire Management Tool (WMT)</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/x-icon" href="./favicon.png">

        <!--During development, using local copies of libraries-->
        <link rel="stylesheet" href="./thirdparty/jquery-ui-1.11.4/jquery-ui.min.css" />   
        <!--<link rel="stylesheet" href="./thirdparty/primeui-1.1/themes/afterwork/theme.css" />-->   
        <link rel="stylesheet" href="./thirdparty/primeui-1.1/production/primeui-1.1-min.css" />   
        <link rel="stylesheet" href="./thirdparty/bootstrap-3.3.4-dist/css/bootstrap-slate.min.css">
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

    <!-- Body: add padding to accommodate navbar-fixed-top style navbar -->
    <body style="padding-top: 50px;"> 

        <!--Main Menu-->
    <nav id="mainMenu" class="navbar navbar-default navbar-fixed-top navbar-nomargin">
        <div class="container-fluid">
            <!--Navbar: Collapsed Menu-->
            <div class="navbar-header">
                <button id="expandMenuItem" type="button" 
                        class="navbar-toggle collapsed" 
                        data-toggle="collapse" data-target="#navbar" 
                        aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <button id="collapsePanelsItem" type="button" 
                        class="navbar-btn navbar-toggle collapsed" 
                        aria-label="Show Globe">
                    <span class="glyphicon glyphicon-chevron-up" 
                          aria-hidden="true"></span>
                </button>
                <button id="expandPanelsItem" type="button" 
                        class="navbar-btn navbar-toggle collapsed" 
                        aria-label="Show Panel">
                    <span class="glyphicon glyphicon-chevron-down" 
                          aria-hidden="true">
                    </span>
                </button>
                <a class="navbar-brand" href="#" style="padding-left: 5px; padding-right: 5px">
                    <img alt="WMT" src="./images/wmt-web-white-53x24.png">
                </a>
            </div>
            <!--Navbar: Expanded Menu-->
            <div id="navbar" class="navbar-collapse collapse">
                <!--Navbar Left: Sidebars-->
                <ul id="sidebarItems" class="nav navbar-nav navbar-left">
                    <li id="controlPanelItem">
                        <a href="#">
                            <span class="glyphicon glyphicon-globe visible-xs-inline" aria-hidden="true" style="padding-right: 5px;"></span>
                            Control Panel
                        </a>
                    </li>
                    <li id="layersItem">
                        <a href="#">
                            <span class="glyphicon glyphicon-list visible-xs-inline" aria-hidden="true" style="padding-right: 5px;"></span>
                            Layers
                        </a>
                    </li>
                    <li id="markersItem">
                        <a href="#">
                            <span class="glyphicon glyphicon-flag visible-xs-inline" aria-hidden="true" style="padding-right: 5px;"></span>
                            Markers
                        </a>
                    </li>
                    <li id="weatherItem">
                        <a href="#">
                            <span class="glyphicon glyphicon-cloud visible-xs-inline" aria-hidden="true" style="padding-right: 5px;"></span>
                            Weather
                        </a>
                    </li>
                    <li id="firesItem">
                        <a href="#">
                            <span class="glyphicon glyphicon-fire visible-xs-inline" aria-hidden="true" style="padding-right: 5px;"></span>
                            Fires
                        </a>
                    </li>
                </ul>
                <!--Navbar Search-->
                <div class="navbar-form navbar-right"
                      style="padding-right: 0; padding-left: 0"
                      id="searchBox">
                    <input type="text" 
                           class="form-control"
                           style="width: 150px"
                           placeholder="Go To..."
                           id="searchText">
                </div>
                <!--Navbar Help-->
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown">
                        <a href="#" 
                           class="dropdown-toggle" 
                           data-toggle="dropdown" 
                           role="button" 
                           aria-expanded="false">
                            <span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span>
                            <span class="sr-only" aria-hidden="true">Help</span>
                            <span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="#">Contents</a></li>
                        </ul>
                    </li>                
                </ul>
            </div>
        </div>
    </nav>

    <!--WMTweb: Globe and Sidebars--> 
    <div id="wmtweb" class="container-full" style="position: relative; height: calc(100vh - 52px);">
        <!--Content-->
        <div class="row-full">

            <!--Control Panel Sidebar-->
            <div id="controlPanel" class="col-sm-4 col-lg-3 sidebar">
                <h4>
                    <span class="glyphicon glyphicon-globe" aria-hidden="true" style="padding-right: 5px;"></span>
                    Control Panel
                </h4>
                <div class="panel-group" id="controlPanelAccordion" role="tablist" aria-multiselectable="false">
                    <!--Globe -->
                    <div class="panel panel-default">
                        <div class="panel-heading collapsed" 
                             id="controlPanelGlobeHeading"
                             role="tab" 
                             data-toggle="collapse" 
                             data-parent="#controlPanelAccordion" 
                             href="#controlPanelGlobeBody" 
                             aria-expanded="false" 
                             aria-controls="controlPanelGlobeBody">                           
                            <h4 class="panel-title">
                                Globe
                            </h4>
                        </div>
                        <div class="panel-collapse collapse in" 
                             role="tabpanel" 
                             aria-labelledby="controlPanelGlobeHeading"
                             id="controlPanelGlobeBody" >
                            <div class="panel-body">
                                <h5>Projection</h5>
                                <div class="dropdown" 
                                     id="projectionDropdown">                                         
                                </div>
                                <h5>View</h5>
                                <div>
                                    <button id="resetHeading" 
                                            class="btn btn-default" 
                                            type="submit"
                                            data-toggle="tooltip" 
                                            data-placement="top" 
                                            title="Reset to north up">
                                        Reset Heading
                                    </button>
                                    <button id="resetView" 
                                            class="btn btn-default" 
                                            type="submit"
                                            data-toggle="tooltip" 
                                            data-placement="top" 
                                            title="Reset to north up and look down">
                                        Reset View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--Settings-->
                    <div class="panel panel-default">
                        <div id="controlPanelSettingsHeading"
                             class="panel-heading collapsed" 
                             data-toggle="collapse" 
                             data-parent="#controlPanelAccordion" 
                             href="#controlPanelSettingsBody" 
                             aria-expanded="false" 
                             aria-controls="controlPanelSettingsBody" 
                             role="tab">
                            <h4 class="panel-title">
                                Settings
                            </h4>
                        </div>
                        <div id="controlPanelSettingsBody" 
                             class="panel-collapse collapse" 
                             role="tabpanel" 
                             aria-labelledby="conntrolPanelSettingsHeading">
                            <div class="panel-body">
                                <ul>
                                    <li>A...</li>
                                    <li>B...</li>
                                    <li>C...</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--Options-->
                    <div class="panel panel-default">
                        <div id="controlPanelOptionsHeading"
                             class="panel-heading collapsed" 
                             data-toggle="collapse" 
                             data-parent="#controlPanelAccordion" 
                             href="#controlPanelOptionsBody" 
                             aria-expanded="false" 
                             aria-controls="controlPanelOptionsBody"
                             role="tab" >
                            <h4 class="panel-title">
                                Options
                            </h4>
                        </div>
                        <div id="controlPanelOptionsBody" 
                             class="panel-collapse collapse" 
                             role="tabpanel" 
                             aria-labelledby="controlPanelOptionsHeading">
                            <div class="panel-body">
                                <li> 
                                </li>  
                            </div>
                        </div>
                    </div>
                </div>            
            </div>

            <!--Layers Sidebar-->
            <div id="layersPanel" 
                 class="col-sm-4 col-lg-3 sidebar" 
                 style="display:none;">
                <h4>
                    <span class="glyphicon glyphicon-list" aria-hidden="true" style="padding-right: 5px;"></span>
                    Layers
                </h4>
                <div class="panel-group" 
                     role="tablist" 
                     aria-multiselectable="false"
                     id="layersAccordion">
                    <!--Layer List-->
                    <div class="panel panel-default">
                        <!--Show this panel at startup via "collapsed.in"-->
                        <div class="panel-heading collapsed" 
                             data-toggle="collapse" 
                             data-parent="#layersAccordion" 
                             href="#layerListBody" 
                             aria-expanded="false" 
                             aria-controls="layerListBody"
                             role="tab" 
                             id="layerListHeading">
                            <h4 class="panel-title">
                                Layer List
                            </h4>
                        </div>
                        <div class="panel-collapse collapse in" 
                             role="tabpanel" 
                             aria-labelledby="layerListHeading"
                             id="layerListBody" >
                            <div class="panel-body">
                                <ul class="list-group pre-scrollable" 
                                    id="layerList">
                                </ul>                              
                            </div>
                        </div>
                    </div>
                    <!--Settings-->
                    <div class="panel panel-default">
                        <div class="panel-heading collapsed" 
                             data-toggle="collapse" 
                             data-parent="#layersAccordion" 
                             href="#layerSettingsBody" 
                             aria-expanded="false" 
                             aria-controls="layerSettingsBody"
                             role="tab" 
                             id="labelSettingsHeading">
                            <h4 class="panel-title">
                                Settings
                            </h4>
                        </div>
                        <div id="layerSettingsBody" 
                             class="panel-collapse collapse" 
                             role="tabpanel" 
                             aria-labelledby="layerSettingsHeading">
                            <div class="panel-body">
                                <ul>
                                    <li>A...</li>
                                    <li>B...</li>
                                    <li>C...</li>

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>

            <!--Markers Sidebar-->
            <div id="markersPanel" 
                 class="col-sm-4 col-lg-3 sidebar" 
                 style="display:none;">
                <h4>
                    <span class="glyphicon glyphicon-flag" aria-hidden="true" style="padding-right: 5px;"></span>
                    Markers
                </h4>
                <div class="panel-group" id="markersAccordion" role="tabcreate" aria-multiselectable="false">
                    <!--Create Marker -->
                    <div class="panel panel-default">
                        <div class="panel-heading collapsed" 
                             data-toggle="collapse" 
                             data-parent="#markersAccordion" 
                             href="#markersCreateBody" 
                             aria-expanded="false" 
                             aria-controls="markersCreateBody" 
                             role="tab" 
                             id="markersCreateHeading">
                            <h4 class="panel-title">
                                Create
                            </h4>
                        </div>
                        <div id="markersCreateBody" 
                             class="panel-collapse collapse" 
                             role="tabpanel" 
                             aria-labelledby="markersCreateHeading">
                            <div class="panel-body" 
                                 role="group">
                                <h5>ICS Marker</h5>
                                <div class="btn-group" 
                                     role="group"
                                     id="icsMarkerDropdown">
                                    <button type="button" 
                                            class="btn btn-default dropdown-toggle" 
                                            data-toggle="dropdown" 
                                            aria-expanded="false"
                                            >
                                        Select... 
                                        <span class="caret"></span>
                                    </button>
                                    <ul class="dropdown-menu" 
                                        role="menu">
                                    </ul>
                                    <button id="createMarker" 
                                            type="button"
                                            class="btn btn-default" 
                                            data-toggle="tooltip" 
                                            data-placement="top" 
                                            title="Add a marker to the globe at the center.">
                                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                        Add
                                    </button>
                                </div>
                                <h5>Pushpin</h5>
                                <div class="btn-group" 
                                     role="group"
                                     id="pushpinDropdown">
                                    <button type="button" 
                                            class="btn btn-default dropdown-toggle" 
                                            data-toggle="dropdown" 
                                            aria-expanded="false"
                                            >
                                        Select... 
                                        <span class="caret"></span>
                                    </button>
                                    <ul class="dropdown-menu" 
                                        role="menu">
                                    </ul>
                                    <button id="createPushpin" 
                                            type="button"
                                            class="btn btn-default" 
                                            data-toggle="tooltip" 
                                            data-placement="top" 
                                            title="Add a pushpin to the globe at the center.">
                                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--Marker List-->
                    <div class="panel panel-default">
                        <div class="panel-heading collapsed" 
                             data-toggle="collapse" 
                             data-parent="#markersAccordion" 
                             href="#markersListBody" 
                             aria-expanded="false" 
                             aria-controls="markersListBody"
                             role="tab" 
                             id="markersListHeading">
                            <h4 class="panel-title">
                                Marker List
                            </h4>
                        </div>
                        <div id="markersListBody" 
                             class="panel-collapse collapse" 
                             role="tabpanel" 
                             aria-labelledby="markersListHeading">
                            <div class="panel-body">
                                <ul class="list-group pre-scrollable" 
                                    id="markerList">
                                </ul>                              
                            </div>
                        </div>
                    </div>
                    <!--Marker Settings-->
                    <div class="panel panel-default">
                        <div class="panel-heading collapsed" 
                             data-toggle="collapse" 
                             data-parent="#markersAccordion" 
                             href="#markersSettingsBody" 
                             aria-expanded="false" 
                             aria-controls="markersSettingsBody" 
                             role="tab" 
                             id="markersSettingsHeading">
                            <h4 class="panel-title">
                                Settings
                            </h4>
                        </div>
                        <div id="markersSettingsBody" 
                             class="panel-collapse collapse" 
                             role="tabpanel" 
                             aria-labelledby="markersSettingsHeading">
                            <div class="panel-body">
                                <div class="btn-group btn-block btn-group-sm"  role="group">
                                    <button type="button" class="col-sm-8  btn btn-default">
                                        Action
                                    </button>
                                    <button type="button" class="col-sm-2 btn btn-default glyphicon glyphicon-pencil"></button>
                                    <button type="button" class="col-sm-2 btn btn-default glyphicon glyphicon-trash"></button>
                                </div>
                                <div class="btn-group btn-block "  role="group">
                                    <button type="button" class="col-sm-8  btn btn-danger">
                                        Action
                                    </button>
                                    <button type="button" class="col-sm-2 btn btn-danger glyphicon glyphicon-pencil"></button>
                                    <button type="button" class="col-sm-2 btn btn-danger glyphicon glyphicon-trash"></button>
                                </div>
                                <div class="btn-group btn-block">
                                    <button type="button" class="col-sm-10 col-md-11 btn btn-danger ">Action</button>
                                    <button type="button" class="col-sm-2 col-md-1 btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                        <span class="caret"></span>
                                        <span class="sr-only">Toggle Dropdown</span>
                                    </button>
                                    <ul class="dropdown-menu" role="menu">
                                        <li><a href="#">Action</a></li>
                                        <li><a href="#">Another action</a></li>
                                        <li><a href="#">Something else here</a></li>
                                        <li class="divider"></li>
                                        <li><a href="#">Separated link</a></li>
                                    </ul>        
                                </div>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <!--Weather Sidebar-->
            <div id="weatherPanel" 
                 class="col-sm-4 col-lg-3 sidebar" 
                 style="display:none;">
                <h4>
                    <span class="glyphicon glyphicon-cloud" aria-hidden="true" style="padding-right: 5px;"></span>
                    Weather
                </h4>
                <div class="panel-group" id="weatherAccordion" role="tablist" aria-multiselectable="false">
                    <div class="panel panel-default">
                        <div class="panel-heading" role="tab" id="weatherSettingsHeading">
                            <h4 class="panel-title">
                                <a class="collapsed" 
                                   data-toggle="collapse" 
                                   data-parent="#weatherAccordion" 
                                   href="#weatherSettingsBody" 
                                   aria-expanded="false" 
                                   aria-controls="weatherSettingsBody">
                                    Settings
                                </a>
                            </h4>
                        </div>
                        <div id="weatherSettingsBody" class="panel-collapse collapse" role="tabpanel" 
                             aria-labelledby="weatherSettingsHeading">
                            <div class="panel-body">
                                <ul>
                                    <li>A...</li>
                                    <li>B...</li>
                                    <li>C...</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <!--Fires Sidebar-->
            <div id="firesPanel" 
                 class="col-sm-4 col-lg-3 sidebar" 
                 style="display:none;">
                <h4>
                    <span class="glyphicon glyphicon-fire" aria-hidden="true" style="padding-right: 5px;"></span>
                    Fires
                </h4>
                <div class="panel-group" id="firesAccordion" role="tablist" aria-multiselectable="false">
                    <div class="panel panel-default">
                        <div class="panel-heading" role="tab" id="firesSettingsHeading">
                            <h4 class="panel-title">
                                <a class="collapsed" 
                                   data-toggle="collapse" 
                                   data-parent="#firesAccordion" 
                                   href="#firesSettingsBody" 
                                   aria-expanded="false" 
                                   aria-controls="firesSettingsBody">
                                    Settings
                                </a>
                            </h4>
                        </div>
                        <div id="firesSettingsBody" class="panel-collapse collapse" role="tabpanel" 
                             aria-labelledby="firesSettingsHeading">
                            <div class="panel-body">
                                <ul>
                                    <li>A...</li>
                                    <li>B...</li>
                                    <li>C...</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
            <!---------------->
            <!--Globe Window-->
            <!---------------->
            <div class="col-sm-8 col-lg-9" id="globe" style="height: 100%">
                <!--<div style="position:relative">-->
                <div id='canvas-wrap' style="height: 100%">
                    <!--Set canvas' tabindex so keydown events can be captured-->
                    <canvas id="canvasOne" tabindex='1' >
                        <h1>Your browser does not support HTML5 Canvas.</h1>
                    </canvas>
                    <!--DOM UI elements go here!-->                
                    <!--<div class='container-full'>-->
                    <!--Coordinates Overlay-->
                    <div>
                        <div id="coordinateOverlay" class="col-xs-4 col-sm-4 col-md-4 non-interactive">
                            <div class="row">
                                <span>Eye Alt: </span><span id="eyeAltitude"></span>
                            </div>
                        </div>            
                    </div>
                    <!--REST information overlay-->
                    <div id="RESTPanel" class="rest-panel-bottom non-interactive">
                        <div class="row">            
                            <div id="restSolarData" class="col-xs-6 col-sm-4 col-md-4 pull-left non-interactive">
                                <table>
                                    <tr>
                                        <td>Time:</td>
                                        <td><span id="apptime"></span></td>
                                    </tr>
                                    <tr>
                                        <td>Sunrise:</td>
                                        <td><span id="sunrise"></span></td>
                                    </tr>
                                    <tr>
                                        <td>Sunset:</td>
                                        <td><span id="sunset"></span></td>
                                    </tr>
                                </table>
                            </div>
                            <div id="restWeatherData" class="visible-lg non-interactive">

                            </div>
                            <div id="restTerrainData" class="col-xs-6 col-sm-4 col-md-4 pull-right non-interactive">
                                <table>
                                    <tr>
                                        <td>Lat:</td>
                                        <td><span id="targetLatitude"></span></td>
                                    </tr>
                                    <tr>
                                        <td>Lon:</td>
                                        <td><span id="targetLongitude"></span></td>
                                    </tr>
                                    <tr>
                                        <td>Elevation:</td>
                                        <td><span id="targetElevation"></span></td>
                                    </tr>
                                    <tr>
                                        <td>Aspect:</td>
                                        <td><span id="targetAspect"></span></td>
                                    </tr>
                                    <tr>
                                        <td>Slope:</td>
                                        <td><span id="targetSlope"></span></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="bottom"></div>
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
    </body>
</html>
