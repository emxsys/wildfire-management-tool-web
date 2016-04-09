/**
 * Layers content module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 
    'wmt/controller/Controller',
    'promise', 'ojs/ojknockout', 'ojs/ojcollapsible',
    'ojs/ojlistview', 'ojs/ojdatacollection-common'],
    function (oj, ko, $, controller) {
        /**
         * The view model for the primary globe content view template
         */
        function layersViewModel() {
//            var self = this;
//             Simply assign the LayerManager's observableArrays to this ModelView
//            self.backgroundLayers = controller.globe.layerManager.backgroundLayers;
//            self.baseLayers = controller.globe.layerManager.baseLayers;
//            self.overlayLayers = controller.globe.layerManager.overlayLayers;
//            self.dataLayers = controller.globe.layerManager.dataLayers;
//            self.widgetLayers = controller.globe.layerManager.widgetLayers;
            var layerManager = controller.globe.layerManager;

            this.selectedItems = ko.observableArray([]);
            this.baseLayers = new oj.ArrayTableDataSource(layerManager.baseLayers, {idAttribute: "displayName"});

        }

        return layersViewModel;
    });
