'use strict';

define(['Util', 'jquery', 'underscore', 'lang'], function(util, $, _, lang) {
  return ['$scope', '$http', '$location', 'UserService', '$element', 'employee',
    function($scope, $http, $location, UserService, $element, employee) {

      $scope.userDetails = employee.profile;
      $scope.userDetails.companyProfile.company = util.appDetails.company;
      $scope.profile = {};
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

      var userRole = util.loggedInUser.companyProfile.role;

      if (userRole.user.others.personalProfile.view) {
        $scope.profile.viewPersonalProfile = true;
      }
      if (userRole.user.others.companyProfile.view) {
        $scope.profile.viewCompanyProfile = true;
      }
      if (userRole.user.others.personalProfile.edit || userRole.user.others.companyProfile.edit) {
        $scope.profile.edit = true;
      }

      if (Object.keys($scope.profile).length === 0) {
        $location.path('/employees/list');
      }


      $scope.loadEditView = function() {
        var tempPath = $location.path().substring(1).split('/');
        tempPath[1] = 'edit';
        tempPath = tempPath.join('/');
        tempPath = '/' + tempPath;
        employee.mode = 'edit';
        $location.path(tempPath);
      };

      $scope.$apply();
    }
  ];
});
