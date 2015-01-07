'use strict';

module.exports = function($scope, $http, $location) {

    var clearSuccess = function() {
        $scope.success = '';
        $scope.errors = [];
        $scope.$apply();
    };
    //util.editingLeaveRequest

    // $scope.leaveDetails = ;

    $http({
        url: util.api.getSingleApplicationDetails,
        method: 'GET',
        params: {
            senderId: util.loggedInUser._id,
            leaveId: util.editingLeaveRequest._id
        }
    }).success(function(response) {
        if (response.success) {
            $scope.leaveDetails = angular.copy(util.editingLeaveRequest);
            $scope.leaveDetails.available = {
                CL: response.data.availableCL,
                EL: response.data.availableEL,
            };
            console.log('work on this: ', $scope.leaveDetails);
            $scope.$apply();
        } else {
            if (_.values(response.errfor).length > 0) {
                $scope.errors = _.values(response.errfor);
            } else {
                $scope.errors = [lang.networkError];
            }
            $scope.showErrors = true;
            util.successMessageTimeout({
                success: function() {
                    clearSuccess();
                }
            });
        }
    })

    $scope.close = function() {
        util.instances.modal.dismiss();
    };

    $scope.acceptApplicationFromModal = function() {
        $http.put(util.api.approveOrRejectApplication, {
            senderId: util.loggedInUser._id,
            leaveId: $scope.leaveDetails._id,
            approved: 1,
            comment: $scope.comment
        }).success(function(response) {
            if (response.success) {
                // console.log('acceptApplication:', $scope.allRequests[index], response);
                // $scope.leaveDetails = response.data.leaveApplication.statusCode;
                util.editingLeaveRequest.statusCode = response.data.leaveApplication.statusCode;
                // console.log(util.editingLeaveRequest, response.data.leaveApplication.statusCode;);
                util.instances.modal.close();
                $scope.$apply();
            } else {
                if (_.values(response.errfor).length > 0) {
                    $scope.errors = _.values(response.errfor);
                } else {
                    $scope.errors = [lang.networkError];
                }
                $scope.showErrors = true;
                util.successMessageTimeout({
                    success: function() {
                        clearSuccess();
                    }
                });
                $scope.$apply();
            }
        })
    };

    $scope.rejectApplicationFromModal = function(id, index) {
        $http.put(util.api.approveOrRejectApplication, {
            senderId: util.loggedInUser._id,
            leaveId: $scope.leaveDetails._id,
            approved: 0,
            comment: $scope.comment
        }).success(function(response) {
            if (response.success) {
                // console.log('rejectApplication:', $scope.allRequests[index], response);
                // $scope.leaveDetails = response.data.leaveApplication.statusCode;
                // console.log(util.editingLeaveRequest);
                util.editingLeaveRequest.statusCode = response.data.leaveApplication.statusCode;
                util.instances.modal.close();
                $scope.$apply();
            } else {
                if (_.values(response.errfor).length > 0) {
                    $scope.errors = _.values(response.errfor);
                } else {
                    $scope.errors = [lang.networkError];
                }
                $scope.showErrors = true;
                util.successMessageTimeout({
                    success: function() {
                        clearSuccess();
                    }
                });
                $scope.$apply();
            }
        })
    };


    $scope.$apply();
};
