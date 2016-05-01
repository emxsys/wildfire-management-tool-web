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
            var self = this;
//             Simply assign the LayerManager's observableArrays to this ModelView
//            self.backgroundLayers = controller.globe.layerManager.backgroundLayers;
//            self.baseLayers = controller.globe.layerManager.baseLayers;
//            self.overlayLayers = controller.globe.layerManager.overlayLayers;
//            self.dataLayers = controller.globe.layerManager.dataLayers;
//            self.widgetLayers = controller.globe.layerManager.widgetLayers;
            self.layerManager = controller.globe.layerManager;

            self.selectedItems = ko.observableArray([]);
            self.selectedItem = ko.observable();
            self.baseLayers = new oj.ArrayTableDataSource(self.layerManager.baseLayers, {idAttribute: "displayName"});
            self.overlayLayers = new oj.ArrayTableDataSource(self.layerManager.overlayLayers, {idAttribute: "displayName"});
            self.dataLayers = new oj.ArrayTableDataSource(self.layerManager.dataLayers, {idAttribute: "displayName"});

            self.toggleSelected = function (event, ui) {
                if (ui.option === 'selection' && ui.value[0] !== null) {
                    // Promise
                    var promise = self.baseLayers.get(ui.value[0]);
                    promise.then(function(item) {
                        self.layerManager.toggleLayer(item.data);
                        self.selectedItem(item.data);                     
                    });
                    
                }
            };
        }

        return layersViewModel;
    });
