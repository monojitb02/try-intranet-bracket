'use strict';

define(['Util', 'jquery', 'underscore', 'lang'], function(util, $, _, lang) {
  return ['$scope', '$http', '$location', '$modal',
    function($scope, $http, $location, $modal) {

      $('#addDesignation').validate({
        rules: {
          post: "required",
        },
        messages: {
          post: lang.validationMessages.postName,
        },
        highlight: function(element) {
          $(element).closest('.form-control').removeClass('has-success').addClass('has-error');
        },
        success: function(element) {
          $(element).closest('.form-control').removeClass('has-error');
          $(element).closest('label').remove();
        }
      });

      if (_.isEmpty(util.editingDesignation)) {
        $scope.actionOnDesignation = 'Add';
        $scope.designationObj = {
          post: ''
        };
      } else {
        $scope.actionOnDesignation = 'Edit';
        $scope.designationObj = _.extend({}, util.editingDesignation);
      }

      $scope.close = function() {
        util.instances.modal.dismiss('cancel');
      }

      $scope.save = function() {
        if ($('#addDesignation').valid()) {
          $scope.loading = true;
          if ($scope.designationObj._id) {
            $http.put(util.api.designationAddEdit, {
              senderId: util.loggedInUser._id,
              _id: $scope.designationObj._id,
              post: $scope.designationObj.post
            }).success(function(response) {
              console.log(response, $scope);
              if (response.success) {
                $scope.loading = false;
                util.appDetails.designations = response.data
                  // $location.path('/settings/designation');
                util.instances.modal.close();
                // $scope.$apply();
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

          } else {

            $http.post(util.api.designationAddEdit, {
              post: $scope.designationObj.post,
              senderId: util.loggedInUser._id
            }).success(function(response) {
              console.log(response, $scope);
              if (response.success) {
                $scope.loading = false;
                util.appDetails.designations = response.data
                  // $location.path('/settings/designation');
                util.instances.modal.close();
                // $scope.$apply();
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
      };
      $scope.$apply();
    }
  ]
})
