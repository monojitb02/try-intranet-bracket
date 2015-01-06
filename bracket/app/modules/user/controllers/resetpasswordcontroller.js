'use strict';

define(['Util', 'lang', 'md5'], function(util, lang, MD5) {
  return ['$scope', '$http', '$location', '$routeParams',
    function($scope, $http, $location, $routeParams) {
      $scope.showForgotPassward = function() {
        $location.path("/forgotpassword");
      }
      $scope.chagePassword = {};
      $scope.errors = [];

      /**
       * Form Validator cofig start
       */
      $('#resetPassword').validate({
        rules: {
          newPassword: "required",
          confirmPassword: {
            required: true,
            equalTo: "[name=newPassword]"
          },
        },
        messages: {
          newPassword: lang.validationMessages.password,
          confirmPassword: {
            required: lang.validationMessages.confirmPasswordRequired,
            equalTo: lang.validationMessages.confirmPassword,
          },
        },
        highlight: function(element) {
          $(element).closest('.form-control').removeClass('has-success').addClass('has-error');
        },
        success: function(element) {
          $(element).closest('.form-control').removeClass('has-error');
          $(element).closest('label').remove();
        }
      });

      console.log($routeParams);

      $scope.resetPassword = function() {
        if ($('#resetPassword').valid()) {
          $http.post(util.api.resetPassword, {
            secure: true,
            token: $routeParams.token,
            userId: $routeParams.userId,
            password: md5($scope.chagePassword.newPassword)
          }).success(function(response) {
            if (response.success) {
              $location.search('userId', null);
              $location.path("/signin");
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
          }).error(function() {});
        }
      };

      $scope.$apply();
    }
  ];
});
