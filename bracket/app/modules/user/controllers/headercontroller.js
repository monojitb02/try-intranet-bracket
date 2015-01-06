'use strict';

define(['Util', 'underscore'], function(util, _) {
  return ['$scope', '$http', '$location', '$modal',
    function($scope, $http, $location, $modal) {
      // You can access the scope of the controller from here

      if (util.loggedInUser && util.loggedInUser._id) {

        $scope.loggedInUser = _.extend({}, util.loggedInUser);

        if (!$scope.loggedInUser.personalProfile && !$scope.loggedInUser.personalProfile.photoUrl) {
          $scope.loggedInUser.personalProfile.photoUrl = '';
        };

        $scope.doSignOut = function() {
          $http.post(util.api.logout, {
            senderId: util.loggedInUser._id
          }).success(function(response) {
            if (response.success) {
              util.loggedInUser = {};
              $location.path("/signin");
            }
          });
        };

        $scope.checkRole = function() {
          if (util.loggedInUser.companyProfile && (util.loggedInUser.companyProfile.role.user.own.companyProfile.view ||
              util.loggedInUser.companyProfile.role.user.own.personalProfile.view)) {
            return true;
          } else {
            return false;
          }
        };

        $scope.getProfilePictureUrl = function(url) {
          if (url && url.length > 0) {
            url = util.api.getBaseUrl() + url.substring(0, url.lastIndexOf('.')) + '_s' + url.substring(url.lastIndexOf('.'));
            return url;
          } else {
            return './resources/images/user.png'
          }
        };

        $scope.showProfile = function() {
          $location.path("/profile");
        };

        $scope.showModal = function() {
          util.instances.modal = $modal.open({
            templateUrl: 'app/modules/user/views/changepassword.html',
            size: ''
          });
        };

        $scope.$apply();

      } else {
        $location.path("/signin");
      }
    }
  ];
});
