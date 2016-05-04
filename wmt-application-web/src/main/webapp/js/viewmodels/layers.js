/**
 * Layers content module
 */
define(['ojs/ojcore', 'knockout', 'jquery',
    'wmt/controller/Controller',
    'promise', 'ojs/ojknockout', 'ojs/ojcollapsible',
    'ojs/ojlistview', 'ojs/ojdatacollection-common'],
    function (oj, ko, $, controller) {
        /**
         * The view model for the Layers View template
         */
        function layers() {
            var self = this;
            self.layerManager = controller.globe.layerManager;

            // Create view data sources from the LayerManager's observable arrays
            self.baseLayers = new oj.ArrayTableDataSource(self.layerManager.baseLayers, {idAttribute: "displayName"});
            self.overlayLayers = new oj.ArrayTableDataSource(self.layerManager.overlayLayers, {idAttribute: "displayName"});
            self.dataLayers = new oj.ArrayTableDataSource(self.layerManager.dataLayers, {idAttribute: "displayName"});

            // The view calls this method when a list item is selected.
            self.toggleSelected = function (event, ui) {
                
                if (ui.option === 'selection' && ui.value[0] !== null) {
                    // Query the datasource to get the selected layer object (wrapped in a Promise object)
                    var promise = self.baseLayers.get(ui.value[0]);
                    promise.then(function(item) {
                        // Caution: item.data is a clone of the layer, use the key to get the real layer object
                        var layer = self.layerManager.baseLayers()[item.index];
                        self.layerManager.toggleLayer(layer);
                    });
                    
                }
            };
        }

        return layers;
    });
