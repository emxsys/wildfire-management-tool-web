/**
 * Main content module
 */
define(['ojs/ojcore', 'knockout'], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function homeContentViewModel() {
        var self = this;

        self.something = ko.observable("This paragraph uses content from its own 'home' ViewModel. The VM is found in the /js/viewmodels folder");
    }

    return homeContentViewModel;
});
