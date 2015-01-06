'use strict';

define(['Util', 'md5', 'lang', 'underscore'], function(util, MD5, lang, _) {
    return ['$scope', '$http', '$location', '$modal',
        function($scope, $http, $location, $modal) {

            var clearSuccess = function() {
                $scope.success = '';
                $scope.errors = [];
                $scope.$apply();
            };

            $scope.allOptions = ['Month View', 'Date View'];
            $scope.allViewOptions = ['Own Attendance', 'Employee Attendance'];



            var init = function() {
                /**
                 * start of datePicker function
                 */

                $scope.clear = function() {
                    // $scope.dt = null;
                    // $scope.enddt = null;
                    $scope.startdt = null;
                };

                // Disable weekend selection
                $scope.startDisabled = function(date, mode) {
                    return (mode === 'day' && (date.getDay() === -1 || date.getDay() === 7));
                };

                $scope.endDisabled = function(date, mode) {
                    return (mode === 'day' && (date.getDay() === -1 || date.getDay() === 7));
                };

                $scope.toggleMin = function() {
                    $scope.minDate = $scope.minDate ? null : new Date();
                };
                // $scope.toggleMin();

                $scope.startOpen = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.startOpened = !$scope.startOpened;
                };

                $scope.endOpen = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.endOpened = !$scope.endOpened;
                };

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                $scope.initDate = new Date('2016-15-20');
                $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                $scope.format = $scope.formats[2];

                /**
                 * end of datePicker function //allEmployee
                 */

                $scope.$apply();
            };

            var getOwnAttendaceData = function(month, year, date) {

                $scope.loading = true;

                $scope.allEmployee = [];
                $scope.$apply();

                $http({
                    method: 'GET',
                    url: util.api.viewOwnAttendance,
                    params: {
                        senderId: util.loggedInUser._id,
                        date: date ? date.getTime() : null,
                        month: month,
                        year: year
                    }
                }).success(function(response) {
                    $scope.loading = false;
                    if (response.success) {
                        $scope.allEmployee = response.data;
                        $scope.$apply();
                    } else {
                        if (_.values(response.errfor).length) {
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
                });

            };

            var getAllAttendanceData = function(month, year, date) {
                // $scope.allEmployee = [];
                $scope.loading = true;

                $scope.allEmployee = [];
                $scope.$apply();

                $http({
                    method: 'GET',
                    url: util.api.viewAllAttendance,
                    params: {
                        senderId: util.loggedInUser._id,
                        date: date ? date.getTime() : null,
                        month: month,
                        year: year
                    }
                }).success(function(response) {
                    $scope.loading = false;
                    if (response.success) {
                        $scope.fullDay = response.data;
                        // $scope.$apply();
                        init();

                    } else {
                        $scope.fullDay = [];
                        if (_.values(response.errfor).length) {
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
                });

            };

            var baseYear = 2012,
                currentYear = new Date().getFullYear(),
                userRole = util.loggedInUser.companyProfile.role;

            $scope.allYears = [];

            for (var i = currentYear; i >= baseYear; i--) {
                $scope.allYears.push(i);
            }

            $scope.selectedYear = $scope.allYears[0];

            $scope.allMonths = util.monthList;
            $scope.selectedMonth = $scope.allMonths[new Date().getMonth()];

            $scope.hasPowerOnOthersAttedance = function() {
                return userRole.attendance.others.view;
            };

            $scope.hasPowerOfEditOthersAttedance = function() {
                return userRole.attendance.others.edit;
            };

            $scope.loadEditAttendanceView = function(attendanceObj) {
                console.log('attendanceObj: ', attendanceObj);
                if ($scope.hasPowerOfEditOthersAttedance()) {
                    util.editingAttendance = _.extend({}, attendanceObj);
                    $location.path('/attendance/edit');
                }
            };

            $scope.selectedOption = $scope.allOptions[0];

            if ($scope.hasPowerOnOthersAttedance()) {
                console.log('Employee View');
                $scope.selectedViewOption = $scope.allViewOptions[1];
            } else {
                console.log('Own View');
                $scope.selectedViewOption = $scope.allViewOptions[0];
            }


            if ($scope.hasPowerOnOthersAttedance()) {

                $scope.state = 'all';

                $scope.changeView = function(state) {
                    console.log(state);
                    $scope.state = state;
                    $scope.$apply();
                }

                $scope.$watch('selectedMonth', function() {
                    if ($scope.selectedOption === 'Month View') {
                        if ($scope.selectedViewOption === 'Own Attendance') {
                            getOwnAttendaceData($scope.allMonths.indexOf($scope.selectedMonth), $scope.selectedYear, null);
                        } else if ($scope.selectedViewOption === 'Employee Attendance') {
                            getAllAttendanceData($scope.allMonths.indexOf($scope.selectedMonth), $scope.selectedYear, null);
                        }
                    }
                });


                $scope.$watch('selectedYear', function() {
                    if ($scope.selectedOption === 'Month View') {
                        if ($scope.selectedViewOption === 'Own Attendance') {
                            getOwnAttendaceData($scope.allMonths.indexOf($scope.selectedMonth), $scope.selectedYear, null);
                        } else if ($scope.selectedViewOption === 'Employee Attendance') {
                            getAllAttendanceData($scope.allMonths.indexOf($scope.selectedMonth), $scope.selectedYear, null);
                        }
                    }
                });

                $scope.$watch('startdt', function(value) {
                    if ($scope.selectedOption === 'Date View') {
                        if ($scope.selectedViewOption === 'Own Attendance') {
                            getOwnAttendaceData(null, null, value);
                        } else if ($scope.selectedViewOption === 'Employee Attendance') {
                            getAllAttendanceData(null, null, value);
                        }
                    }
                });

                $scope.$watch('selectedOption', function(value) {
                    if (value === 'Date View') {
                        if ($scope.selectedViewOption === 'Own Attendance') {
                            getOwnAttendaceData(null, null, $scope.startdt);
                        } else if ($scope.selectedViewOption === 'Employee Attendance') {
                            getAllAttendanceData(null, null, $scope.startdt);
                        }
                    } else if (value === 'Month View') {
                        if ($scope.selectedViewOption === 'Own Attendance') {
                            getOwnAttendaceData($scope.allMonths.indexOf($scope.selectedMonth), $scope.selectedYear, null);
                        } else if ($scope.selectedViewOption === 'Employee Attendance') {
                            getAllAttendanceData($scope.allMonths.indexOf($scope.selectedMonth), $scope.selectedYear, null);
                        }
                    }
                });

                $scope.$watch('selectedViewOption', function(value) {
                    if (value === 'Own Attendance') {

                        if ($scope.selectedOption === 'Date View') {
                            getOwnAttendaceData(null, null, $scope.startdt);
                        } else if ($scope.selectedOption === 'Month View') {
                            getOwnAttendaceData($scope.allMonths.indexOf($scope.selectedMonth), $scope.selectedYear, null);
                        }

                    } else if (value === 'Employee Attendance') {

                        if ($scope.selectedOption === 'Date View') {
                            getAllAttendanceData(null, null, $scope.startdt);
                        } else if ($scope.selectedOption === 'Month View') {
                            getAllAttendanceData($scope.allMonths.indexOf($scope.selectedMonth), $scope.selectedYear, null);
                        }

                    }
                });

            } else {

                $scope.$watch('startdt', function(value) {
                    if ($scope.selectedOption === 'Date View') {
                        getOwnAttendaceData(null, null, value);
                    }
                });

                $scope.$watch('selectedMonth', function() {
                    if ($scope.selectedOption === 'Month View') {
                        getOwnAttendaceData($scope.allMonths.indexOf($scope.selectedMonth), $scope.selectedYear, null);
                    }
                });


                $scope.$watch('selectedYear', function() {
                    if ($scope.selectedOption === 'Month View') {
                        getOwnAttendaceData($scope.allMonths.indexOf($scope.selectedMonth), $scope.selectedYear, null);
                    }
                });

                $scope.$watch('selectedOption', function(value) {
                    if (value === 'Month View') {
                        getOwnAttendaceData($scope.allMonths.indexOf($scope.selectedMonth), $scope.selectedYear, null);
                    } else if ($scope.selectedOption === 'Date View') {
                        getOwnAttendaceData(null, null, $scope.startdt);
                    }
                });

            }

            $scope.today = function() {
                $scope.startdt = new Date();
            };
            $scope.today();

            init();

        }
    ];
});
