'use strict';

var util = require('../../../util');
var api = require('../../../util/api');

/*module.exports = function($scope, $rootScope, $state, $http, $timeout) {

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
*/


//*******************************************************************************

module.exports = function($scope, $rootScope, $http, $state, $modal) {
    var loadHome = function() {
        $http({
            method: 'GET',
            url: api.getDetails,
            params: {
                companyId: util.loggedInUser.companyProfile.company._id
            }
        }).success(function(data) {
            util.appDetails = data.data;
            $scope.loading = false;
            $state.go('app.home');
        }).error(function() {
            // console.log(arguments);
        });
    };

    $rootScope.stopMainLoading = false;

    $scope.forgotPassword = function() {
        $location.path("/forgotpassword");
    };
    //checking login status
    if (!util.loggedInUser) {
        $http({
            url: api.identifyUser,
            method: 'GET'
        }).success(function(response) {
            if (response.success) {
                //console.log(response.data);
                util.loggedInUser = response.data;
                loadHome();
            } else {
                $rootScope.stopMainLoading = true;
            }
        }).error(function(error) {
            $rootScope.stopMainLoading = true;
        });
    } else {
        $state.go('app.home');
    }

    /**
     * Form Validator cofig start
     */
    $scope.$on('$viewContentLoaded', function() {
        $rootScope.currentPath = '#/login';
        jQuery('#signin').validate({
            rules: {
                password: "required",
                username: {
                    required: true,
                    email: true
                }
            },
            messages: {
                password: lang.validationMessages.password,
                username: {
                    required: lang.validationMessages.email.required,
                    email: lang.validationMessages.email.email,
                }
            },
            highlight: function(element) {
                jQuery(element).closest('.form-control').removeClass('has-success').addClass('has-error');
            },
            success: function(element) {
                jQuery(element).closest('.form-control').removeClass('has-error');
                jQuery(element).closest('label').remove();
            }
        });

    });


    $scope.loginCredentials = {
        username: 'sandip.saha@innofied.com',
        password: 'sandip'
    };
    $scope.errors = [];

    $scope.doSignIn = function() {
        $scope.loading = true;
        if (jQuery('#signin').valid()) {
            $http({
                url: api.login,
                method: 'POST',
                data: {
                    username: $scope.loginCredentials.username,
                    password: $scope.loginCredentials.password,
                    secure: false
                }
            }).success(function(response) {
                if (response.success) {
                    util.loggedInUser = response.data;
                    loadHome();
                } else {
                    if (response.errors && response.errors.length > 0) {
                        $scope.errors = [lang.networkError];
                    } else {
                        $scope.errors = _.values(response.errfor);
                    }
                    $scope.showErrors = true;
                    util.errorMessageTimeout({
                        success: function() {
                            $scope.errors = [];
                            $scope.showErrors = false;
                        }
                    });
                }
            }).error(function() {
                $scope.errors = [lang.networkError];
                $scope.showErrors = true;
                util.errorMessageTimeout({
                    success: function() {
                        console.log('here');
                        $scope.errors = [];
                        $scope.showErrors = false;
                    }
                });
            });
        }
    };

    /*$scope.showSubscribe = function() {
        $location.path("/subscribe");
    }*/
}
