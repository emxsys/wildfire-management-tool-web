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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0"> <!-- Not sure "height=device-height" is needed, but It's an option. -->
        <!-- Bootstrap: The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->

        <title>Wildfire Management Tool (WMT)</title>
        <link rel="icon" type="image/x-icon" href="./favicon.png">

        <!--During development, we're using local copies and sometimes development versions of libraries. -->
        <!--Note: font-awesome and jquery-ui are required by prime-ui. -->
        <!--Style note: prime-ui themes compatible with bootstrap-slate include afterdark and afterwork (alt. cruze and ui-darkness). -->
        <link rel="stylesheet" type="text/css" href="./css/libs/jquery/jquery-ui-1.11.4.min.css" />         
        <link rel="stylesheet" type="text/css" href="./css/libs/font-awesome-4.3.0/css/font-awesome.min.css"  />
        <link rel="stylesheet" type="text/css" href="./css/libs/primeui/themes/afterdark/theme.css" />   
        <link rel="stylesheet" type="text/css" href="./css/libs/primeui/primeui-2.0-min.css" />   
        <link rel="stylesheet" type="text/css" href="./css/libs/primeui/datagrid.css" />   
        <link rel="stylesheet" type="text/css" href="./css/libs/bootstrap/css/bootstrap-slate.min.css"/>
        <link rel="stylesheet" type="text/css" href="./css/libs/pace/pace-theme-big-counter.css"/>
        <link rel="stylesheet" type="text/css" href="./css/override.css"/>
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
        <script type="text/javascript" src="./js/libs/pace/pace.min.js"></script>
        <script type="text/javascript" src="./js/libs/jquery/jquery-2.1.4.min.js" ></script>
        <script type="text/javascript">$(document).bind("mobileinit", function () {
                $.extend($.mobile, {autoInitializePage: false});
            });</script>
        <script type="text/javascript" src="./js/libs/jquery.mobile/jquery.mobile-1.4.5.js"></script>
        <script type="text/javascript" src="./js/libs/jquery/jquery-ui-1.11.4.min.js"></script>
        <script type="text/javascript" src="./js/libs/jquery/jquery.ui.touch-punch.js"></script>        
        <!--        <script type="text/javascript" src="./js/libs/primeui-2.0/production/primeui-2.0-min.js"></script>-->
        <script type="text/javascript" src="./js/libs/primeui/development/primeui-2.0.js"></script>
        <script type="text/javascript" src="./js/libs/primeui/production/js/datagrid/datagrid.js"></script>
        <script type="text/javascript" src="./js/libs/bootstrap/bootstrap-3.3.4.min.js"></script>        


        <!--For production, use content delivery network (CDN) libraries-->
        <!--<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">-->
        <!--<link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.5/jquery.mobile.structure-1.4.5.min.css">-->
        <!--<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js" type="text/javascript"></script>-->
        <!--<script src="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js" type="text/javascript"></script>-->
        <!--<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>-->
        <!--<script data-main="./scripts/main" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.17/require.min.js"></script>-->
    </head>

    <!-- Body: add padding to accommodate navbar-fixed-top style navbar -->
    <body style="padding-top: 50px;"> 

        <!--Main Menu-->
        <!-- BDS: Using mobile menu for desktop
        <nav id="mainMenu" class="navbar navbar-default navbar-fixed-top navbar-nomargin hidden-xs hidden-sm">
        -->
        <nav id="mainMenu" class="navbar navbar-default navbar-fixed-top navbar-nomargin hidden">
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
        <!--End Main Menu-->

        <!-- Mobile Main Menu -->
        <nav id="mobileMenu" class="c-menu hidden">
            <div class="container-fluid" style="height: calc(100% - 37px); margin-top:37px">
                <div style="overflow-y: auto; height: 100%">
                    <div class="row" style="padding-top: 10px">
                        <div class="col-xs-9 col-sm-9"
                             <ul class="c-menu__items">
                                <li class="c-menu__item"><a id="layersListButton" href="#" class="c-menu__link panel panel-default"><span class="glyphicon glyphicon-list"></span> Layers</a></li>            
                                <li class="c-menu__item"><a id="firesWildlandFiresButton" href="#" class="c-menu__link panel panel-default"><span class="glyphicon glyphicon-fire"></span> Wildland Fires</a></li>
                                <li class="c-menu__item"><a id="firesFireLookoutsButton" href="#" class="c-menu__link panel panel-default"><span><img src="js/modules/images/fire/unkn.png" width="16px" height="16px"></span> Fire Lookouts</a></li>
                                <li class="c-menu__item"><a id="weatherWeatherScoutsButton" href="#" class="c-menu__link panel panel-default"><span class="glyphicon glyphicon-cloud"></span> Weather</a></li>
                                <li class="c-menu__item"><a id="markerListButton" href="#" class="c-menu__link panel panel-default"><span class="glyphicon glyphicon-flag"></span> Markers</a></li>
                                <li class="c-menu__item"><a id="mobileControlPanelButton" href="#" class="c-menu__link panel panel-default"><span class="glyphicon glyphicon-globe"></span> Control Panel</a></li>
                            </ul>
                        </div>                    
                    </div>
                    <div class="col-xs-12 col-sm-12">
                        <div class="btn-group">
                            <button type="button"                                    
                                    class="btn btn-default active"
                                    id="icsMarkersToggle">
                                <span class="glyphicon glyphicon-alert"></span> ICS Markers
                            </button>
                            <button type="button"                                    
                                    class="btn btn-default"
                                    id="pushpinMarkersToggle">
                                <span class="glyphicon glyphicon-pushpin"></span> Pushpins
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <div id="c-maskMain" class="c-mask" ></div>
    <!-- /Mobile Main Menu -->

    <!-- Mobile Control Panel -->
    <nav id="mobileControlPanel" class="c-menu hidden">
        <div class="container-fluid" style="margin-top:37px">
            <!-- BDS margin vs padding 
            <div class="row" style="padding-top: 10px">-->
            <div class="row" style="margin-top: 10px">
                <div class="col-xs-11 col-sm-11">
                    <div class="panel-group" id="controlPanelAccordion" role="tablist" aria-multiselectable="false">
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
                                    </div>
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
                                        Fire Settings
                                    </a>
                                </h4>
                            </div>
                            <div id="firesSettingsBody" class="panel-collapse collapse" role="tabpanel" 
                                 aria-labelledby="firesSettingsHeading">
                                <div class="panel-body">
                                    <button id="fuelModel-btn" 
                                            type="button"
                                            class="btn btn-default" 
                                            data-toggle="tooltip" 
                                            data-placement="top" 
                                            title="Select the default fuel model.">
                                        <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
                                        Default Fuel Model
                                    </button>
                                    <button id="fuelMoisture-btn" 
                                            type="button"
                                            class="btn btn-default" 
                                            data-toggle="tooltip" 
                                            data-placement="top" 
                                            title="Select the default fuel moisture scenario.">
                                        <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
                                        Default Fuel Moisture
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ul class="c-menu__items">
                        <li class="c-menu__item"><a id="ctrlPanelGlobe" href="#" class="c-menu__link panel panel-default">Globe</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>

    <div id="c-maskCtrlPanel" class="c-mask"></div>
    <!-- /Mobile Control Panel -->

    <!-- Mobile Globe Menu -->
    <nav id="mobileGlobe" class="c-menu hidden">
        <div class="container-fluid" style="margin-top:5px">
            <div class="row">
                <div class="col-xs-2 col-sm-2" style="float:left;">
                    <button id="globeCheck" class="c-check">
                        <span class="span1"></span>
                        <span class="span2"></span>
                    </button>
                </div>
                <div class="col-xs-3 col-sm-3" style="float:right;padding-top:0px;">
                    <h5>Reset</h5>                        
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
                            style="margin-top:3px;"
                            type="button"
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Reset to north up and look down">
                        View
                    </button>
                    <button id="resetGlobe" 
                            class="btn btn-default" 
                            style="margin-top:3px;"
                            type="button"
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Reset view to factory defaults">
                        Globe
                    </button>                        
                </div>
                <div class="col-xs-9 col-sm-9" >
                    <div id="controlPanelGlobeBody" >
                        <div class="panel-body">
                            <h5>Projection</h5>
                            <div class="dropdown" 
                                 id="projectionDropdown">
                                <h6>Initializing...</h6>
                            </div>                                
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" style="padding-top: 0px">

            </div>
        </div>
    </nav>        
    <!-- /Mobile Globe Menu -->

    <!-- Mobile Layers List Menu -->
    <nav id="mobileLayersList" class="c-menu hidden">
        <div class="container-fluid" style="margin-top:5px; height: 100%">
            <div class="row">
                <div class="col-xs-2 col-sm-2" 
                     style="float:left;">
                    <button id="layersListCheck" class="c-check">
                        <span class="span1"></span>
                        <span class="span2"></span>
                    </button>
                </div>
                <div class="col-xs-10">
                    <h3 style="margin-top: 0; margin-bottom: 0; float:left;">Layers</h3>
                    <button id="refreshLayers" 
                            type="button"
                            class="btn btn-default btn-sm " 
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Refresh temporal map layers.">
                        <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
                    </button>
                </div>
            </div>
            <div class="row" style="margin-top:5px; height: calc(100% - 50px)">
                <!--Layer List-->
                <div class="col-xs-12 col-sm-12" style="height: 100%">
                    <div class="panel panel-default" style="height: 100%">
                        <ul class="list-group"
                            style="overflow-y: scroll; height: 100%"
                            id="layerList">
                        </ul>                              
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <!-- /Mobile Layers List Menu -->


    <!-- Mobile Weather Scouts Menu -->
    <nav id="mobileWeatherScouts" class="c-menu hidden">
        <div class="container-fluid" style="margin-top:5px">
            <div class="row">
                <div class="col-xs-2 col-sm-2" style="float:left;">
                    <button id="weatherScoutsCheck" class="c-check">
                        <span class="span1"></span>
                        <span class="span2"></span>
                    </button>
                </div>
                <div class="col-xs-10">
                    <h3 style="margin-top: 0; margin-bottom: 0; float:left;">Weather Scouts</h3>
                    <button id="createWeatherScout" 
                            type="button" 
                            class="btn btn-default btn-sm createWeatherScoutButton" 
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Add a weather scout to the globe.">
                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                        Add
                    </button>
                </div>            
            </div>
            <div class="row" style="padding-top: 5px">
                <div class="col-xs-12 col-sm-12">
                    <div class="panel panel-default">                            
                        <ul class="list-group" 
                            style="overflow-y: scroll; height: 100%"
                            id="weatherScoutList">
                        </ul>                              
                    </div>
                </div>
            </div>
        </div>
    </nav>    
    <!-- /Mobile Weather Scouts Menu -->


    <!-- Mobile Fire Lookouts Menu -->
    <nav id="mobileFireLookouts" class="c-menu hidden">
        <div class="container-fluid" style="margin-top:5px; height: 100%">
            <div class="row">
                <div class="col-xs-2 col-sm-2" style="float:left;">
                    <button id="fireLookoutsCheck" class="c-check">
                        <span class="span1"></span>
                        <span class="span2"></span>
                    </button>
                </div>
                <div class="col-xs-10">
                    <h3 style="margin-top: 0; margin-bottom: 0; float:left;">Fire Lookouts</h3>
                    <button id="createFireLookout" 
                            type="button" 
                            class="btn btn-default btn-sm createFireLookoutButton" 
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Add a fire lookout to the globe.">
                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                        Add
                    </button>
                </div>
            </div>
            <div class="row" style="padding-top: 5px; height: calc(100% - 50px)">
                <div class="col-xs-12 col-sm-12" style="height: 100%">
                    <div class="panel panel-default" style="height: 100%">                            
                        <ul class="list-group"
                            style="overflow-y: scroll; height: 100%"
                            id="fireLookoutList">
                        </ul>                              
                    </div>       
                </div>
            </div>
        </div>
    </nav>    
    <!-- /Mobile Fire Lookouts Menu -->        

    <!-- Mobile Wildland Fires Menu -->
    <nav id="mobileWildlandFires" class="c-menu hidden">
        <div class="container-fluid" style="margin-top:5px;">
            <div class="row">
                <div class="col-xs-2 col-sm-2" style="float:left;">
                    <button id="wildlandFiresCheck" class="c-check">
                        <span class="span1"></span>
                        <span class="span2"></span>
                    </button>
                </div>
                <div class="col-xs-10 col-sm-10 btn-group" role="group">
                    <h3 style="margin-top: 0; margin-bottom: 0; float:left;">Wildland Fires</h3>

                    <!--                    <button id="selectAllWildlandFires" 
                                                type="button"
                                                class="btn btn-default btn-sm " 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Adds all wildland fire perimeters to the globe.">
                                            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                            All
                                        </button>
                                        <button id="deselectAllWildlandFires" 
                                                type="button"
                                                class="btn btn-default btn-sm " 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Removes all wildland fire perimeters from the globe.">
                                            <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
                                            All
                                        </button>
                                        <button id="selectViewableWildlandFires" 
                                                type="button"
                                                class="btn btn-default btn-sm  " 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Adds all wildland fire perimeters that are in the current view.">
                                            <span class="glyphicon glyphicon-filter" aria-hidden="true"></span>
                                            Viewable
                                        </button>-->
                    <button id="refreshWildlandFires" 
                            type="button"
                            class="btn btn-default btn-sm " 
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Download and refresh wildland fire perimeters.">
                        <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
                    </button>
                </div>
            </div>
            <div class="row" style="padding-top: 5px">
                <div class="col-xs-12 col-sm-12">
                    <div class="panel panel-default" style="margin-bottom: 0">                            
                        <!--Override the pre-scrollable max-height-->
                        <ul class="pre-scrollable"
                            style="max-height: calc(39vh - 20px); margin-top: 5px;" 
                            id="wildlandFireList">
                        </ul>                              
                    </div>       
                </div>
            </div>
        </div>
    </nav>    
    <!-- /Mobile Wildland Fires Menu -->        

    <!-- Mobile Markers List -->
    <nav id="mobileMarkerList" class="c-menu hidden">
        <div class="container-fluid" style="margin-top:5px;">
            <div class="row">
                <div class="col-xs-2 col-sm-2" style="float:left;">
                    <button id="markerListCheck" class="c-check">
                        <span class="span1"></span>
                        <span class="span2"></span>
                    </button>
                </div>
            </div>
            <div class="row" style="padding-top: 5px">
                <div class="col-xs-12 col-sm-12">
                    <div class="panel panel-default" style="margin-bottom: 0">                            
                        <!--Override the pre-scrollable max-height-->
                        <ul class="pre-scrollable"
                            style="max-height: calc(35vh - 20px); margin-top: 5px;" 
                            id="allMarkersList">
                        </ul>                              
                    </div>       
                </div>
            </div>
        </div>
    </nav>    
    <!-- /Mobile Marker List -->        


    <!--WMTweb: Globe and Sidebars--> 
    <div id="wmtweb" class="container-full" style="position: relative; height: calc(100vh - 52px);">
        <!--Content-->
        <div class="row-full">

            <!---------------->
            <!--Globe Window-->
            <!---------------->
            <!-- BDS:<div class="col-sm-8 col-lg-9 noselect" id="globe" style="height: 100%">-->
            <div class="noselect" id="globe" style="height: 100%">
                <!--<div style="position:relative">-->
                <div id='canvas-wrap' style="height: 100%">
                    <!--Set canvas' tabindex so keydown events can be captured-->
                    <canvas id="canvasOne" tabindex='1' >
                        <h1>Your browser does not support HTML5 Canvas.</h1>
                    </canvas>
                    <!--Prime UI Globe Context Menu--> 
                    <!--                        <div>
                                                <ul id="globeContextMenu-popup" style="z-index: 2000;">
                                                    <li><a data-icon="fa-edit">Open</a></li>
                                                    <li><a data-icon="fa-minus">Delete</a></li>
                                                    <li><a data-icon="fa-refresh">Refresh</a></li>
                                                    <li><a data-icon="fa-gear">Configure</a></li>
                                                </ul>
                                            </div>-->
                    <!--DOM UI elements go here!-->                
                    <div class="container-full non-interactive" Style="position:absolute;top:5px"> 
                        <div class="row">
                            <!--Control Panel Button-->
                            <div class="col-xs-2 col-sm-1">
                                <button id="mobileMenuButton" class="c-hamburger c-hamburger--htla interactive">
                                    <span>toggle menu</span>
                                </button>
                            </div>
                            <!--Search Bar-->
                            <div class="col-xs-5 col-sm-6" 
                                 style="padding-right: 0; padding-left: 0; height:32px"
                                 id="searchBox">
                                <div class="input-group">
                                    <span class="input-group-btn">
                                        <button type="button" 
                                                class="btn btn-default btn-sm interactive"
                                                style="height:32px;"
                                                id="searchUndo">
                                            <span class="glyphicon glyphicon-circle-arrow-left" style=""/>
                                        </button>
                                    </span>
                                    <input type="text" 
                                           class="form-control interactive"
                                           style="height:32px;"
                                           placeholder="Go To..."
                                           id="searchText" />
                                    <span class="input-group-btn">
                                        <button type="button" 
                                                class="btn btn-default btn-sm interactive"
                                                style="height:32px;"
                                                id="searchRedo"> 
                                            <span class="glyphicon glyphicon-circle-arrow-right" style=""/>
                                        </button>
                                    </span>
                                </div>
                            </div>
                            <!--Help Button-->
                            <div class="col-xs-2 col-sm-3"
                                 style="padding-right: 0; padding-left: 0; height:32px">
                                <a class="btn btn-default btn-sm interactive" 
                                   href="https://bitbucket.org/emxsys/wildfire-management-tool-web/wiki/Quick%20Start" 
                                   title="Opens Quick Start help in another window."
                                   target="_blank"
                                   style="float:right;">
                                    <span class="glyphicon glyphicon-question-sign" />
                                </a>
                                <!--                                    <button type="button" 
                                                                            class="btn btn-default btn-sm interactive"
                                                                            id="help"> 
                                                                        <span class="glyphicon glyphicon-question-sign" />
                                                                    </button>-->
                            </div>
                            <!--WMT Logo-->
                            <a class="btn btn-link interactive" 
                               href="#" 
                               title="About WMTweb"
                               style="padding-right: 15px; padding-top: 0px; padding-left: 0; height:24px; float:right;">
                                <img id="wmt-logo" alt="WMTweb" src="./images/wmt-web-white-53x24.png" style='float:right;'>
                            </a>
                        </div>
                        <div class="row" style="padding-top: 5px;padding-left: 5px;">
                            <!--DateTime buttons-->
                            <div id="timeControlButtons" class="col-xs-7 col-sm-5">
                                <div class="btn-group btn-group-sm interactive" role="group" aria-label="time controls">
                                    <button id="time-fast-back" type="button" class="btn btn-default"><span class="glyphicon glyphicon-fast-backward" aria-hidden="true"></span></button>
                                    <button id="time-step-back" type="button" class="btn btn-default"><span class="glyphicon glyphicon-step-backward" aria-hidden="true"></span></button>
                                    <button id="time-reset" type="button" class="btn btn-default"><span class="glyphicon glyphicon-time" aria-hidden="true"></span></button>
                                    <button id="time-step-forward" type="button" class="btn btn-default"><span class="glyphicon glyphicon-step-forward" aria-hidden="true"></span></button>
                                    <button id="time-fast-forward" type="button" class="btn btn-default"><span class="glyphicon glyphicon-fast-forward" aria-hidden="true"></span></button>
                                </div>               
                            </div>
                            <!--DateTime slider-->
                            <div id="timeControlSlider" class="col-xs-5 col-sm-5 interactive"></div>
                        </div>
                        <div class="row">

                            <!-- ICS Marker Palette --> 
                            <div id="mobileIcsMarkerPalette" class="col-xs-3 col-sm-3" >
                                <div id="markerList" class="interactive"></div>
                            </div>

                            <!-- Pushpin Palette --> 
                            <div id="mobilePushpinPalette" class="col-xs-3 col-sm-3">
                                <div id="markerList" class="interactive"></div>
                            </div>
                            <!--Add Weather Scouts and Fire Lookouts Buttons-->
                            <div class="row">
                                <div id="globeScoutsLookoutsButtons" class="col-xs-3 col-sm-1 interactive" style='float: right; margin-top: 80px; max-width: 58px'>

                                    <!-- Refresh Weather Forecasts button-->
                                    <button id="globeRefreshWeatherForecasts" 
                                            type="button"
                                            class="btn btn-default refreshWeatherForecastButton" 
                                            style="float: right; margin-top: 5px"
                                            data-toggle="tooltip" 
                                            data-placement="top" 
                                            title="Refresh all weather forecasts.">
                                        <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
                                        <span class="glyphicon glyphicon-cloud" aria-hidden="true"></span>
                                    </button>

                                    <!--Add Weather Scout button-->
                                    <button id="globeCreateWeatherScout" 
                                            type="button"
                                            class="btn btn-default createWeatherScoutButton" 
                                            style="float:right; margin-top: 5px"
                                            data-toggle="tooltip" 
                                            data-placement="top" 
                                            title="Add a weather scout to the globe.">
                                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                        <span class="glyphicon glyphicon-cloud" aria-hidden="true"></span>
                                    </button>

                                    <!--Add Fire Lookout button-->
                                    <button id="globeCreateFireLookout" 
                                            type="button"
                                            class="btn btn-default createFireLookoutButton" 
                                            style="float: right; margin-top: 5px"
                                            data-toggle="tooltip" 
                                            data-placement="top" 
                                            title="Add a fire lookout to the globe.">
                                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                        <span><img src="js/modules/images/fire/unkn.png" width="16px" height="16px"></span>
                                    </button>          
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
                <div id="growl" style="z-index:1000;"></div>  
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
                                <!--<img alt="WMT" src="./images/wmt-web-logo.png" width="50%" height="50%">-->
                                <img alt="Emxsys" src="./images/emxsys_small_rect.jpg">
                                <p>Copyright (c) 2015, Bruce Schubert <a href="mailto:bruce@emxsys.com">(bruce@emxsys.com)</a> All rights reserved.</p>
                                <!--                                    <p>Redistribution and use in source and binary forms, with or without
                                                                        modification, are permitted provided that the following conditions are met:</p>
                                                                    <ul>
                                                                        <li>Redistributions of source code must retain the above copyright
                                                                            notice, this list of conditions and the following disclaimer.</li>
                                
                                                                        <li>Redistributions in binary form must reproduce the above copyright
                                                                            notice, this list of conditions and the following disclaimer in the
                                                                            documentation and/or other materials provided with the distribution.</li>
                                
                                                                        <li>Neither the name of Bruce Schubert, Emxsys nor the names of its 
                                                                            contributors may be used to endorse or promote products derived
                                                                            from this software without specific prior written permission.</li>
                                                                    </ul>-->
                                <p> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
                                    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
                                    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
                                    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
                                    ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
                                    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
                                    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
                                    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
                                    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
                                    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.</p>
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

            <!--Prime UI Pushpin Dialog--> 
            <div id="pushpin-dlg" title="Pushpin" style="display: none;">
                <form id="pushpin-form">
                    <div class="form_entry">
                        <label for="pushpinName" class="required">Name:</label>
                        <input name="pushpinName" type="text" id="pushpinName" placeholder="Unique name" required>
                    </div>
                    <div class="form_entry">
                        <h5>Location</h5>
                        <p id="pushpinLatitude">Latitude:</p> 
                        <p id="pushpinLongitude">Longitude:</p> 
                        <input id="pushpinMovable" type="checkbox" />
                    </div>
                </form>

            </div>    

            <!-- Remove confirmation dialog -->
            <div id="remove-dlg" title="Remove..." style="display: none;">
                <p>Do you really want to remove the selected item?</p>
                <div class="pui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
                    <button id="bt_remove_yes" type="button">Yes</button>
                    <button id="bt_remove_no" type="button">No</button>
                </div>
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

            <!--Prime UI Fire Lookout Viewer--> 
            <div id="lookout-dlg" title="Fire Lookout" style="display: none;">
                <div id="lookout-tabs">      
                    <ul>
                        <li><a href="#lookout-general-tab">General</a></li>
                        <li><a href="#lookout-fuel-tab">Fuel</a></li>
                        <li><a href="#lookout-forces-tab">Forces</a></li>
                        <li><a href="#lookout-weather-tab">Weather</a></li>
                        <li><a href="#lookout-behavior-tab">Behavior</a></li>
                        <li><a href="#lookout-alerts-tab">Alerts</a></li>
                    </ul>
                    <div>
                        <div id="lookout-general-tab">
                            <form id="lookout-frm">
                                <h4>Name</h4>
                                <div class="form_entry">
                                    <input name="lookout-name" type="text" id="lookout-name" placeholder="Unique name" required>
                                </div>
                                <h4>Location</h4>
                                <p id="lookout-placename"></p> 
                                <p id="lookout-latitude"></p> 
                                <p id="lookout-longitude"></p> 
                                <div class="form_entry">
                                    <input id="lookout-movable" type="checkbox" />
                                </div>
                            </form>
                        </div>
                        <div id="lookout-fuel-tab">
                            <h5>Fuel Model</h5>
                            <input type="checkbox" id="lookout-fuelmodel-auto" name="lookout-fuelmodel-auto" value="1"/>
                            <label for="lookout-fuelmodel-auto">Automatic Selection</label>
                            <select id="lookout-fuelmodel-drpdwn" name="lookout-fuelModel"></select>
                            <h5>Fuel Moisture</h5>
                            <select id="lookout-fuelmoisture-drpdwn" name="lookout-fuelMoisture"></select>
                        </div>
                        <div id="lookout-forces-tab">
                            <h5>CPS Primary Forces</h5>
                            <div>
                                <canvas id="lookout-forces-canvas">
                                    <h1>Your browser does not support HTML5 Canvas.</h1>
                                </canvas>                
                            </div>
                        </div>
                        <div id="lookout-weather-tab" >
                            <div id="lookout-weather-tbl"></div>
                        </div>
                        <div id="lookout-behavior-tab" >
                        </div>
                        <div id="lookout-alerts-tab" >
                        </div>
                    </div>                    
                </div>
            </div>    
            <!--Prime UI Weather Scout Viewer--> 
            <div id="scout-viewer" title="Weather Scout" style="display: none;">
                <form id="scout-frm">
                    <div id="scout-tabs">      
                        <ul>
                            <li><a href="#scout-general-tab">General</a></li>
                            <li><a href="#scout-weather-tab">Weather</a></li>
                            <li><a href="#scout-alerts-tab">Alerts</a></li>
                        </ul>
                        <div>
                            <div id="scout-general-tab">
                                <div class="form_entry">
                                    <h4>Name</h4>
                                    <input name="scout-name" type="text" id="scout-name" placeholder="Unique name" required>
                                </div>
                                <div class="form_entry">
                                    <h4>Location</h4>
                                    <p id="scout-placename"></p> 
                                    <p id="scout-latitude"></p> 
                                    <p id="scout-longitude"></p> 
                                    <input id="scout-movable" type="checkbox" />
                                </div>
                            </div>
                            <div id="scout-weather-tab" >
                                <div id="scout-weather-tbl"></div>
                            </div>
                            <div id="scout-alerts-tab" >
                            </div>
                        </div>                    
                    </div>
                </form>
            </div>    
            <!--Prime UI Marker Viewer--> 
            <div id="marker-viewer" title="Marker" style="display: none;">
                <form id="marker-frm">
                    <div id="marker-tabs">      
                        <ul>
                            <li><a href="#marker-general-tab">General</a></li>
                            <li><a href="#marker-details-tab">Details</a></li>
                        </ul>
                        <div>
                            <div id="marker-general-tab">
                                <div class="form_entry">
                                    <h4>Name</h4>
                                    <input name="marker-name" type="text" id="marker-name" placeholder="Unique name" required>
                                </div>
                                <div class="form_entry">
                                    <h4>Location</h4>
                                    <p id="marker-placename"></p> 
                                    <p id="marker-latitude"></p> 
                                    <p id="marker-longitude"></p> 
                                    <input id="marker-movable" type="checkbox" />
                                </div>
                            </div>
                            <div id="marker-details-tab" >
                            </div>
                        </div>                    
                    </div>
                </form>
            </div>       
            <!--Prime UI Fuel Model Dialog--> 
            <form id="fuelModel-frm">
                <div id="fuelModel-dlg" title="Set Fuel Model" style="display: none;">
                    <div id="fuelModel-tabs">      
                        <ul>
                            <li><a href="#fuelModel-standard-tab">Standard</a></li>
                            <li><a href="#fuelModel-original-tab">Original</a></li>
                            <li><a href="#fuelModel-custom-tab">Custom</a></li>
                        </ul>
                        <div>
                            <div id="fuelModel-standard-tab">
                                <div id="fuelModel-standard-tbl"></div>
                            </div>
                            <div id="fuelModel-original-tab">
                                <div id="fuelModel-original-tbl"></div>
                            </div>
                            <div id="fuelModel-custom-tab">
                                <div id="fuelModel-custom-tbl"></div>
                            </div>
                        </div>                    
                    </div>
                </div>        
            </form>
            <!--Prime UI Fuel Moisture Dialog--> 
            <div id="fuelMoisture-dlg" title="Set Fuel Moisture" style="display: none;">
                <div id="fuelMoisture-tbl">
                </div>
            </div>        

            <!--Prime UI Search Box Results Dialog--> 
            <div id="searchResults-dlg" title="Search Results" style="z-index: 2000; display: none;">
                <div id="searchResults-globe" title="Preview" style="width: 100%;"> 
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
    </div>
    <!--Load the and run WMTweb application-->
    <script data-main="./js/main" src="./js/libs/require/require.js"></script>

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
