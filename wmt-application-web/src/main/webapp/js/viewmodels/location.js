/**
 * Location content module
 */
define(['ojs/ojcore', 'knockout', 'wmt/controller/Controller'],
    function (oj, ko, controller) {
        /**
         * The view model for the primary globe content view template
         */
        function locationViewModel() {
            var model = controller.model;
            this.eyePosLatitude = model.viewModel.eyePosLatitude;
            this.eyePosLongitude = model.viewModel.eyePosLongitude;
        }

        return locationViewModel;
    });
