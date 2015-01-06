'use strict';

define([
    'angular',
    'Util',
    'angularRoute',
    'employeeModulePath/main',
    'userModulePath/main',
    'attendanceModulePath/main',
    'leaveModulePath/main'
  ],
  function(angular, util, angularRoute, EmployeeModule, UserModule, AttendanceModule, LeaveModule) {
    if (!util.modules.app) {
      var app = angular.module('intranet', ['ngRoute', 'EmployeeModule', 'UserModule', 'AttendanceModule', 'LeaveModule']);
      app.controller('LayoutController', ['$scope', '$injector', '$element',
          function($scope, $injector, $element) {
            require(['commons/controllers/layoutcontroller'], function(logincontroller) {
              // injector method takes an array of modules as the first argument
              // if you want your controller to be able to use components from
              // any of your other modules, make sure you include it together with 'ng'
              // Furthermore we need to pass on the $scope as it's unique to this controller
              $injector.invoke(logincontroller, this, {
                '$scope': $scope,
                '$element': $element
              });
            });
          }
        ])
        .directive('sponsorBorderDirective', function() {
          return function(scope, element, attrs) {
            angular.element(element).addClass(sponsorBorderClasses[attrs.index % sponsorBorderClasses.length]);
          };
        }).filter('name', function() {
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
        }).filter('address', function() {
          return function(addressObj) {
            if (addressObj) {
              return addressObj.city + ', ' + addressObj.state + '- ' + addressObj.country;
            } else {
              return '';
            }
          };
        }).filter('fullAddress', function() {
          return function(addressObj) {
            if (addressObj) {
              return addressObj.fullAddress + ',' + addressObj.city + ', ' + addressObj.state + '- ' + addressObj.country + ' PIN - ' + addressObj.PIN;
            } else {
              return '';
            }
          };
        }).filter('gender', function() {
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
        }).filter('url', function() {
          return function(imageUrl) {
            if (imageUrl) {
              return util.api.getBaseUrl() + imageUrl;
            } else {
              return './resources/images/user.png';
            }
          };
        }).filter('typeOfLeave', function() {
          return function(leaveType) {
            if (leaveType === 1) {
              return 'CL';
            } else if (leaveType === 2) {
              return 'PL';
            }
          };
        }).filter('statusCode', function() {
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
        }).filter('totalCount', function() {
          return function(totalCount) {
            if (totalCount.from && totalCount.to) {
              return Math.ceil((new Date(totalCount.to) - new Date(totalCount.from)) / 86400000) + 1;
            } else {
              return 'ERROR';
            }
          };
        }).filter('stringToTime', function() {
          return function(string) {
            var b = string.split(':');
            return b[0] + ' hour ' + b[1] + ' minute ';
          };
        });
      util.modules.app = app;
    }
    return util.modules.app;

  });
