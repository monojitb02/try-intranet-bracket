'use strict';

module.exports = function($stateProvider, $locationProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            template: require('../templates/panel.html'),
            controller: 'panelCtrl'
        });
};
