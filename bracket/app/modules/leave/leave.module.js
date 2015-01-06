define([
    'angular',
    'bootstrapUi',
    "Util"
], function(angular, bootstrapUi, util) {
    'use strict';
    if (!util.modules.leave) {
        var app = angular.module("LeaveModule", ['ui.bootstrap'])
            .controller('LeaveAccount', ['$scope', '$injector', '$modal',
                function($scope, $injector, $modal) {
                    require(['leaveModulePath/controllers/leaveaccount'], function(leaveAccount) {
                        $injector.invoke(leaveAccount, this, {
                            '$scope': $scope,
                            '$modal': $modal
                        });
                    });
                }
            ]).controller('LeaveDetail', ['$scope', '$injector', '$modal',
                function($scope, $injector, $modal) {
                    require(['leaveModulePath/controllers/leavedetail'], function(leaveDetail) {
                        $injector.invoke(leaveDetail, this, {
                            '$scope': $scope,
                            '$modal': $modal
                        });
                    });
                }
            ]).controller('LeaveRequests', ['$scope', '$injector', '$modal',
                function($scope, $injector, $modal) {
                    require(['leaveModulePath/controllers/leaverequests'], function(leaveRequests) {
                        $injector.invoke(leaveRequests, this, {
                            '$scope': $scope,
                            '$modal': $modal
                        });
                    });
                }
            ]).controller('RequestLeave', ['$scope', '$injector', '$modal',
                function($scope, $injector, $modal) {
                    require(['leaveModulePath/controllers/request-leave'], function(requestLeave) {
                        $injector.invoke(requestLeave, this, {
                            '$scope': $scope,
                            '$modal': $modal
                        });
                    });
                }
            ]).controller('HolidayController', ['$scope', '$injector', '$modal',
                function($scope, $injector, $modal) {
                    require(['leaveModulePath/controllers/holiday-settings'], function(holidaySettings) {
                        $injector.invoke(holidaySettings, this, {
                            '$scope': $scope,
                            '$modal': $modal
                        });
                    });
                }
            ]).controller('HolidayListController', ['$scope', '$injector', '$modal',
                function($scope, $injector, $modal) {
                    require(['leaveModulePath/controllers/holidaylist'], function(holidayList) {
                        $injector.invoke(holidayList, this, {
                            '$scope': $scope,
                            '$modal': $modal
                        });
                    });
                }
            ]).controller('LeaveSettingsController', ['$scope', '$injector', '$modal',
                function($scope, $injector, $modal) {
                    require(['leaveModulePath/controllers/leave-settings'], function(leaveSettings) {
                        $injector.invoke(leaveSettings, this, {
                            '$scope': $scope,
                            '$modal': $modal
                        });
                    });
                }
            ]).controller('leaveAccountModal', ['$scope', '$injector',
                function($scope, $injector) {
                    require(['leaveModulePath/controllers/leaveaccountmodal'], function(leaveAccountModalController) {
                        $injector.invoke(leaveAccountModalController, this, {
                            '$scope': $scope,
                        });
                    });
                }
            ]);
        util.modules.leave = app;
    }
    return util.modules.leave;

});
