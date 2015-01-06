'use strict';

module.exports = function($stateProvider, $locationProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            template: require('../templates/login.html'),
            controller: 'loginCtrl'
        });
};
