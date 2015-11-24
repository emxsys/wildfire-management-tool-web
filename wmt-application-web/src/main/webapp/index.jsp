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
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-navbar" aria-expanded="false" aria-controls="main-navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">WMT</a>
            </div>
            <div id="main-navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav navbar-right">
                    <li class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Home</a></li>
                    <li><a href="#layers" aria-controls="layers" role="tab" data-toggle="tab">Layers</a></li>
                    <li><a href="#incidents" aria-controls="incidents" role="tab" data-toggle="tab">Incidents</a></li>
                    <li><a href="#lookouts" aria-controls="weather" role="tab" data-toggle="tab">Lookouts</a></li>
                    <li><a href="#weather" aria-controls="weather" role="tab" data-toggle="tab">Weather</a></li>
                    <li><a href="#markers" aria-controls="markers" role="tab" data-toggle="tab">Markers</a></li>
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
                <!--                <form class="navbar-form navbar-left" role="search">        
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

    <div class="container-fluid">
        <div class="row">
            <!-- left-sidebar -->
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
            <!-- /left-sidebar -->

            <!-- Main content -->
            <div class="col-sm-8 col-sm-offset-4 col-md-9 col-md-offset-3 main">
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

                        <!--Prime UI Notify Widget--> 
                        <div id="notify"></div>
                        <!--Prime UI Growl Widget--> 
                        <div id="growl" style="z-index:1000;"></div>  
                    </div>
                    <!--/Globe-->

                    <!-- Details-->
                    <div class="col-sm-4 col-md-4 col-lg-3 ">
                        <div class="section-heading">
                            <h3 class="sub-header">
                                <span class="glyphicon glyphicon-cog" aria-hidden="true" style="padding-right: 5px;"></span>Details<a class="section-toggle" data-toggle="collapse"  href="#details"></a></h3>

                        </div>
                        <div id="details" class="section-body collapse in">Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</div>
                    </div>
                    <!-- /Details-->

                    <!-- Summary -->
                    <div class="col-sm-8 col-md-12">
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
                </div>
                <!--/row-->
            </div> 
            <!--/main-->

        </div>
        <!--/row-->
    </div> 
    <!-- /container -->

    <!--Load the and run WMTweb application-->
    <script data-main="./js/main" src="./js/libs/require/require.js"></script>

    <script language="javascript">
        // Expand collapsed section bodies when not small
            $(window).resize(function () {
                if ($(window).width() >= 768) {
                    $('.section-body').collapse('show');
                }
            });
    </script>
    
</body>
</html>
