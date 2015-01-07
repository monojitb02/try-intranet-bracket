// define([
//         'angular',
//         'Util',
//         'lang',
//         'underscore'
//     ],
//     function(angular, util, lang, _) {
//         'use strict';

//         if (!util.modules.employees) {
//             var app = angular.module('EmployeeModule', []);
//             app
//                 .controller('AddEmployee', [
//                     '$scope',
//                     '$injector',
//                     '$element',
//                     '$compile',
//                     'Users',
//                     'employee',
//                     function($scope, $injector, $element, $compile, UserService, employee) {
//                         require(['employeeModulePath/controllers/addEmployee'], function(addEmnployee) {
//                             $injector.invoke(addEmnployee, this, {
//                                 '$scope': $scope,
//                                 '$element': $element,
//                                 '$compile': $compile,
//                                 'UserService': UserService,
//                                 'employee': employee
//                             });
//                         });
//                     }
//                 ])
//                 .controller('SingleEmp', [
//                     '$scope',
//                     '$injector',
//                     '$element',
//                     '$compile',
//                     'Users',
//                     'employee',
//                     function($scope, $injector, $element, $compile, UserService, employee) {
//                         require(['employeeModulePath/controllers/singleEmp'], function(addEmnployee) {
//                             $injector.invoke(addEmnployee, this, {
//                                 '$scope': $scope,
//                                 '$element': $element,
//                                 '$compile': $compile,
//                                 'UserService': UserService,
//                                 'employee': employee
//                             });
//                         });
//                     }
//                 ])
//                 .controller('EmployeeList', ['$scope', '$injector', 'Users', 'employee',
//                     function($scope, $injector, UserService, employee) {
//                         require(['employeeModulePath/controllers/employeeList'], function(employeeList) {
//                             $injector.invoke(employeeList, this, {
//                                 '$scope': $scope,
//                                 'UserService': UserService,
//                                 'employee': employee
//                             });
//                         });
//                     }
//                 ])
//                 .controller('DesignationList', ['$scope', '$injector', '$element', '$modal',
//                     function($scope, $injector, $element, $modal) {
//                         require(['employeeModulePath/controllers/designationlist'], function(designationlist) {
//                             $injector.invoke(designationlist, this, {
//                                 '$scope': $scope,
//                                 '$element': $element,
//                                 '$modal': $modal
//                             });
//                         });
//                     }
//                 ])
//                 .controller('AddDesignation', ['$scope', '$injector', '$element', '$modal',
//                     function($scope, $injector, $element, $modal) {
//                         require(['employeeModulePath/controllers/adddesignation'], function(adddesignation) {
//                             $injector.invoke(adddesignation, this, {
//                                 '$scope': $scope,
//                                 '$modal': $modal
//                             });
//                         });
//                     }
//                 ])
//                 .factory('employee', function() {
//                     var emp = {};
//                     return emp;
//                 })
//                 .service('Users', ['$http', function($http) {
//                     return {
//                         getManagers: function(query) {
//                             return $http({
//                                 method: 'GET',
//                                 url: util.api.getManagers,
//                                 params: query
//                             });
//                         },
//                         getAllUsers: function(query) {
//                             return $http({
//                                 method: 'GET',
//                                 url: util.api.allAttenders,
//                                 params: query
//                             });
//                         },
//                         addEmp: function(query, profilePicture, $location, addEmployeeScope) {

//                             var fd = new FormData();

//                             if (profilePicture) {
//                                 fd.append('profilePicture', profilePicture, profilePicture.name);
//                             }
//                             _.each(query, function(value, key) {
//                                 if (typeof(value) === 'string') {
//                                     fd.append(key, value);
//                                 } else if (typeof(value) === 'object') {
//                                     fd.append(key, JSON.stringify(value));
//                                 }
//                             });

//                             // Set up the request.
//                             var xhr = new XMLHttpRequest();

//                             // Open the connection.
//                             xhr.open('POST', util.api.addEmployee + '?senderId=' + query.senderId, true);

//                             // Set up a handler for when the request finishes.
//                             xhr.onload = function(response) {
//                                 if (xhr.status === 200) {
//                                     if (JSON.parse(xhr.response).success) {
//                                         location.hash = '/employees/list';
//                                     } else {
//                                         $('[name="addEmployeeButton"]').removeAttr('disabled');
//                                         addEmployeeScope.loading = false;
//                                         addEmployeeScope.errors = _.values(JSON.parse(xhr.response).errfor);
//                                         addEmployeeScope.showErrors = true;
//                                         addEmployeeScope.$apply();

