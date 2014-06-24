'use strict';

/**
 * @ngdoc overview
 * @name spacePortDemoApp
 * @description
 * # spacePortDemoApp
 *
 * Main module of the application.
 */
var spacePortDemoApp = angular.module('spacePortDemoApp', [
    'ngRoute',
    'ui.bootstrap'
  ]);

spacePortDemoApp
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .otherwise({
                redirectTo: '/'
        });
    })
    .run(function( $window, $rootScope) {
        $rootScope.online = navigator.onLine;
        $window.addEventListener('offline', function () {
            $rootScope.$apply(function() {
                $rootScope.online = false;
            });
        }, false);
        $window.addEventListener('online', function () {
            $rootScope.$apply(function() {
                $rootScope.online = true;
            });
        }, false);
    });

