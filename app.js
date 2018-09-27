(function (angular) {
    'use strict';

    angular.module('text-messages-embed', [
        'text-messages-embed.viz'
    ])

    .config(['$locationProvider', function($locationProvider) {
        // overwrites a teallium error on scroll
        window.s_PPVevent = function(e) {};
        if (window.Analytics) {
            window.Analytics.setup('electoral-college-2016', {
                embedded: window.self !== window.top,
                trackTime: true
                // trackScrollDepth: true
            });
        }
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);

    

})(window.angular);
