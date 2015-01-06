'use strict';

define(['Util', 'lang', 'md5'], function(util, lang, MD5) {
  return ['$scope', '$http', '$location',
    function($scope, $http, $location) {
      var clearSuccess = function() {
          $scope.success = '';
          $scope.$apply();
        }
        /**
         * Form Validator cofig start
         */
      $('#changePassword').validate({
        rules: {
          oldPassword: "required",
          newPassword: "required",
          retypePassword: {
            required: true,
            equalTo: $("[name='newPassword']")
          }
        },
        messages: {
          oldPassword: lang.validationMessages.password,
          newPassword: lang.validationMessages.newPassword,
          retypePassword: {
            required: lang.validationMessages.retypePasswordRequired,
            equalTo: lang.validationMessages.retypePasswordNotMatched
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

      $scope.changePassword = {};

      $scope.close = function() {
        util.instances.modal.close();
      }

      $scope.save = function() {
        if ($('#changePassword').valid()) {
          $scope.loading = true;
          $http.put(util.api.changePassword, {
            secure: true,
            senderId: util.loggedInUser._id,
            newPassword: md5($scope.changePassword.newPassword),
            oldPassword: md5($scope.changePassword.oldPassword)
          }).success(function(response) {
            $scope.loading = false;
            if (response.success) {
              if (response.message) {
                $scope.success = response.message;
                util.successMessageTimeout({
                  success: function() {
                    clearSuccess();
                    util.instances.modal.close();
                  }
                });
              }
            } else {
              $scope.loading = false;
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
          }).error(function() {})
        }
      }
      $scope.$apply();
    }
  ];
});
