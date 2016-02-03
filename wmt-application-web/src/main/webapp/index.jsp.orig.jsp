<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0"> <!-- Not sure "height=device-height" is needed, but It's an option. -->
        <!-- Bootstrap: The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->

        <meta name="description" content="Wildfire Managment Tool - Web Edition">
        <meta name="author" content="Bruce Schubert">
        <link rel="icon" type="image/x-icon" href="./favicon.png">

        <title>Wildfire Management Tool</title>

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

        <script>
            // Pace.js Progress Bar options
            paceOptions = {
                // Only show the progress on initial load, not on every request.
                restartOnRequestAfter: false,
                restartOnPushState: false
            };
        </script>

        <script type="text/javascript" src="./js/libs/pace/pace.min.js"></script>
        <script type="text/javascript" src="./js/libs/jquery/jquery-2.1.4.min.js" ></script>
        <script type="text/javascript">$(document).bind("mobileinit", function () {
                $.extend($.mobile, {autoInitializePage: false});
            });</script>
        <script type="text/javascript" src="./js/libs/jquery.mobile/jquery.mobile-1.4.5.js"></script>
        <script type="text/javascript" src="./js/libs/jquery/jquery-ui-1.11.4.min.js"></script>
        <script type="text/javascript" src="./js/libs/jquery/jquery.ui.touch-punch.js"></script>        
        <script type="text/javascript" src="./js/libs/primeui/production/primeui-2.0-min.js"></script>
        <script type="text/javascript" src="./js/libs/primeui/production/js/datagrid/datagrid.js"></script>
        <script type="text/javascript" src="./js/libs/bootstrap/bootstrap-3.3.4.min.js"></script>        
    </head>

    <body>

        <!--Main Menu NavBar-->
    <nav class="navbar navbar-default navbar-fixed-top" style=" z-index: 1000">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-navbar" aria-expanded="false" aria-controls="main-navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">
                    <img src="images/wmt-web-white-53x24.png" alt="WMT" id="wmt-logo"/>
                </a>
            </div>
            <div id="main-navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav navbar-right">
                    <li class="active">
                        <a href="#home" aria-controls="home" role="tab" data-toggle="tab">
                            <span class="glyphicon glyphicon-home visible-sm-block" aria-hidden="true" style="padding-top: 4px; padding-bottom: 4px" ></span>
                            <span class="hidden-sm" aria-hidden="true" >Home</span>
                        </a></li>
                    <li><a href="#layers" aria-controls="layers" role="tab" data-toggle="tab">
                            <span class="glyphicon glyphicon-list visible-sm-block" aria-hidden="true" style="padding-top: 4px; padding-bottom: 4px"></span>
                            <span class="hidden-sm" aria-hidden="true" >Layers</span>
                        </a></li>
                    <li><a href="#incidents" aria-controls="incidents" role="tab" data-toggle="tab">
                            <span class="glyphicon glyphicon-fire visible-sm-block" aria-hidden="true" style="padding-top: 4px; padding-bottom: 4px"></span>
                            <span class="hidden-sm" aria-hidden="true" >Incidents</span>
                        </a></li>
                    <li><a href="#lookouts" aria-controls="weather" role="tab" data-toggle="tab">
                            <span class="visible-sm-block"><img src="js/modules/images/fire/unkn.png" width="18px" height="20px"></span>
                            <span class="hidden-sm" aria-hidden="true" >Lookouts</span>
                        </a></li>
                    <li><a href="#weather" aria-controls="weather" role="tab" data-toggle="tab">
                            <span class="glyphicon glyphicon-cloud visible-sm-block" aria-hidden="true" style="padding-top: 4px; padding-bottom: 4px" ></span>
                            <span class="hidden-sm" aria-hidden="true" >Weather</span>
                        </a></li>
                    <li><a href="#markers" aria-controls="markers" role="tab" data-toggle="tab">
                            <span class="glyphicon glyphicon-map-marker visible-sm-block" aria-hidden="true" style="padding-top: 4px; padding-bottom: 4px"></span>
                            <span class="hidden-sm" aria-hidden="true" >Markers</span>
                        </a></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Tools <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="#">Action</a></li>
                            <li><a href="#">Another action</a></li>
                            <li><a href="#">Something else here</a></li>
                            <li role="separator" class="divider"></li>
                            <li class="dropdown-header">Nav header</li>
                            <li><a href="#">Separated link</a></li>
                            <li><a href="#">One more separated link</a></li>
                        </ul>
                    </li>
                </ul>
                <!--                <form class="navbar-form navbar-right" role="search">        
                                    <div class="form-group">
                                        <input type="text" 
                                               class="form-control interactive"
                                               placeholder="Go To..."
                                               id="searchText" />
                                    </div>
                                </form>-->
            </div>
        </div>
    </nav>

    <!--Content-->
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div id="left-sidebar" class="col-sm-4 col-md-3 sidebar-left tab-content">

                <!--Home-->
                <div class="tab-pane active" role="tabpanel" id="home"  >
                    <div class="section-heading">
                        <h3 class="sub-header">
                            <span class="glyphicon glyphicon-home" aria-hidden="true" style="padding-right: 5px;"></span>
                            Home
                            <a class="section-toggle" data-toggle="collapse" href="#home-body" aria-expanded="true" aria-controls="home-body"></a>
                        </h3>
                    </div>
                    <div class="section-body collapse in" id="home-body" >
                    </div>
                </div>
                <!--/Home-->

                <!--Layers-->
                <div class="tab-pane" role="tabpanel" id="layers" >
                    <div class="section-heading">
                        <h3 class="sub-header">
                            <span class="glyphicon glyphicon-list" aria-hidden="true" style="padding-right: 5px;"></span>
                            Layers
                            <a class="section-toggle" data-toggle="collapse" href="#layers-body" aria-expanded="true" aria-controls="layers-body"></a>
                        </h3>
                    </div>
                    <div id="layers-body" class="section-body collapse in">
                        <div class="tree">
                            <ul style="padding-left: 0">
                                <li><span><i class="glyphicon glyphicon-minus-sign"></i>Base Layers</span>
                                    <ul id="baseLayers" data-bind="foreach: baseLayers">
                                        <li data-bind="if: showInMenu">
                                            <span class="label" style="white-space: normal;" data-bind="text: displayName, click: $parent.toggleLayer, css: { 'label-primary': $data.layerEnabled }"></span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <ul style="padding-left: 0">
                                <li><span><i class="glyphicon glyphicon-minus-sign"></i>Overlay Layers</span>
                                    <ul id="overlayLayers" data-bind="foreach: overlayLayers">
                                        <li data-bind="if: showInMenu">
                                            <span class="label" style="white-space: normal;" data-bind="text: displayName, click: $parent.toggleLayer, css: { 'label-primary': $data.layerEnabled }"></span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <ul style="padding-left: 0">
                                <li><span><i class="glyphicon glyphicon-minus-sign"></i>Data Layers</span>
                                    <ul id="dataLayers" data-bind="foreach: dataLayers">
                                        <li data-bind="if: showInMenu">
                                            <span class="label" style="white-space: normal;" data-bind="text: displayName, click: $parent.toggleLayer, css: { 'label-primary': $data.layerEnabled }"></span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <ul style="padding-left: 0">
                                <li><span><i class="glyphicon"></i>Widgets</span>
                                    <ul id="widgetLayers" data-bind="foreach: widgetLayers">
                                        <li data-bind="if: showInMenu">
                                            <span class="label" style="white-space: normal;" data-bind="text: displayName, click: $parent.toggleLayer, css: { 'label-primary': $data.layerEnabled }"></span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <!--                    <div class="list-group" id="baseLayers" data-bind="foreach: baseLayers">
                                                <button class="list-group-item btn btn-block" 
                                                        style="white-space: normal;"
                                                        data-bind="text: displayName, click: $parent.toggleLayer, visible: $data.showInMenu, css: { active: $data.layerEnabled }">
                                                </button>
                                            </div>  
                                            <div class="list-group" id="overlayLayers" data-bind="foreach: overlayLayers">
                                                <button class="list-group-item btn btn-block" 
                                                        style="white-space: normal;"
                                                        data-bind="text: displayName, click: $parent.toggleLayer, visible: $data.showInMenu, css: { active: $data.layerEnabled }">
                                                </button>
                                            </div>  
                                            <div class="list-group" id="overlayLayers" data-bind="foreach: dataLayers">
                                                <button class="list-group-item btn btn-block" 
                                                        style="white-space: normal;"
                                                        data-bind="text: displayName, click: $parent.toggleLayer, visible: $data.showInMenu, css: { active: $data.layerEnabled }">
                                                </button>
                                            </div>  
                                            <div class="list-group" id="overlayLayers" data-bind="foreach: widgetLayers">
                                                <button class="list-group-item btn btn-block" 
                                                        style="white-space: normal;"
                                                        data-bind="text: displayName, click: $parent.toggleLayer, visible: $data.showInMenu, css: { active: $data.layerEnabled }">
                                                </button>
                                            </div>  -->
                    </div>
                </div>
                <!--/Layers-->

                <!--Incidents-->
                <div class="tab-pane" role="tabpanel" id="incidents">
                    <div class="section-heading">
                        <h3 class="sub-header">
                            <span class="glyphicon glyphicon-fire" aria-hidden="true" style="padding-right: 5px;"></span>
                            Incidents
                            <a class="section-toggle" data-toggle="collapse" href="#incidents-body" aria-expanded="true" aria-controls="incidents-body"></a>
                        </h3>
                    </div>
                    <div class="section-body collapse in" id="incidents-body" >
                        <div class="panel panel-default">                            
                            <ul style="padding-left: 0" id="wildlandFireList">
                            </ul>                              
                        </div>       
                    </div>
                </div>
                <!--/Incidents-->

                <!--Fire Lookouts-->
                <div class="tab-pane" role="tabpanel" id="lookouts">
                    <div class="section-heading">
                        <h3 class="sub-header">
                            <span style="padding-right: 5px;"><img src="js/modules/images/fire/unkn.png" width="24px" height="28px" style="padding-bottom: 4px;"></span>
                            Fire Lookouts
                            <a class="section-toggle" data-toggle="collapse" href="#lookouts-body" aria-expanded="true" aria-controls="lookouts-body"></a>
                        </h3>
                    </div>
                    <div class="section-body collapse in" id="lookouts-body" >
                        <div class="panel panel-default">                            
                            <ul style="padding-left: 0" id="fireLookoutList">
                            </ul>                              
                        </div>       
                    </div>
                </div>
                <!--/Fire Lookouts-->

                <!--Weather Scouts-->
                <div role="tabpanel" class="tab-pane" id="weather">
                    <div class="section-heading">
                        <h3 class="sub-header">
                            <span class="glyphicon glyphicon-cloud" aria-hidden="true" style="padding-right: 5px;"></span>
                            Weather Scouts
                            <a class="section-toggle" data-toggle="collapse" href="#weather-body" aria-expanded="true" aria-controls="weather-body"></a>
                        </h3>
                    </div>
                    <div class="section-body collapse in" id="weather-body" >
                        <div class="panel panel-default">                            
                            <ul style="padding-left: 0" id="weatherScoutList">
                            </ul>                              
                        </div>       
                    </div>
                </div>
                <!--/Weather Scouts-->

                <!--Markers-->
                <div role="tabpanel" class="tab-pane" id="markers">
                    <div class="section-heading">
                        <h3 class="sub-header">
                            <span class="glyphicon glyphicon-map-marker" aria-hidden="true" style="padding-right: 5px;"></span>
                            Markers
                            <a class="section-toggle" data-toggle="collapse" href="#markers-body" aria-expanded="true" aria-controls="markers-body"></a>
                        </h3>
                    </div>
                    <div class="section-body collapse in" id="markers-body" >
                    </div>
                </div>
                <!--/Markers-->

            </div>
            <!-- /Sidebar -->

            <!-- Main -->
            <div class="col-sm-8 col-sm-offset-4 col-md-9 col-md-offset-3 main">

                <!--TODO: Fix this row--it causes a horizontal scrollbar in xs sizes-->
                <div class="row">
                    <!--Globe-->
                    <div class="col-sm-12 col-md-8 col-lg-9">
                        <div class="section-heading" id="globe" style="width: 100%; ">
                            <h3 class="sub-header">
                                <span class="glyphicon glyphicon-globe" aria-hidden="true" style="padding-right: 5px;"></span>
                                Globe</h3>
                        </div>
                        <!-- WebWorldWind -->
                        <div class="noselect" id='canvas-wrap' style="height: 75vh">
                            <!--Set canvas' tabindex so keydown events can be captured-->
                            <canvas id="canvasOne" tabindex='1' style="width: 100%; height: 100%"> 
                                <h1>Your browser does not support HTML5 Canvas.</h1>
                                <h2>The Globe cannot be displayed.</h2>
                                <h3>Try the latest Chrome or Firefox browsers.</h3>
                            </canvas> 
                            <div class="row">
                                <div class="col-xs-12 non-interactive" style="position:absolute; top: 45px; bottom: 0">
                                    <!--Scout and Lookout Buttons-->
                                    <!--Create a narrow div along the right edge of the globe-->
                                    <div class="interactive" style='float: right; margin-top: 130px; margin-right: 15px; max-width: 58px'>

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

                                        <button id="globeCreateWeatherScout" 
                                                type="button"
                                                class="btn btn-default createWeatherScoutButton" 
                                                style="float:right; margin-top: 5px;"
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Add a weather scout to the globe.">
                                            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                            <span class="glyphicon glyphicon-cloud" aria-hidden="true"></span>
                                        </button>

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

                                    <!--Time Controls-->
                                    <!--Create a shallow div along the bottom edge of the globe-->
                                    <div class="interactive" style="position: absolute; bottom: 0; width: 100%" >
                                        <div id="timeControlButtons" style="width: 166px; margin-right: auto; margin-left: auto">
                                            <div class="btn-group btn-group-sm interactive" role="group" style="float:bottom" aria-label="time controls">
                                                <button id="time-fast-back" type="button" class="btn btn-default"><span class="glyphicon glyphicon-fast-backward" aria-hidden="true"></span></button>
                                                <button id="time-step-back" type="button" class="btn btn-default"><span class="glyphicon glyphicon-step-backward" aria-hidden="true"></span></button>
                                                <button id="time-reset" type="button" class="btn btn-default"><span class="glyphicon glyphicon-time" aria-hidden="true"></span></button>
                                                <button id="time-step-forward" type="button" class="btn btn-default"><span class="glyphicon glyphicon-step-forward" aria-hidden="true"></span></button>
                                                <button id="time-fast-forward" type="button" class="btn btn-default"><span class="glyphicon glyphicon-fast-forward" aria-hidden="true"></span></button>
                                            </div>               
                                            <div id="timeControlSlider" class="interactive"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- /WebWorldWind -->
                    </div>
                    <!--/Globe-->

                    <!-- Details-->
                    <div class="col-sm-12 col-md-4 col-lg-3 ">
                        <div class="section-heading">
                            <h3 class="sub-header">
                                <span class="glyphicon glyphicon-cog" aria-hidden="true" style="padding-right: 5px;"></span>Details<a class="section-toggle" data-toggle="collapse"  href="#details"></a></h3>

                        </div>
                        <div id="details" class="section-body collapse in tab-content">
                            <div class="tab-pane active" role="tabpanel" id="location-details" >
                                <h4>Current Location</h4>
                                <ul>
                                    <li>Latitude/Longitude</li>
                                    <li>Time zone</li>
                                    <li>Time</li>
                                    <li>Fuel Model</li>
                                    <li>GeoMAC State, County, Jurisdiction</li>
                                    <li>GeoMAC Fire data</li>
                                </ul>
                            </div>
                            <div class="tab-pane" role="tabpanel" id="lookout-details" >
                                <h4>Selected Lookout</h4>
                                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                            </div>
                            <div class="tab-pane" role="tabpanel" id="scout-details" >
                                <h4>Selected Weather Scout</h4>
                                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                            </div>
                            <div class="tab-pane" role="tabpanel" id="marker-details" >
                                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                            </div>
                        </div>
                    </div>
                    <!-- /Details-->

                    <!-- Summary -->
                    <div class="col-sm-12 col-md-12">
                        <div class="section-heading">
                            <h3 class="sub-header">
                                <span class="glyphicon glyphicon-th" aria-hidden="true" style="padding-right: 5px;"></span>
                                Summary
                                <a class="section-toggle" data-toggle="collapse" href="#summary" aria-expanded="true" aria-controls="summary"></a>
                            </h3>
                        </div>
                        <div class="section-body table-responsive collapse in" id="summary">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Header</th>
                                        <th>Header</th>
                                        <th>Header</th>
                                        <th>Header</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1,001</td>
                                        <td>Lorem</td>
                                        <td>ipsum</td>
                                        <td>dolor</td>
                                        <td>sit</td>
                                    </tr>
                                    <tr>
                                        <td>1,002</td>
                                        <td>amet</td>
                                        <td>consectetur</td>
                                        <td>adipiscing</td>
                                        <td>elit</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- /Summary-->
                    <!--Prime UI Notify Widget--> 
                    <div id="notify"></div>
                    <!--Prime UI Growl Widget--> 
                    <div id="growl" style="z-index:1000; top: 50px"></div>  
                </div>
                <!--/row-->
            </div> 
            <!--/main-->

        </div>
        <!--/row-->
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
            </div>
        </div>
    </div>
    <!-- /container -->

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
    <div id="scout-viewer" title="Weather Scout" style="display: none">
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

    <!--Load the and run WMTweb application-->
    <script data-main="./js/main" src="./js/libs/require/require.js"></script>

    <script language="javascript">
            // Expand collapsed section bodies when not small
            $(window).resize(function () {
                if ($(window).width() >= 768) {
                    $('.section-body').collapse('show');
                }
            });
            // Auto-collapse nav-bar when collapsed
            $('.navbar-collapse a:not(.dropdown-toggle)').click(function () {
                $(".navbar-collapse").collapse('hide');
            });
            $('.navbar-collapse .dropdown-menu').click(function () {
                $(".navbar-collapse").collapse('hide');
            });
    </script>


</body>
</html>
