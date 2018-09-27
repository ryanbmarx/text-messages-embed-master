(function (angular) {
    'use strict';

    angular.module('text-messages-embed.viz', [
        'text-messages-embed.imessages',
        'iframe-resizer'
    ])

    .directive('viz', [function () {
        return {
            scope: {},
            templateUrl: 'components/viz/viz.html',
            restrict: 'E',
            controller: 'viz',
            link: function ($scope, $element, $attr) {
            }
        };
    }])

    .controller('viz', ['$scope', '$location', '$element', '$timeout', function ($scope, $location, $element, $timeout) {
        // see https://github.com/USATODAY/text-messages-embed/tree/c7c50ae181864a2c906fe2c467483fa6d3571a91 for iframe in view code.
        // will not work unless iframe is on the same domain
        var _this = this,
            viz_container = $element[0].querySelector('.viz-container'),
            params = $location.search();

        if (params.messages) {
            $scope.imessages_data_url = 'assets/data/' + params.messages + '.json';
        }
        else {
            console.warn('Messages param not set');
        }
        if (params.height) {
            viz_container.style.height = params.height + 'px';
        }

    }]);

})(window.angular);