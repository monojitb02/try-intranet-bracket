'use strict';

module.exports = function($stateProvider, $locationProvider, $urlRouterProvider) {
    $stateProvider
        .state('app.profile', {
            url: '/profile',
            views: {
                'pages': {
                    template: require('../templates/profile.html'),
                    controller: 'profileCtrl'
                }
            }
        });
};
