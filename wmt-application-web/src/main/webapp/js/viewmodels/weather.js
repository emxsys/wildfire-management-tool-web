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
        function weatherViewModel() {
            var manager = controller.model.weatherScoutManager;

            this.selectedItems = ko.observableArray([]);
            this.scouts = new oj.ArrayTableDataSource(manager.scouts, {idAttribute: "id"});
        }

        return weatherViewModel;
    });
