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
        })
        .state('app.attendanceAdd', {
            url: '/attendance/add',
            views: {
                'pages': {
                    template: require('../templates/add-attendance.html'),
                    controller: 'attendanceAddCtrl'
                }
            }
        });
};
