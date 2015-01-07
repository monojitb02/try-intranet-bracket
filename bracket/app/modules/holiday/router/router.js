'use strict';

module.exports = function($stateProvider, $locationProvider, $urlRouterProvider) {
    $stateProvider
        .state('app.holiday', {
            url: '/holiday',
            views: {
                'pages': {
                    template: require('../templates/holiday.html'),
                    controller: 'holidayCtrl'
                }
            }
        });
};
