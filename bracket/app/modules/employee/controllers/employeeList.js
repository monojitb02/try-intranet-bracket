'use strict';

/*define(['Util', 'jquery', 'underscore'], function(util, $, _) {
    return ['$scope', '$http', '$location', 'UserService', 'employee',
    ];
});*/

var util = require('../../../util');
var api = require('../../../util/api');
module.exports = function($scope, $http, $location, UserService) {
    var userRole = util.loggedInUser.companyProfile.role;

    $scope.searchString = '';

    var setTableData = function(page) {

            if ($scope.filteredData && $scope.filteredData.length) {
                var attendiesList = angular.copy($scope.filteredData);
                $scope.attendiesList = attendiesList.splice((page - 1) * $scope.pagination.itemsPerPage, $scope.pagination.itemsPerPage);
            } else {
                $scope.attendiesList = [];
            }

        },

        createPagination = function() {

            $scope.pagination = {
                totalItems: $scope.filteredData.length,
                maxSize: 5,
                itemsPerPage: util.config.limit.attenderList,
            };
            $scope.currentPage = 1;

            $scope.watchPagination();

            // $scope.$apply();
        };

    $scope.watchPagination = function(page) {

        if (page) {
            setTableData(page);
        } else {
            setTableData(1);
        }
    };

    $scope.listView = function() {
        if (userRole.user) {
            if (userRole.user.others.companyProfile.view ||
                userRole.user.others.personalProfile.view) {
                $scope.viewUser = true;
                if (userRole.user.others.add) {
                    $scope.addUser = true;
                }
                if (userRole.user.others.block) {
                    $scope.blockUser = true;
                }
                if (userRole.user.others.companyProfile.edit ||
                    userRole.user.others.personalProfile.edit) {
                    $scope.editUser = true;
                }
                return true;
            } else {
                history.goBack(-1);
            }
        } else {
            history.goBack(-1);
        }
    };

    $scope.filterOptions = [{
        text: 'All',
        use: 'all'
    }, {
        text: 'Name',
        use: 'name'
    }, {
        text: 'Email',
        use: 'email'
    }, {
        text: 'Designation',
        use: 'designation'
    }];

    $scope.loadEmployeeView = function(id) {
        if (id) {
            employee.profile = _.find($scope.AllAttendies, function(eachEmp) {
                if (eachEmp._id === id) {
                    return eachEmp;
                }
            });
            employee.mode = 'view';
            $location.path('/employees/view/' + id);
        }
    };
    $scope.loadEmployeeEditView = function(id) {
        if (id) {
            employee.profile = _.find($scope.AllAttendies, function(eachEmp) {
                if (eachEmp._id === id) {
                    return eachEmp;
                }
            });
            employee.mode = 'edit';
            $location.path('/employees/edit/' + id);
        }
    };
    $scope.userBlock = function(id, index) {
        $http.put(util.api.blockUser, {
            senderId: util.loggedInUser._id,
            _id: id,
            blocked: true
        }).success(function(response) {
            if (response.success) {
                $scope.attendiesList[index].companyProfile.isActive = false;
            }
        })
    };

    $scope.userUnblock = function(id, index) {
        $http.put(util.api.blockUser, {
            senderId: util.loggedInUser._id,
            _id: id,
            blocked: false
        }).success(function(response) {
            if (response.success) {
                $scope.attendiesList[index].companyProfile.isActive = true;
            }
        })
    };

    $scope.addEmployee = function() {
        employee.profile = {
            companyProfile: {},
            personalProfile: {}
        };
        $location.path('/employees/add/');
    };

    $scope.selectedOption = $scope.filterOptions[0];

    $scope.chooseAnOption = function(index) {
        $scope.selectedOption = $scope.filterOptions[index];
        $('#filter_dropdown').removeClass('open');
        $('[name=dropdownButton]').attr('aria-expanded', 'false');
    };

    $scope.filterData = function(string) {
        var reg;
        if (string) {
            $scope.filteredData = [];
            reg = new RegExp(string, 'ig');
            if ($scope.selectedOption.use === 'all') {
                console.log('In All', reg);
                $scope.AllAttendies.forEach(function(eachAttender) {

                    if ((eachAttender.name &&
                            ((eachAttender.name.first && eachAttender.name.first.match(reg)) ||
                                (eachAttender.name.middle && eachAttender.name.middle.match(reg)) ||
                                (eachAttender.name.last && eachAttender.name.last.match(reg)))) ||
                        (eachAttender.companyProfile.email && eachAttender.companyProfile.email.match(reg)) ||
                        (eachAttender.companyProfile.designation && eachAttender.companyProfile.designation.post &&
                            eachAttender.companyProfile.designation.post.match(reg))) {
                        $scope.filteredData.push(eachAttender);
                        console.log('filter data: ', $scope.filteredData);
                    }
                });
            } else if ($scope.selectedOption.use === 'name') {
                console.log('In Name', reg);
                $scope.AllAttendies.forEach(function(eachAttender) {
                    if ((eachAttender.name &&
                            ((eachAttender.name.first && eachAttender.name.first.match(reg)) ||
                                (eachAttender.name.middle && eachAttender.name.middle.match(reg)) ||
                                (eachAttender.name.last && eachAttender.name.last.match(reg))))) {
                        $scope.filteredData.push(eachAttender);
                        console.log('filter data: ', $scope.filteredData);
                    }
                });
            } else if ($scope.selectedOption.use === 'email') {
                console.log('In Email', reg);
                $scope.AllAttendies.forEach(function(eachAttender) {
                    if (eachAttender.companyProfile.email && eachAttender.companyProfile.email.match(reg)) {
                        $scope.filteredData.push(eachAttender);
                        console.log('filter data: ', $scope.filteredData);
                    }
                });
            } else if ($scope.selectedOption.use === 'designation') {
                console.log('In Designation', reg);
                $scope.AllAttendies.forEach(function(eachAttender) {
                    if (eachAttender.companyProfile.email && eachAttender.companyProfile.email.match(reg)) {
                        $scope.filteredData.push(eachAttender);
                        console.log('filter data: ', $scope.filteredData);
                    }
                });
            }
        } else {
            console.log('in filter data else')
            $scope.filteredData = $scope.AllAttendies;
        }
        createPagination();
    };

    console.log(util.loggedInUser._id);
    $http({
        method: 'GET',
        url: api.allAttenders,
        params: {
            senderId: util.loggedInUser._id
        }
    }).success(function(response) {
        if (response.success) {
            $scope.AllAttendies = response.data;
            $scope.filteredData = response.data;
            createPagination();
        }
    }).error(function() {});

    // UserService.getAllUsers({
    //     senderId: util.loggedInUser._id
    // }).success(function(response) {
    //     if (response.success) {
    //         $scope.AllAttendies = response.data;
    //         $scope.filteredData = response.data;
    //         createPagination();
    //     }
    // }).error(function() {});

};
