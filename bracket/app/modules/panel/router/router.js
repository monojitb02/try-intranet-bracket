'use strict';

module.exports = function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            template: require('../templates/panel.html'),
            controller: 'panelCtrl'
        });

    $urlRouterProvider.otherwise(function($injector) {
        var $state = $injector.get('$state');
        $state.go('login');
    });
};