//                                         util.errorMessageTimeout({
//                                             success: function() {
//                                                 addEmployeeScope.errors = [];
//                                                 addEmployeeScope.showErrors = false;
//                                                 addEmployeeScope.$apply();
//                                             }
//                                         });
//                                     }
//                                 } else {
//                                     $('[name="addEmployeeButton"]').removeAttr('disabled');
//                                     addEmployeeScope.loading = false;
//                                     addEmployeeScope.errors = [lang.networkError];
//                                     addEmployeeScope.showErrors = true;
//                                     addEmployeeScope.$apply();

//                                     util.errorMessageTimeout({
//                                         success: function() {
//                                             addEmployeeScope.errors = [];
//                                             addEmployeeScope.showErrors = false;
//                                             addEmployeeScope.$apply();
//                                         }
//                                     });
//                                 }
//                             };

//                             xhr.onerror = function() {

//                                 $('[name="addEmployeeButton"]').removeAttr('disabled');
//                                 addEmployeeScope.loading = false;
//                                 addEmployeeScope.errors = [lang.networkError];
//                                 addEmployeeScope.showErrors = true;
//                                 addEmployeeScope.$apply();

//                                 util.errorMessageTimeout({
//                                     success: function() {
//                                         addEmployeeScope.errors = [];
//                                         addEmployeeScope.showErrors = false;
//                                         addEmployeeScope.$apply();
//                                     }
//                                 });

//                             };

//                             // Send the Data.
//                             return xhr.send(fd);

//                             /*return $http({
//                                 method: 'POST',
//                                 url: util.api.addEmployee,
//                                 data: query
//                             });*/
//                         },
//                         updateEmp: function(query, profilePicture, $location, addEmployeeScope) {
//                             var fd = new FormData();

//                             if (profilePicture) {
//                                 fd.append('profilePicture', profilePicture, profilePicture.name);
//                             }
//                             _.each(query, function(value, key) {
//                                 if (typeof(value) === 'string') {
//                                     fd.append(key, value);
//                                 } else if (typeof(value) === 'object') {
//                                     fd.append(key, JSON.stringify(value));
//                                 }
//                             });

//                             // Set up the request.
//                             var xhr = new XMLHttpRequest();

//                             // Open the connection.
//                             xhr.open('PUT', util.api.updateOther + '?senderId=' + query.senderId, true);

//                             // Set up a handler for when the request finishes.
//                             xhr.onload = function(response) {
//                                 if (xhr.status === 200) {
//                                     console.log('from service: ', JSON.parse(xhr.response));
//                                     if (JSON.parse(xhr.response).success) {
//                                         location.hash = '/employees/list';
//                                     } else {
//                                         $('[name="addEmployeeButton"]').removeAttr('disabled');
//                                         addEmployeeScope.loading = false;
//                                         addEmployeeScope.errors = _.values(JSON.parse(xhr.response).errfor);
//                                         addEmployeeScope.showErrors = true;
//                                         addEmployeeScope.$apply();

//                                         util.errorMessageTimeout({
//                                             success: function() {
//                                                 addEmployeeScope.errors = [];
//                                                 addEmployeeScope.showErrors = false;
//                                                 addEmployeeScope.$apply();
//                                             }
//                                         });
//                                     }
//                                 } else {
//                                     $('[name="addEmployeeButton"]').removeAttr('disabled');
//                                     addEmployeeScope.loading = false;
//                                     addEmployeeScope.errors = [lang.networkError];
//                                     addEmployeeScope.showErrors = true;
//                                     addEmployeeScope.$apply();

//                                     util.errorMessageTimeout({
//                                         success: function() {
//                                             addEmployeeScope.errors = [];
//                                             addEmployeeScope.showErrors = false;
//                                             addEmployeeScope.$apply();
//                                         }
//                                     });
//                                 }
//                             };

//                             xhr.onerror = function() {

//                                 $('[name="addEmployeeButton"]').removeAttr('disabled');
//                                 addEmployeeScope.loading = false;
//                                 addEmployeeScope.errors = [lang.networkError];
//                                 addEmployeeScope.showErrors = true;
//                                 addEmployeeScope.$apply();

//                                 util.errorMessageTimeout({
//                                     success: function() {
//                                         addEmployeeScope.errors = [];
//                                         addEmployeeScope.showErrors = false;
//                                         addEmployeeScope.$apply();
//                                     }
//                                 });

//                             };

//                             // Send the Data.
//                             return xhr.send(fd);
//                         }
//                     };
//                 }]);
//             util.modules.employees = app;
//         }
//         return util.modules.employees;

//     });
'use strict';

module.exports = angular.module('app.employee', ['ui.router', 'ui.bootstrap', 'app.service'])
    .controller('addEmployeeCtrl', require('./controllers/addEmployee'))
    .controller('employeeListCtrl', require('./controllers/employeeList'))
    // .controller('singleEmpCtrl', require('./controllers/singleEmployee'))
    .controller('designationListCtrl', require('./controllers/designationList'))
    // .controller('addDesignationCtrl', require('./controllers/addDesignation'))
    .config(require('./router/router'));
