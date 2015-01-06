'use strict';

define([
  'Util',
  'underscore'
], function(util, _) {
  return ['$scope', '$http', '$modal',
    function($scope, $http, $modal) {
      var userRole = util.loggedInUser.companyProfile.role,
        allData = [],
        reg;

      $scope.hasPowerOnOthersLeave = function() {
        return userRole.leave.others.view;
      };

      $scope.loadLeaveAccountView = function(account, index) {
        util.editingLeaveAccount = account;
        util.accountIndex = index;
        util.instances.modal = $modal.open({
          templateUrl: 'app/modules/leave/views/leaveaccountmodal.html',
          size: ''
        });
        util.instances.modal.result.then(function() {
          console.log('here i am', index);
          $scope.filteredData[index] = util.editingLeaveAccount;
          console.log($scope.filteredData[index]);
          createPagination();
          // $scope.$apply();
        }, function() {

        });

        // $scope.Accounts[index].isEditing = !$scope.Accounts[index].isEditing;

      }

      $http.get(util.api.getLeaveAccounts + '?senderId=' + util.loggedInUser._id).success(function(attendance) {
        if (userRole.leave.others.view) {
          $scope.filteredData = [];

          attendance.data.forEach(function(eachData) {
            eachData.isEditing = false;
            allData.push(eachData);
          });
          $scope.filteredData = angular.copy(allData);
          createPagination();
        } else {
          $scope.filteredData = [];
          $scope.filteredData.push(attendance.data[0]);
          createPagination();
        }
      }).error(function() {});

      $scope.filterData = function() {
        if ($scope.searchString.trim().length) {
          $scope.filteredData = [];
          reg = new RegExp($scope.searchString.trim(), 'ig');

          allData.forEach(function(eachAttender) {
            if ((eachAttender.emp.name &&
                (eachAttender.emp.name.first && eachAttender.emp.name.first.match(reg)) ||
                (eachAttender.emp.name.middle && eachAttender.emp.name.middle.match(reg)) ||
                (eachAttender.emp.name.last && eachAttender.emp.name.last.match(reg)))) {
              $scope.filteredData.push(eachAttender);
            }
          });

          createPagination();

        } else {
          $scope.filteredData = angular.copy(allData);
          createPagination();
        }
      }

      var setTableData = function(page) {

          var Accounts = _.extend([], $scope.filteredData);
          $scope.Accounts = Accounts.splice((page - 1) * $scope.pagination.itemsPerPage, $scope.pagination.itemsPerPage);
        },

        createPagination = function() {

          $scope.pagination = {
            totalItems: $scope.filteredData.length,
            maxSize: 5,
            itemsPerPage: 5,
          };
          $scope.currentPage = 1;

          $scope.$watch('currentPage', function(value) {
            setTableData(value);
          });

          $scope.$apply();
        };
    }
  ];
});
