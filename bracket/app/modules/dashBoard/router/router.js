'use strict';

module.exports = function($stateProvider, $locationProvider, $urlRouterProvider) {
    $stateProvider
        .state('app.home', {
            url: '/home',
            views: {
                'pages': {
                    template: require('../templates/dashBoard.html'),
                    controller: 'dashBoardCtrl'
                }
            }
        });
    $urlRouterProvider.otherwise(function($injector) {
        var $state = $injector.get('$state');
        $state.go('app.home')
    });
};
