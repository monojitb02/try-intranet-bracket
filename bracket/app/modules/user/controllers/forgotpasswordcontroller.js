'use strict';

define(['Util', 'lang'], function(util, lang) {
  return ['$scope', '$http', '$location',
    function($scope, $http, $location) {
      var clearSuccess = function() {
        $scope.success = '';
        $scope.$apply();
      };
      $scope.showLogin = function() {
        $location.path("/signin");
      }
      $scope.forgotPasswordCredentials = {};
      /**
       * Form Validator cofig start
       */
      $('#forgotPassword').validate({
        rules: {
          email: {
            required: true,
            email: true
          }
        },
        messages: {
          email: {
            required: lang.validationMessages.email.required,
            email: lang.validationMessages.email.email,
          }
        },
        highlight: function(element) {
          $(element).closest('.form-control').removeClass('has-success').addClass('has-error');
        },
        success: function(element) {
          $(element).closest('.form-control').removeClass('has-error');
          $(element).closest('label').remove();
        }
      });
      /**
       * Form Validator cofig end
       */

      $scope.requestForForgotPassword = function() {
        if ($('#forgotPassword').valid()) {
          $http.post(util.api.forgotPassword, {
            email: $scope.forgotPasswordCredentials.email,
          }).success(function(response) {
            if (response.success) {
              $scope.forgotPasswordCredentials.email = '';
              if (response.message) {
                $scope.success = response.message;
                util.successMessageTimeout({
                  success: function() {
                    clearSuccess();
                  }
                });
              }
            } else {
              if (response.errors.length > 0) {
                $scope.errors = [lang.networkError];
                $scope.showErrors = true;
                util.errorMessageTimeout({
                  success: function() {
                    $scope.errors = [];
                    $scope.showErrors = false;
                    $scope.$apply();
                  }
                });
              } else {
                $scope.errors = _.values(response.errfor);
                $scope.showErrors = true;
                util.errorMessageTimeout({
                  success: function() {
                    $scope.errors = [];
                    $scope.showErrors = false;
                    $scope.$apply();
                  }
                });
              }
            }
          }).error(function() {
            $scope.errors = [lang.networkError];
            $scope.showErrors = true;
            util.errorMessageTimeout({
              success: function() {
                $scope.errors = [];
                $scope.showErrors = false;
                $scope.$apply();
              }
            });
          });
        }
      };

      $scope.$apply();
    }
  ];
});
