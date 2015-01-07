'use strict';

module.exports = function($scope, $http, $location, $modal) {
    $scope.allRequests = [];

    var clearSuccess = function() {
            $scope.success = '';
            $scope.errors = [];
            $scope.$apply();
        },
        init = function() {
            console.log('loggedInUser: ', util.loggedInUser._id);

            $scope.acceptApplication = function(id, index) {
                $http.put(util.api.approveOrRejectApplication, {
                    senderId: util.loggedInUser._id,
                    leaveId: id,
                    approved: 1,
                    // comment: "Dummy Text. Don't make this mandatory"
                }).success(function(response) {
                    if (response.success) {
                        // console.log('acceptApplication:', $scope.allRequests[index], response);
                        $scope.allRequests[index].statusCode = response.data.leaveApplication.statusCode;

                        // $scope.$apply();
                    } else {
                        if (_.values(response.errfor).length > 0) {
                            $scope.errors = _.values(response.errfor);
                        } else {
                            $scope.errors = [lang.networkError];
                            // $scope.errors.push(lang.networkError);
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

            $scope.rejectApplication = function(id, index) {
                $http.put(util.api.approveOrRejectApplication, {
                    senderId: util.loggedInUser._id,
                    leaveId: id,
                    approved: 0,
                    // comment: "Dummy Text. Don't make this mandatory"
                }).success(function(response) {
                    if (response.success) {
                        // console.log('rejectApplication:', $scope.allRequests[index], response);
                        $scope.allRequests[index].statusCode = response.data.leaveApplication.statusCode;
                        // $scope.$apply();
                    } else {
                        if (_.values(response.errfor).length > 0) {
                            $scope.errors = _.values(response.errfor);
                        } else {
                            $scope.errors = [];
                            $scope.errors.push(lang.networkError);
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

            $scope.loadApplicationView = function(request, index) {
                util.editingLeaveRequest = request;
                util.instances.modal = $modal.open({
                    templateUrl: 'app/modules/leave/views/leavedetail.html',
                    size: ''
                });
                util.instances.modal.result.then(function() {
                    $scope.allRequests[index] = angular.copy(util.editingLeaveRequest);
                }, function() {

                });
            };

            $scope.$apply();
        };

    $scope.manageOthersLeave = function() {
        return util.loggedInUser.companyProfile.role.leave.others.manage;
    }

    if ($scope.manageOthersLeave()) { //leaveRequestsForOthers
        $http.get(util.api.leaveRequestsForOthers + '?senderId=' + util.loggedInUser._id).success(function(response) {

            if (response.success) {
                $scope.allRequests = response.data.appliedLeave;
                init();
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
        }).error(function() {})
    } else {
        $http.get(util.api.leaveRequestsForOwn + '?senderId=' + util.loggedInUser._id).success(function(response) {
            console.log(response, $scope);
            if (response.success) {
                $scope.allRequests = response.data.appliedLeave;
                init();
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
        }).error(function() {})
    }

};
