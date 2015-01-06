'use strict';

var utility = require('../../../util');
var api = require('../../../util/api')

module.exports = function($scope, $rootScope, $state, $http, $timeout) {

    //checking login status
    var user = utility.getCookie('user');
    if (user) {
        $state.go('app.home');
    }
    var loginForm;

    //dummy login
    // $scope.email = 'admin.hikickindia@gmail.com';
    // $scope.password = '1234';

    //login user
    $scope.login = function() {
        if (loginForm.valid()) {
            $http({
                url: api.login,
                method: 'POST',
                data: {
                    email: $scope.email,
                    password: $scope.password,
                    secure: false
                }
            }).success(function(result) {
                if (result.success) {
                    delete result.data.password;
                    delete result.data.email;
                    utility.setCookie('user', JSON.stringify(result.data));
                    $state.go('app.home');
                } else {
                    $scope.message = result.errfor.message;
                    $scope.showMessage = true;
                    $scope.email = '';
                    $scope.password = '';
                    $timeout(function() {
                        $scope.showMessage = false;
                    }, 2000);
                }
            }).error(function() {
                $scope.message = lang.networkError;
                $scope.showMessage = true;
                $timeout(function() {
                    $scope.showMessage = false;
                }, 2000);
            });
        }
    };
    //close the alert of no result found
    $scope.closeAlert = function(index) {
        $scope.showMessage = false;
    };
    //validation of form
    $scope.$on('$viewContentLoaded', function() {
        $rootScope.currentPath = window.location.hash.replace(/\?.*$/, '');
        loginForm = jQuery("#login_form");
        loginForm.validate({
            rules: {
                email: {
                    required: true,
                    minlength: 4
                },
                password: {
                    required: true,
                    minlength: 4
                }
            }
        });
    });
};
