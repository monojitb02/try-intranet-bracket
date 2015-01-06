'use strict';

require('./modules/directives');
require('./modules/services');
// require('./modules/viewChart/viewChart.module');
require('./modules/login/login.module');
require('./modules/panel/panel.module');
require('./modules/dashBoard/dashBoard.module');
require('./modules/profile/profile.module');
require('./modules/attendance/attendance.module');

var appDependencies = [
    'ui.router', 'ui.bootstrap', 'app.directive',
    'app.service', 'app.login', 'app.dashBoard',
    'app.panel', 'app.profile', 'app.attendance'
];

module.exports = angular
    .module('app', appDependencies)
    .filter('stringToTime', function() {
        return function(string) {
            var b = string.split(':');
            return b[0] + ' hour ' + b[1] + ' minute ';
        };
    })
    .filter('name', function() {
        return function(empName) {
            if (empName) {
                if (empName.middle) {
                    return empName.first + ' ' + empName.middle + ' ' + empName.last;
                } else {
                    return empName.first + ' ' + empName.last;
                }
            } else {
                return '';
            }
        };
    });
