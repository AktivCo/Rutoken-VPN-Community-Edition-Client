import './css/main.css';
import './utils/string-util';

import { ipcRenderer } from 'electron';
import angular from 'angular'
import uirouter from 'angular-ui-router';
import 'angular-file-upload/src/index.js';

angular
    .module('app', [uirouter, 'angularFileUpload'])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$compileProvider',
        ($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider) => {


            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('index', {
                    url: '/',
                    controller: 'connectionController',
                    template: require('./templates/index.html')

                })
                .state('index.connection-status0', {
                    url: '/connection-status0',
                    views: {
                        'content': { template: require('./templates/connection/content/status0.html') },
                        'footer': { template: require('./templates/connection/footer/status0.html') }
                    }
                })
                .state('index.connection-status1', {
                    url: '/connection-status1',
                    views: {
                        'content': { template: require('./templates/connection/content/status1.html') },
                        'footer': { template: require('./templates/connection/footer/status1.html') }
                    }
                })
                .state('index.connection-status2', {
                    url: '/connection-status2',
                    views: {
                        'content': { template: require('./templates/connection/content/status2.html') },
                        'footer': { template: require('./templates/connection/footer/status2.html') }
                    }
                })
                .state('index.connection-status3', {
                    url: '/connection-status3',
                    views: {
                        'content': { template: require('./templates/connection/content/status3.html') },
                        'footer': { template: require('./templates/connection/footer/status3.html') }
                    }
                })
                .state('index.connection-status5', {
                    url: '/connection-status5',
                    views: {
                        'content': { template: require('./templates/connection/content/status5.html') }
                    }
                })
                .state('index.connection-status6', {
                    url: '/connection-status6',
                    views: {
                        'content': { template: require('./templates/connection/content/status6.html') }
                    }
                })
                .state('index.connection-status7', {
                    url: '/connection-status7',
                    views: {
                        'content': { template: require('./templates/connection/content/status7.html') }
                    }
                })
                .state('index.connection-status10', {
                    url: '/connection-status10',
                    views: {
                        'content': { template: require('./templates/connection/content/status10.html') },
                        'footer': { template: require('./templates/connection/footer/status10.html') }
                    }
                })
                .state('index.connection-status11', {
                    url: '/connection-status11',
                    views: {
                        'content': { template: require('./templates/connection/content/status11.html') }
                    }
                })
                .state('index.connection-status12', {
                    url: '/connection-status12',
                    views: {
                        'content': { template: require('./templates/connection/content/status12.html') }
                    }
                })
                .state('index.connection-status13', {
                    url: '/connection-status13',
                    views: {
                        'content': { template: require('./templates/connection/content/status13.html') }
                    }
                })
                .state('index.connection-status14', {
                    url: '/connection-status14',
                    views: {
                        'content': { template: require('./templates/connection/content/status14.html') }
                    }
                })
                .state('index.connection-status15', {
                    url: '/connection-status15',
                    views: {
                        'content': { template: require('./templates/connection/content/status15.html') }
                    }
                })
                .state('index.connection-status21', {
                    url: '/connection-status21',
                    views: {
                        'content': { template: require('./templates/connection/content/status21.html') }
                    }
                })
                .state('index.about', {
                    url: '/about',
                    views: {
                        'content': { template: require('./templates/about.content.html') },
                        'footer': { template: require('./templates/about.footer.html') }
                    }
                })
                .state('index.update', {
                    url: '/update',
                    views: {
                        'content': { template: require('./templates/update.content.html') },
                        'footer': { template: require('./templates/update.footer.html') }
                    }
                })
                .state('index.settings', {
                    url: '/settings',
                    views: {
                        'content': { template: require('./templates/settings.content.html') },
                        'footer': { template: require('./templates/settings.footer.html') }
                    }
                })
                .state('index.clean', {
                    url: '/clean',
                    views: {
                        'content': { template: require('./templates/clean.content.html') },
                        'footer': { template: require('./templates/clean.footer.html') }
                    }
                });


            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob|data):/);

        }])
    .controller('connectionController', [
        '$scope', '$state', '$http', 'FileUploader', '$document', ($scope, $state, $http, FileUploader, $document) => {

            $scope.$state = $state;

            $scope.year = new Date().getFullYear();

            var ipc = ipcRenderer;

            $scope.uploader = new FileUploader();

            $scope.errorLog = '';


            $scope.connection = {
                status: undefined,
                vpnServerConfiguration: null
            };

            $scope.connectionModel = {
                id: '',
                pin: ''
            };
            $scope.cleanModel = new CleanModel();


            var initConnection = () => {
                ipc.sendSync('connection', 2);
                console.log('we have started from front');

            };

            $scope.startVpn = () => {

                $scope.connection.loading = true;
                $scope.errorLog = '';
                let currentIndex = $scope.connection.pkcsIds.findIndex((element) => element.selected);

                let currentItem = $scope.connection.pkcsIds[currentIndex];
                if (currentItem.isDisabled) {
                    $scope.connection.loading = false;
                    /* eslint-disable no-undef */
                    alert('Срок действия сертификата истек.');
                    return;
                }
                ipc.send('startVpn', currentIndex, $scope.connection.vpnServerConfiguration);
            }

            $scope.sendPin = () => {

                $scope.connection.loading = true;
                ipc.send('sendPin', $scope.connectionModel.pin);
                $scope.connectionModel.pin = null;
            }

            $scope.stopVpn = () => {
                $scope.connection.loading = true;
                ipc.send('stopVpn', 1);
            }
            $scope.setStatusToInit = () => {
                ipc.send('setStatusToInit', 1);
            };

            $scope.stopVpn = () => {
                $scope.connection.loading = true;
                ipc.send('stopVpn', 1);
            }
            $scope.saveSettings = () => {
                $scope.connection.loading = true;
                ipc.send('saveSettings', $scope.settingsModel);
            }

            ipc.on('succesOut', (event, data) => console.log(data));

            ipc.on('errorOut', (event, data) => $scope.errorLog = data);

            ipc.on('vpnStatus', (event, data) => {

                var checkvpnServerConf = (config) => {

                    return config !== null && config !== undefined;
                }

                // нет кофига показываем кнопку?
                //checkvpnServerConf(data.vpnServerConfiguration) ?  $scope.$apply(() => $scope.connection = data)  : $scope.go();
                checkvpnServerConf(data.vpnServerConfiguration) ?
                    $scope.$apply(() => $scope.connection = data)
                    : $scope.$apply(() => (data.vpnServerConfiguration = null, $scope.connection = data));



                if ($scope.connection.isConnectionHasInitiated) {
                    $scope.errorLog = '';
                }

                $state.go('index.connection-status' + $scope.connection.status);


                console.log($scope.connection);


            });

            ipc.on('setUpdateModel', (event, data) => {

                console.log(data);
                $scope.$apply(() => $scope.updateModel = data);

            });
            ipc.on('setSettingsModel', (event, data) => {

                console.log(data);
                $scope.$apply(() => $scope.settingsModel = data);

            });


            //загрузка апдейта
            $scope.loadUpdate = () => {
                //Dispatching click event.
                $scope.connection.loading = true;
                $scope.errorLog = '';

                ipc.send('startUpdate');
                $state.go('index.connection');

            }

            $scope.vpnConfigUpload = () => {
                /* eslint-disable no-undef */
                var myElement = document.getElementById('#myLoader');
                myElement.click();
            };

            // $scope.backToIndex = () => {  $state.go('index.connection') };

            $scope.uploader.onAfterAddingFile = (fileItem) => {

                console.log($scope.uploader);
                console.log('after adding file');

                var reader = new FileReader();

                reader.onloadend = () => {

                    var text = reader.result.split('\n');


                    $scope.$apply(() => $scope.serverconf = text);

                    ipc.send('saveConfig', $scope.serverconf);
                    $scope.serverconf = null;
                    $scope.uploader.clearQueue();

                }
                console.log(fileItem);
                reader.readAsText(fileItem._file);
            };



            $scope.clean = () => {
                console.log($scope.serverconf);
                $scope.connection.loading = true;
                $scope.cleanModel = new CleanModel();
                ipc.send('deleteConfig');
            };

            $scope.getCurrentConnectionStatus = () => ipc.send('getCurrentConnectionStatus', 1);

            $scope.selectItem = (items, currentIndex) => {
                items = items.map((element, index) => {
                    if (currentIndex === index && !element.selected) {
                        element.selected = true;
                    }
                    if (currentIndex !== index && element.selected) {
                        element.selected = false;
                    }
                    return element;
                });
            }

            $document.bind('keydown', function (e) {

                if (e.keyCode == 27) {
                    $scope.stopVpn();
                }
            });

            initConnection();
        }
    ])
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind('keydown keypress', function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .directive('autofocus', ['$timeout', ($timeout) => {
        return {
            link: (scope, element) => {
                $timeout(() => { element[0].focus(); });
            }
        }
    }])
    .directive('arrowSelector', ['$document', function ($document) {
        return {
            scope: {
                items: '=',
                selectItem: '='
            },
            restrict: 'A',
            link: function (scope, elem) {

                if (scope.items.length === 0) {
                    return;
                }

                let currentIndex = scope.items.findIndex((element) => element.selected);
                let length = scope.items.length;
                console.log(elem);
                $document.bind('keydown', function (e) {

                    if (e.keyCode == 38) {
                        if (currentIndex == 0) {
                            return;
                        }
                        currentIndex--;
                        scope.selectItem(scope.items, currentIndex);
                        apply(e);
                    }
                    if (e.keyCode == 40) {

                        if (currentIndex + 1 === length) {
                            return;
                        }
                        currentIndex++;
                        scope.selectItem(scope.items, currentIndex);
                        apply(e);
                    }
                });
                let apply = (e) => {
                    scope.$apply();
                    e.preventDefault();
                }
            }
        };
    }]);


angular.element(document).ready(() => { angular.bootstrap(document, ['app']) });


class CleanModel {
    constructor() {
        this.removeConfig = false;
    }
}
