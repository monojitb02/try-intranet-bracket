'use strict';

module.exports = function($stateProvider, $locationProvider, $urlRouterProvider) {
    $stateProvider
        .state('app.attendanceView', {
            url: '/attendance/list',
            views: {
                'pages': {
                    template: require('../templates/view.html'),
                    controller: 'attendanceViewCtrl'
                }
            }
        });
};
