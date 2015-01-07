'use strict';

module.exports = function($stateProvider) {
    $stateProvider
        .state('app.applyLeave', {
            url: '/leave/apply',
            views: {
                'pages': {
                    template: require('../templates/request.html'),
                    controller: 'requestLeaveCtrl'
                }
            }
        })
        .state('app.leaveAccount', {
            url: '/leave/account',
            views: {
                'pages': {
                    template: require('../templates/leaveaccount.html'),
                    controller: 'leaveAccountCtrl'
                }
            }
        })
        .state('app.leaveDetail', {
            url: '/leave/detail',
            views: {
                'pages': {
                    template: require('../templates/leavedetail.html'),
                    controller: 'leaveDetailCtrl'
                }
            }
        })
        .state('app.leaveRequests', {
            url: '/leave/requests',
            views: {
                'pages': {
                    template: require('../templates/leaverequestview.html'),
                    controller: 'leaveRequestsCtrl'
                }
            }
        });
};
