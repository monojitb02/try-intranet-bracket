'use strict';

var util = require('../../util');
var api = require('../../util/api');

var Service = angular.module('app.service', [])
    .service('UserService', ['$http', function($http) {
        return {
            getManagers: function(query) {
                return $http({
                    method: 'GET',
                    url: util.api.getManagers,
                    params: query
                });
            },
            getAllUsers: function(query) {
                return $http({
                    method: 'GET',
                    url: util.api.allAttenders,
                    params: query
                });
            },
            addEmp: function(query, profilePicture, $location, addEmployeeScope) {

                var fd = new FormData();

                if (profilePicture) {
                    fd.append('profilePicture', profilePicture, profilePicture.name);
                }
                _.each(query, function(value, key) {
                    if (typeof(value) === 'string') {
                        fd.append(key, value);
                    } else if (typeof(value) === 'object') {
                        fd.append(key, JSON.stringify(value));
                    }
                });

                // Set up the request.
                var xhr = new XMLHttpRequest();

                // Open the connection.
                xhr.open('POST', util.api.addEmployee + '?senderId=' + query.senderId, true);

                // Set up a handler for when the request finishes.
                xhr.onload = function(response) {
                    if (xhr.status === 200) {
                        if (JSON.parse(xhr.response).success) {
                            location.hash = '/employees/list';
                        } else {
                            $('[name="addEmployeeButton"]').removeAttr('disabled');
                            addEmployeeScope.loading = false;
                            addEmployeeScope.errors = _.values(JSON.parse(xhr.response).errfor);
                            addEmployeeScope.showErrors = true;
                            addEmployeeScope.$apply();

                            util.errorMessageTimeout({
                                success: function() {
                                    addEmployeeScope.errors = [];
                                    addEmployeeScope.showErrors = false;
                                    addEmployeeScope.$apply();
                                }
                            });
                        }
                    } else {
                        $('[name="addEmployeeButton"]').removeAttr('disabled');
                        addEmployeeScope.loading = false;
                        addEmployeeScope.errors = [lang.networkError];
                        addEmployeeScope.showErrors = true;
                        addEmployeeScope.$apply();

                        util.errorMessageTimeout({
                            success: function() {
                                addEmployeeScope.errors = [];
                                addEmployeeScope.showErrors = false;
                                addEmployeeScope.$apply();
                            }
                        });
                    }
                };

                xhr.onerror = function() {

                    $('[name="addEmployeeButton"]').removeAttr('disabled');
                    addEmployeeScope.loading = false;
                    addEmployeeScope.errors = [lang.networkError];
                    addEmployeeScope.showErrors = true;
                    addEmployeeScope.$apply();

                    util.errorMessageTimeout({
                        success: function() {
                            addEmployeeScope.errors = [];
                            addEmployeeScope.showErrors = false;
                            addEmployeeScope.$apply();
                        }
                    });

                };

                // Send the Data.
                return xhr.send(fd);

                /*return $http({
                    method: 'POST',
                    url: util.api.addEmployee,
                    data: query
                });*/
            },
            updateEmp: function(query, profilePicture, $location, addEmployeeScope) {
                var fd = new FormData();

                if (profilePicture) {
                    fd.append('profilePicture', profilePicture, profilePicture.name);
                }
                _.each(query, function(value, key) {
                    if (typeof(value) === 'string') {
                        fd.append(key, value);
                    } else if (typeof(value) === 'object') {
                        fd.append(key, JSON.stringify(value));
                    }
                });

                // Set up the request.
                var xhr = new XMLHttpRequest();

                // Open the connection.
                xhr.open('PUT', util.api.updateOther + '?senderId=' + query.senderId, true);

                // Set up a handler for when the request finishes.
                xhr.onload = function(response) {
                    if (xhr.status === 200) {
                        console.log('from service: ', JSON.parse(xhr.response));
                        if (JSON.parse(xhr.response).success) {
                            location.hash = '/employees/list';
                        } else {
                            $('[name="addEmployeeButton"]').removeAttr('disabled');
                            addEmployeeScope.loading = false;
                            addEmployeeScope.errors = _.values(JSON.parse(xhr.response).errfor);
                            addEmployeeScope.showErrors = true;
                            addEmployeeScope.$apply();

                            util.errorMessageTimeout({
                                success: function() {
                                    addEmployeeScope.errors = [];
                                    addEmployeeScope.showErrors = false;
                                    addEmployeeScope.$apply();
                                }
                            });
                        }
                    } else {
                        $('[name="addEmployeeButton"]').removeAttr('disabled');
                        addEmployeeScope.loading = false;
                        addEmployeeScope.errors = [lang.networkError];
                        addEmployeeScope.showErrors = true;
                        addEmployeeScope.$apply();

                        util.errorMessageTimeout({
                            success: function() {
                                addEmployeeScope.errors = [];
                                addEmployeeScope.showErrors = false;
                                addEmployeeScope.$apply();
                            }
                        });
                    }
                };

                xhr.onerror = function() {

                    $('[name="addEmployeeButton"]').removeAttr('disabled');
                    addEmployeeScope.loading = false;
                    addEmployeeScope.errors = [lang.networkError];
                    addEmployeeScope.showErrors = true;
                    addEmployeeScope.$apply();

                    util.errorMessageTimeout({
                        success: function() {
                            addEmployeeScope.errors = [];
                            addEmployeeScope.showErrors = false;
                            addEmployeeScope.$apply();
                        }
                    });

                };

                // Send the Data.
                return xhr.send(fd);
            }
        };
    }]);

module.exports = Service;
