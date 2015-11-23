
(function () {
    'use strict';

    var rutokenVpnApp = angular.module('app', [
        // Angular modules 
        // Custom modules 
        // 3rd Party Modules

    ]);

    rutokenVpnApp
        .controller('connectionController', [
            '$scope', 'signalRHubProxy', '$http', function ($scope, signalRHubProxy, $http) {


                $scope.errorLog = "";

                $scope.connection = {
                    enterPin: false,
                    isEnvReady: false,
                    isConnectionHasInitiated: false,
                    loading: true
                };

                $scope.connectionModel = {
                    id: "",
                    pin: ""
                };

                var clientPushHubProxy = signalRHubProxy('aktivHub');


                clientPushHubProxy.connection.start(function () {

                    console.log("we have started from front");

                    $scope.startVpn = function (item) {
                        console.log(item);
                        $scope.errorLog = "";
                        clientPushHubProxy.invoke('startVpn', item);
                    }

                    $scope.sendPin = function () {
                        clientPushHubProxy.invoke('sendPin', $scope.connectionModel.pin);
                    }

                    $scope.stopVpn = function () {
                        clientPushHubProxy.invoke('stopVpn', 1);
                    }

                    $scope.installEnv = function () {
                        clientPushHubProxy.invoke('installEnvironment', 1);
                    }

                });

                clientPushHubProxy.on('succesOut', function (data) {
                    console.log(data);
                });

                clientPushHubProxy.on('errorOut', function (data) {
                    $scope.errorLog = data;
                });
                clientPushHubProxy.on('vpnStatus', function (data) {

                    console.log(data);
                    $scope.connection = data;
                    if ($scope.connection.isConnectionHasInitiated) {
                        $scope.errorLog = "";
                    }
                });


            }
        ]);

    rutokenVpnApp
        .factory('signalRHubProxy', [
            '$rootScope', function ($rootScope) {

                function signalRHubProxyFactory(hubName) {
                    var connection = $.hubConnection();
                    var proxy = connection.createHubProxy(hubName);


                    return {
                        on: function (eventName, callback) {
                            proxy.on(eventName, function (result) {
                                $rootScope.$apply(function () {
                                    if (callback) {
                                        callback(result);
                                    }
                                });
                            });
                        },
                        off: function (eventName, callback) {
                            proxy.off(eventName, function (result) {
                                $rootScope.$apply(function () {
                                    if (callback) {
                                        callback(result);
                                    }
                                });
                            });
                        },
                        invoke: function (methodName, params, callback) {
                            proxy.invoke(methodName, params)
                                .done(function (result) {
                                    $rootScope.$apply(function () {
                                        if (callback) {
                                            callback(result);
                                        }
                                    });
                                });
                        },
                        connection: connection
                    };
                };

                return signalRHubProxyFactory;
            }
        ]);

})();