<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
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
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0">
        <!-- Bootstrap: The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->

        <title>Wildfire Management Tool (WMT)</title>
        <link rel="icon" type="image/x-icon" href="./favicon.png">

        <!--During development, using local copies, and sometimes development versions of libraries. -->
        <!--Note: font-awesome and jquery-ui are required by prime-ui. -->
        <!--Style note: prime-ui themes compatible with bootstrap-slate include afterdark and afterwork (alt. cruze and ui-darkness). -->
        <link rel="stylesheet" type="text/css" href="./thirdparty/jquery-ui-1.11.4/jquery-ui.min.css" />   
        <link rel="stylesheet" type="text/css" href="./thirdparty/font-awesome-4.3.0/css/font-awesome.min.css"  />
        <link rel="stylesheet" type="text/css" href="./thirdparty/primeui-2.0/themes/afterdark/theme.css" />   
        <link rel="stylesheet" type="text/css" href="./thirdparty/primeui-2.0/production/primeui-2.0-min.css" />   
        <link rel="stylesheet" type="text/css" href="./thirdparty/primeui-2.0/production/css/datagrid/datagrid.css" />   
        <link rel="stylesheet" type="text/css" href="./thirdparty/bootstrap-3.3.4-dist/css/bootstrap-slate.min.css"/>
        <link rel="stylesheet" type="text/css" href="./thirdparty/pace/pace-theme-big-counter.css"/>
        <link rel="stylesheet" type="text/css" href="./css/WMT.css"/>
        <link rel="stylesheet" href="./css/MobileMenu.css"/>

        <script>
            // Pace.js Progress Bar options
            paceOptions = {
                // Only show the progress on initial load, not on every request.
                restartOnRequestAfter: false,
                restartOnPushState: false
            };
        </script>

        <!--TODO: All of these libraries can be specified with RequireJS in main.js-->
        <script type="text/javascript" src="./thirdparty/pace/pace.min.js"></script>
        <script type="text/javascript" src="./thirdparty/jquery-2.1.4.min.js" ></script>
        <script type="text/javascript" src="./thirdparty/jquery-ui-1.11.4/jquery-ui.min.js"></script>
        <script type="text/javascript" src="./thirdparty/jquery.ui.touch-punch.js"></script>
        <script type="text/javascript" src="./thirdparty/primeui-2.0/production/primeui-2.0-min.js"></script>
        <script type="text/javascript" src="./thirdparty/primeui-2.0/production/js/datagrid/datagrid.js"></script>
        <script type="text/javascript" src="./thirdparty/bootstrap-3.3.4-dist/js/bootstrap.min.js"></script>


        <!--For production, use content delivery network (CDN) libraries-->
        <!--<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">-->
        <!--<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js" type="text/javascript"></script>-->
        <!--<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>-->
        <!--<script data-main="./scripts/main" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.17/require.min.js"></script>-->
    </head>

    <!-- Body: add padding to accommodate navbar-fixed-top style navbar -->
    <body style="padding-top: 50px;"> 

        <!--Main Menu-->
        <nav id="mainMenu" class="navbar navbar-default navbar-fixed-top navbar-nomargin hidden-xs">
            <div class="container-fluid">
                <!--Navbar: Collapsed Menu-->
                <div class="navbar-header">
                    <!--Menu Button-->
                    <button id="expandMenuItem" type="button" 
                            class="navbar-toggle collapsed" 
                            data-toggle="collapse" data-target="#navbar" 
                            aria-expanded="false" aria-controls="navbar">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <!--Collapse Sidebar-->
                    <!--                <button id="collapsePanelsItem" type="button" 
                                            class="navbar-btn navbar-toggle collapsed" 
                                            aria-label="Show Globe">
                                        <span class="glyphicon glyphicon-chevron-up" 
                                              aria-hidden="true"></span>
                                    </button>-->
                    <!--Expand Sidebar-->
                    <button id="expandPanelsItem" type="button" 
                            class="navbar-btn navbar-toggle collapsed" 
                            aria-label="Show Panel">
                        <span class="glyphicon glyphicon-chevron-down" 
                              aria-hidden="true">
                        </span>
                    </button>
                    <!--WMT Icon-->
                    <a class="navbar-brand" href="#" style="padding-left: 5px; padding-right: 5px">
                        <img id="about" alt="WMT" src="./images/wmt-web-white-53x24.png">
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
                        <div class="form-group">
                            <input type="text" 
                                   class="form-control"
                                   style="width: 150px"
                                   placeholder="Go To..."
                                   id="searchText">
                        </div>
                        <div class="btn-group">
                            <button type="button" 
                                    class="btn btn-default glyphicon glyphicon-circle-arrow-left"
                                    id="searchUndo">
                            </button>
                            <button type="button" 
                                    class="btn btn-default glyphicon glyphicon-circle-arrow-right"
                                    id="searchRedo">
                                </span>  
                            </button>
                        </div>
                    </div>
                    <!--Help button - hidden until we make room by adjusting button margins-->
                    <!-- <ul class="nav navbar-nav navbar-right">
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
                    </ul>-->
                </div>
            </div>
        </nav>

        <nav id="mobileMenu" class=" hidden-md hidden-lg c-menu">
            <div class="container-fluid" style="margin-top:37px">
                <div class="row" style="padding-top: 10px">
                    <div class="col-xs-9 col-sm-9"
                         <ul class="c-menu__items">
                            <li class="c-menu__item"><a id="mobileControlPanelButton" href="#" class="c-menu__link panel panel-default"><span class="glyphicon glyphicon-globe"></span> Control Panel</a></li>
                            <li class="c-menu__item"><a id="" href="#" class="c-menu__link panel panel-default"><span class="glyphicon glyphicon-list"></span> Layers</a></li>
                            <li class="c-menu__item"><a id="" href="#" class="c-menu__link panel panel-default"><span class="glyphicon glyphicon-cloud"></span> Weather</a></li>
                            <li class="c-menu__item"><a id="" href="#" class="c-menu__link panel panel-default"><span class="glyphicon glyphicon-fire"></span> Fires</a></li>            
                        </ul>
                    </div>
                </div>
                <div class="row-full">
                    <span style="float:right;">||</span>
                </div>
            </div>
        </nav>

        <div id="c-maskMain" class="c-mask" ></div>

        <nav id="mobileControlPanel" class="hidden-md hidden-lg c-menu">
            <div class="container-fluid" style="margin-top:37px">
                <div class="row" style="padding-top: 10px">
                    <div class="col-xs-9 col-sm-9"
                         <ul class="c-menu__items">
                            <li class="c-menu__item"><a id="ctrlPanelLocation" href="#" class="c-menu__link panel panel-default">Location</a></li>
                            <li class="c-menu__item"><a id="" href="#" class="c-menu__link panel panel-default">Globe</a></li>
                            <li class="c-menu__item"><a id="" href="#" class="c-menu__link panel panel-default">Settings</a></li>
                            <li class="c-menu__item"><a id="" href="#" class="c-menu__link panel panel-default">Options</a></li>            
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

        <div id="c-maskCtrlPanel" class="c-mask"></div>

        <nav id="mobileLocation" class="hidden-md hidden-lg c-menu">
            <div class="container-fluid" style="margin-top:37px">
                <div class="row" style="padding-top: 10px">
                    <div class="col-xs-9 col-sm-9"
                         <ul class="c-menu__items">

                        </ul>
                    </div>
                </div>
            </div>
        </nav>

        <div id="c-maskLocation" class="c-mask"></div>

        <!--WMTweb: Globe and Sidebars--> 
        <div id="wmtweb" class="container-full" style="position: relative; height: calc(100vh - 52px);">
            <!--Content-->
            <div class="row-full">

                <!--Control Panel Sidebar-->
                <div id="controlPanel" class="col-sm-4 col-lg-3 sidebar hidden-xs"
                     style="display:none;">
                    <h4>
                        <span class="glyphicon glyphicon-globe" aria-hidden="true" style="padding-right: 5px;"></span>
                        Control Panel
                    </h4>
                    <div class="panel-group" id="controlPanelAccordion" role="tablist" aria-multiselectable="false">
                        <!--Location Panel-->
                        <div class="panel panel-default">
                            <div class="panel-heading collapsed" 
                                 id="controlPanelLocationHeading"
                                 role="tab" 
                                 data-toggle="collapse" 
                                 data-parent="#controlPanelAccordion" 
                                 href="#controlPanelLocationBody" 
                                 aria-expanded="false" 
                                 aria-controls="controlPanelLocationBody">                           
                                <h4 class="panel-title">
                                    Location
                                </h4>
                            </div>
                            <div class="panel-collapse collapse" 
                                 role="tabpanel" 
                                 aria-labelledby="controlPanelLocationHeading"
                                 id="controlPanelLocationBody" >
                                <div class="panel-body">
                                    <div class="btn-group btn-block" role="group">
                                        <button id="findMe" 
                                                class="btn btn-default" 
                                                type="button"
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Centers the globe on your location.">
                                            Find Me
                                        </button>
                                        <button id="followMe" 
                                                class="btn btn-default" 
                                                type="button"
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Keeps the globe centered on your location.">
                                            Follow Me
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                            <div class="panel-collapse collapse" 
                                 role="tabpanel" 
                                 aria-labelledby="controlPanelGlobeHeading"
                                 id="controlPanelGlobeBody" >
                                <div class="panel-body">
                                    <h5>Projection</h5>
                                    <div class="dropdown" 
                                         id="projectionDropdown">
                                        <h6>Initializing...</h6>
                                    </div>
                                    <h5>Reset</h5>
                                    <div class="btn-group btn-block" role="group">
                                        <button id="resetHeading" 
                                                class="btn btn-default" 
                                                type="button"
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Reset to north up">
                                            Heading
                                        </button>
                                        <button id="resetView" 
                                                class="btn btn-default" 
                                                type="button"
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Reset to north up and look down">
                                            View
                                        </button>
                                        <button id="resetGlobe" 
                                                class="btn btn-default" 
                                                type="button"
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Reset view to factory defaults">
                                            Globe
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
                     class="col-sm-4 col-lg-3 sidebar noselect" 
                     style="display:none;">
                    <h4 class="noselect">
                        <span class="glyphicon glyphicon-flag" aria-hidden="true" style="padding-right: 5px;"></span>
                        Markers
                    </h4>
                    <div class="panel-group" id="markersAccordion" role="tabcreate" aria-multiselectable="false">
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
                                    <div class="btn-group btn-block" 
                                         role="group"
                                         id="createMarkerButtons">
                                        <button id="createMarker" 
                                                type="button"
                                                class="btn btn-default" 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Add a marker to the globe at the center.">
                                            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                            ICS
                                        </button>
                                        <button id="createPushpin" 
                                                type="button"
                                                class="btn btn-default" 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Add a pushpin to the globe at the center.">
                                            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                            Pushpin
                                        </button>
                                    </div>
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
                     class="col-sm-4 col-lg-3 sidebar noselect" 
                     style="display:none;">
                    <h4>
                        <span class="glyphicon glyphicon-cloud" aria-hidden="true" style="padding-right: 5px;"></span>
                        Weather
                    </h4>
                    <div class="panel-group" id="weatherAccordion" role="tablist" aria-multiselectable="false">
                        <!--Weather Scouts-->
                        <div class="panel panel-default">
                            <div class="panel-heading collapsed" 
                                 data-toggle="collapse" 
                                 data-parent="#weatherAccordion" 
                                 href="#weatherScoutsBody" 
                                 aria-expanded="false" 
                                 aria-controls="weatherScoutsBody"
                                 role="tab" 
                                 id="weatherScoutsHeading">
                                <h4 class="panel-title">
                                    Scouts
                                </h4>
                            </div>
                            <div id="weatherScoutsBody" 
                                 class="panel-collapse collapse" 
                                 role="tabpanel" 
                                 aria-labelledby="weatherScoutsHeading">
                                <div class="panel-body">
                                    <button id="createWeatherScout" 
                                            type="button"
                                            class="btn btn-default" 
                                            data-toggle="tooltip" 
                                            data-placement="top" 
                                            title="Add a weather scout to the globe.">
                                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                        Add
                                    </button>
                                    <ul class="list-group pre-scrollable" 
                                        id="weatherScoutList">
                                    </ul>                              
                                </div>
                            </div>
                        </div>                   
                        <!--Weather Stations-->
                        <div class="panel panel-default">
                            <div class="panel-heading collapsed" 
                                 data-toggle="collapse" 
                                 data-parent="#weatherAccordion" 
                                 href="#weatherStationsBody" 
                                 aria-expanded="false" 
                                 aria-controls="weatherStationsBody"
                                 role="tab" 
                                 id="weatherStationsHeading">
                                <h4 class="panel-title">
                                    Stations
                                </h4>
                            </div>
                            <div id="weatherStationsBody" 
                                 class="panel-collapse collapse" 
                                 role="tabpanel" 
                                 aria-labelledby="weatherStationsHeading">
                                <div class="panel-body">
                                    <ul class="list-group pre-scrollable" 
                                        id="weatherStationList">
                                    </ul>                              
                                </div>
                            </div>
                        </div>
                        <!--Weather Settings-->
                        <div class="panel panel-default">
                            <div class="panel-heading collapsed" 
                                 data-toggle="collapse" 
                                 data-parent="#weathersAccordion" 
                                 href="#weathersSettingsBody" 
                                 aria-expanded="false" 
                                 aria-controls="weathersSettingsBody" 
                                 role="tab" 
                                 id="weatherSettingsHeading">
                                <h4 class="panel-title">
                                    Settings
                                </h4>
                            </div>
                            <div id="weatherSettingsBody" 
                                 class="panel-collapse collapse" 
                                 role="tabpanel" 
                                 aria-labelledby="weatherSettingsHeading">
                                <div class="panel-body">
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
                        <!--Fire Lookouts-->
                        <div class="panel panel-default">
                            <div class="panel-heading collapsed" 
                                 data-toggle="collapse" 
                                 data-parent="#fireAccordion" 
                                 href="#fireLookoutsBody" 
                                 aria-expanded="false" 
                                 aria-controls="fireLookoutsBody"
                                 role="tab" 
                                 id="fireLookoutsHeading">
                                <h4 class="panel-title">
                                    Lookouts
                                </h4>
                            </div>
                            <div id="fireLookoutsBody" 
                                 class="panel-collapse collapse" 
                                 role="tabpanel" 
                                 aria-labelledby="fireLookoutsHeading">
                                <div class="panel-body">
                                    <button id="createFireLookout" 
                                            type="button"
                                            class="btn btn-default" 
                                            data-toggle="tooltip" 
                                            data-placement="top" 
                                            title="Add a fire lookout to the globe.">
                                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                        Add
                                    </button>
                                    <ul class="list-group pre-scrollable" 
                                        id="fireLookoutList">
                                    </ul>                              
                                </div>
                            </div>
                        </div>       
                        <!--Fire Incidents-->
                        <div class="panel panel-default">
                            <div class="panel-heading collapsed" 
                                 data-toggle="collapse" 
                                 data-parent="#fireAccordion" 
                                 href="#fireIncidentsBody" 
                                 aria-expanded="false" 
                                 aria-controls="fireIncidentsBody"
                                 role="tab" 
                                 id="fireIncidentsHeading">
                                <h4 class="panel-title">
                                    Incidents
                                </h4>
                            </div>
                            <div id="fireIncidentsBody" 
                                 class="panel-collapse collapse" 
                                 role="tabpanel" 
                                 aria-labelledby="fireIncidentsHeading">
                                <div class="panel-body">
                                    <ul class="list-group pre-scrollable" 
                                        id="fireIncidentList">
                                    </ul>                              
                                </div>
                            </div>
                        </div>
                        
                        <!--Fire Settings-->
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
                <div class="col-sm-8 col-lg-9 noselect" id="globe" style="height: 100%">
                    <!--<div style="position:relative">-->
                    <div id='canvas-wrap' style="height: 100%">
                        <!--Set canvas' tabindex so keydown events can be captured-->
                        <canvas id="canvasOne" tabindex='1' >
                            <h1>Your browser does not support HTML5 Canvas.</h1>
                        </canvas>
                        <!--DOM UI elements go here!-->                
                        <div class="container-full non-interactive" Style="position:absolute;top:5px">
                            <div class="row">
                                <!--Control Panel Button-->
                                <div class="col-xs-2 col-sm-2 hidden-md hidden-lg">
                                    <button id="mobileMenuButton" class="c-hamburger c-hamburger--htla interactive">
                                        <span>toggle menu</span>
                                    </button>
                                </div>
                                <!--DateTime slider-->
                                <div id="timeControlSlider" class="col-xs-7 col-sm-7 interactive"></div>
                                <a class="col-xs-3 col-sm-3 interactive" href="#" style="float:right;">
                                    <img alt="WMT" src="./images/wmt-web-white-53x24.png" style='float:right;'>
                                </a>
                            </div>
                            <!--<div class='container-full'>-->  
                            <!--DateTime slider-->
                            <div id="timeControlSlider" class="col-xs-7 col-sm-7"></div>
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
                    <!--Prime UI Notify Widget--> 
                    <div id="notify"></div>
                    <!--Prime UI Growl Widget--> 
                    <div id="growl"></div>  
                </div>

                <!--Prime UI About Box Dialog--> 
                <div id="aboutBox-dlg" title="About WMT" style="display: none;">
                    <div id="aboutBox-tabs">      
                        <ul>
                            <li><a href="#aboutBox-tab1">Copyright</a></li>
                            <li><a href="#aboutBox-credit-tabs">Credits</a></li>
                            <li><a href="#aboutBox-license-tabs">Licenses</a></li>
                        </ul>
                        <div>
                            <div id="aboutBox-tab1">
                                <div>      
                                    <img alt="WMT" src="./images/emxsys-wmt-splash-fire-v4.png">
                                </div>
                            </div>
                            <div id="aboutBox-credit-tabs">
                                <ul>
                                    <li><a href="#about-credits-tab1">Bruce Schubert</a></li>
                                    <li><a href="#about-credits-tab2">Theodore Walton</a></li>
                                    <li><a href="#about-credits-tab3">Shawn Patterson</a></li>
                                </ul>    
                                <div id="aboutBox-credits-tab1"><h2>Software Architect, Emxsys</h2></div>
                                <div id="aboutBox-credits-tab2"><h2>UI Developer</h2></div>
                                <div id="aboutBox-credits-tab3"><h2>Graphic Designer</h2></div>
                            </div>
                            <div id="aboutBox-license-tabs">
                                <ul>
                                    <li><a href="#about-licenses-tab1">Wildfire Management Tool, BSD-3</a></li>
                                    <li><a href="#about-licenses-tab1">NASA Web World Wind</a></li>
                                    <li><a href="#about-licenses-tab2">PrimeUI, Apache</a></li>
                                    <li><a href="#about-licenses-tab3">BootStrap</a></li>
                                    <li><a href="#about-licenses-tab3">JQuery</a></li>
                                    <li><a href="#about-licenses-tab3">RequireJS</a></li>
                                    <li><a href="#about-licenses-tab3">Pace</a></li>
                                </ul>    
                            </div>
                        </div>                    
                    </div>
                </div>        

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

                <!--Prime UI ICS Marker Dialog--> 
                <div id="icsMarkerDialog" title="ICS Marker" style="display: none;">
                    <div>
                        <label for="markerName" class="required">Name:</label>
                        <input type="text" placeholder="Unique name" 
                               name="markerName" id="markerName" required>
                    </div>
                    <div id="icsMarkerGrid">

                    </div>
                    <!--            <div class="btn-group" 
                                     role="group"
                                     id="icsMarkerTypeDropdown">
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
                                </div> -->
                </div>

                <!--Prime-UI ICS Marker Palette --> 
                <div id="icsMarkerPalette" style="z-index: 2000;" title="Select an ICS Marker" style="display: none;">
                    <div id="markerGrid"></div>
                </div>

                <!--Prime-UI Pushpin Palette --> 
                <div id="pushpinPalette" title="Select a Pushpin Style" style="display: none;">
                    <div id="markerGrid"></div>
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

                <!--Prime UI Search Box Results Dialog--> 
                <div id="searchResults-dlg" title="Search Results" style="z-index: 2000; display: none;">
                    <div id="searchResults-globe" title="Preview" style="width: 100%; height: 300px">
                        <canvas id="canvasPreview">
                            <h1>Your browser does not support HTML5 Canvas.</h1>
                        </canvas>                
                    </div>
                    <div id="searchResults-tbl">
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

                <!--Prime UI Weather Scout Dialog--> 
                <div id="weatherScout-dlg" title="Weather Scout" style="display: none;">
                    <div >
                        <label for="name" class="required">Name</label>
                        <input type="text" placeholder="" 
                               name="name" id="name" required title="[+/-]DD.DDD, DD MM.MMM, or DD MM SS [N/S]">
                    </div>
                    <div class="longitude">
                        <label for="longitude" class="required">Longitude:</label>
                        <input type="text" placeholder="[+/-] Longitude" 
                               name="longitude" id="longitude" required title="[+/-]DD.DDD, DD MM.MMM, or DD MM SS [E/W]">
                    </div>
                </div> 

            </div>

            <!--Load the and run WMTweb application-->
            <script data-main="./scripts/main" src="./thirdparty/require.js"></script>

            <!--Google Analytics-->
            <script>
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            ga('create', 'UA-63788794-1', 'auto');
            ga('send', 'pageview');
            </script>
    </body>
</html>
