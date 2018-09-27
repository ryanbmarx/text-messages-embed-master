(function (angular) {
    'use strict';

    angular.module('text-messages-embed.imessages', [])

        .directive('imessages', ['$timeout', function ($timeout) {
            return {
                scope: {
                    url: '@'
                },
                templateUrl: 'components/imessages/imessages.html',
                restrict: 'E',
                controller: 'imessages',
                link: function ($scope, $element, $attr) {
                }
            };
        }])

        .controller('imessages', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {

            var _this = this,
                timing = {
                    show: 1000,
                    load: 1500,
                    restart: 5000
                };

            this.show_message = function (message, sleep_time) {
                $timeout(function () {
                    message.show = true;
                }, sleep_time);
            };

            this.stop_loading = function (message, sleep_time) {
                $timeout(function () {
                    message.loading = false;
                }, sleep_time);
            };

            $scope.messages = [];

            this.animate_messages = function () {
                if (!this.is_animating) {
                    this.is_animating = true;
                    // show first message
                    this.show_message($scope.messages[0], 0);
                    var sleep_time = 0;
                    for (var i = 1; i < $scope.messages.length; i += 1) {
                        var message = $scope.messages[i];
                        // increase total sleep time
                        sleep_time += timing.show;
                        // show message when sleep time occurs
                        this.show_message(message, sleep_time);
                        if (!message.sender) {
                            message.loading = true;
                            // stop loading after load time expires
                            sleep_time += timing.load;
                            this.stop_loading(message, sleep_time);
                        }
                    }
                    $timeout(function() {
                        _this.restart();
                    }, sleep_time + timing.restart)
                }
            };

            this.restart = function() {
                this.is_animating = false;
                for (var i = 1; i < $scope.messages.length; i += 1) {
                    var message = $scope.messages[i];
                    message.show = false;
                    message.loading = false;
                }
                this.animate_messages();
            };

            if ($scope.url) {
                $http({
                    method: 'GET',
                    url: $scope.url
                }).then(function successCallback(response) {
                    $scope.title = response.data.title;
                    $scope.messages = response.data.messages;
                    if ($scope.messages.length > 5) {
                        $scope.has_reveal = true;
                    }
                    _this.animate_messages();
                }, function errorCallback() {
                    console.warn('Unable to retrieve ' + $scope.url);
                });
            }

        }]);

})(window.angular);
