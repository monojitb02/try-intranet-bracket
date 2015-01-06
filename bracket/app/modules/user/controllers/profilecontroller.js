'use strict';

define(['jquery', 'Util', 'lang', 'underscore'], function($, util, lang, _) {
  return ['$scope', '$http', '$location', '$modal',
    function($scope, $http, $location, $modal) {

      $http({
        method: 'GET',
        url: util.api.getOwnProfile,
        params: {
          senderId: util.loggedInUser._id
        }
      }).success(function(response) {
        if (response.success) {
          $scope.userDetails = _.extend({}, response.data);
          util.loggedInUser = _.extend({}, response.data);
          delete response.data;
          // ownProfile.user = _.extend({}, response.data);
        } else {
          if (_.values(response.errfor).length) {
            $scope.errors = _.values(response.errfor)
          } else {
            $scope.errors = [lang.networkError];
          }
          $scope.showErrors = true;
          util.errorMessageTimeout({
            success: function() {
              clearSuccess();
            }
          });
        }
      })



      var readImage = function(file) {
        var reader = new FileReader(),
          image = new Image(),
          fd = new FormData(),
          xhr = new XMLHttpRequest();
        reader.readAsDataURL(file);
        reader.onload = function(_file) {
          image.src = _file.target.result;
          image.onload = function() {

            fd.append('profilePicture', file, file.name);

            xhr.open('PUT', util.api.updateMyProfile + '?senderId=' + util.loggedInUser._id, true);

            xhr.onload = function(response) {
              if (xhr.status === 200) {
                if (JSON.parse(xhr.response).success) {
                  util.loggedInUser.personalProfile.photoUrl = JSON.parse(xhr.response).data.personalProfile.photoUrl;
                  $scope.userDetails.personalProfile.photoUrl = JSON.parse(xhr.response).data.personalProfile.photoUrl;

                  $scope.$apply();

                  console.log('changed:', $scope.userDetails.personalProfile.photoUrl)
                }
              } else {
                console.log('error data: ', xhr);
              }
            };

            // Send the Data.
            xhr.send(fd);

          };
          image.onerror = function() {
            window.alert('Invalid file type: ' + file.type);
          };
        };
      };
      var clearSuccess = function() {
        $scope.success = '';
        $scope.errors = [];
        $scope.$apply();
      };

      $scope.activateChangeEvent = function() {
        $('#choose').change(function(e) {
          if (this.disabled) {
            return window.alert('File upload not supported!');
          } else {
            if (this.files && this.files[0]) {
              $scope.profilePicture = e.target.files[0];
              readImage(this.files[0]);
            }
          }
        });
      };

      $scope.loadEditView = function() {

        console.log(util.loggedInUser.companyProfile.role);
        if (util.loggedInUser.companyProfile.role.user.own.companyProfile.edit) {
          $location.path('/employees/edit/' + util.loggedInUser._id);
        } else {

          util.editingOwnProfile = angular.copy($scope.userDetails.personalProfile);

          util.instances.modal = $modal.open({
            templateUrl: 'app/modules/user/views/editownprofile.html',
            size: ''
          });
          util.instances.modal.result.then(function() {
            console.log('after returning from edit modal: ', util.loggedInUser);
            $scope.userDetails = _.extend({}, util.loggedInUser);
          }, function() {

          });
        }
      };

      $scope.getCurrentLocation = function() {
        if ($scope.userDetails.personalProfile.currentAddress &&
          $scope.userDetails.personalProfile.currentAddress.city &&
          $scope.userDetails.personalProfile.currentAddress.country &&
          $scope.userDetails.personalProfile.currentAddress.state) {
          return $scope.userDetails.personalProfile.currentAddress;
        } else {
          return $scope.userDetails.personalProfile.permanentAddress;
        }
      };

      $scope.getProfilePictureUrl = function(url) {
        if (url) {
          return url;
        } else {
          return 'resources/images/user.png'
        }
      };
      $scope.$apply();
    }
  ];
});
