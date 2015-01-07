'use strict';

module.exports = function($stateProvider, $locationProvider, $urlRouterProvider) {
    $stateProvider
        .state('app.employeeList', {
            url: '/employee/list',
            views: {
                'pages': {
                    template: require('../templates/employeeList.html'),
                    controller: 'employeeListCtrl'
                }
            }
        })
        .state('app.employeeAdd', {
            url: '/employee/add',
            views: {
                'pages': {
                    template: require('../templates/addEmployee.html'),
                    controller: 'addEmployeeCtrl'
                }
            }
        })
        .state('app.designationList', {
            url: '/employee/designation',
            views: {
                'pages': {
                    template: require('../templates/designationList.html'),
                    controller: 'designationListCtrl'
                }
            }
        });
};
