'use strict';

require('./modules/directives');
require('./modules/services');
require('./modules/login/login.module');
require('./modules/panel/panel.module');
require('./modules/dashBoard/dashBoard.module');
require('./modules/profile/profile.module');
require('./modules/attendance/attendance.module');
require('./modules/employee/employee.module');
require('./modules/leave/leave.module');
require('./modules/holiday/holiday.module');

var appDependencies = [
    'ui.router', 'ui.bootstrap', 'app.directive',
    'app.service', 'app.login', 'app.dashBoard',
    'app.panel', 'app.profile', 'app.attendance',
    'app.employee', 'app.leave', 'app.holiday'
];

module.exports = angular
    .module('app', appDependencies)
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
    })
    .filter('address', function() {
        return function(addressObj) {
            if (addressObj) {
                return addressObj.city + ', ' + addressObj.state + '- ' + addressObj.country;
            } else {
                return '';
            }
        };
    })
    .filter('fullAddress', function() {
        return function(addressObj) {
            if (addressObj) {
                return addressObj.fullAddress + ',' + addressObj.city + ', ' + addressObj.state + '- ' + addressObj.country + ' PIN - ' + addressObj.PIN;
            } else {
                return '';
            }
        };
    })
    .filter('gender', function() {
        return function(gender) {
            if (gender) {
                if (/m/i.test(gender)) {
                    return 'Male';
                } else if (/f/i.test(gender)) {
                    return 'Female';
                } else {
                    return '';
                }
            } else {
                return '';
            }
        };
    })
    .filter('url', function() {
        return function(imageUrl) {
            if (imageUrl) {
                return util.api.getBaseUrl() + imageUrl;
            } else {
                return './resources/images/user.png';
            }
        };
    })
    .filter('typeOfLeave', function() {
        return function(leaveType) {
            if (leaveType === 1) {
                return 'CL';
            } else if (leaveType === 2) {
                return 'PL';
            }
        };
    })
    .filter('statusCode', function() {
        return function(statusCode) {
            if (statusCode === 1) {
                return 'pending';
            } else if (statusCode === 2) {
                return 'approved';
            } else if (statusCode === 3) {
                return 'rejected';
            } else if (statusCode === 4) {
                return 'cancelled';
            }
        };
    })
    .filter('totalCount', function() {
        return function(totalCount) {
            if (totalCount.from && totalCount.to) {
                return Math.ceil((new Date(totalCount.to) - new Date(totalCount.from)) / 86400000) + 1;
            } else {
                return 'ERROR';
            }
        };
    })
    .filter('stringToTime', function() {
        return function(string) {
            var b = string.split(':');
            return b[0] + ' hour ' + b[1] + ' minute ';
        };
    });
