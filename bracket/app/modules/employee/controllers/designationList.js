'use strict';

/*
define(['Util', 'jquery', 'underscore', 'lang'], function(util, $, _, lang) {
            return ['$scope', '$http', '$location', '$element', '$modal',
                function($scope, $http, $location, ]
            })
*/

var util = require('../../../util');
var api = require('../../../util/api');
module.exports = function($scope, $http, $location, $modal) {

    $scope.addDesignation = (util.loggedInUser.companyProfile.role.trueName && util.loggedInUser.companyProfile.role.trueName === 'admin') ? true : false;

    $scope.designationList = util.appDetails.designations;

    $scope.loadAddDesignationView = function(eachDesignation) {
        if (eachDesignation) {
            util.editingDesignation = eachDesignation;
            util.instances.modal = $modal.open({
                templateUrl: 'app/modules/employees/views/adddesignation.html',
                size: '',
                /*resolve: {
                  designation: function() {
                    return eachDesignation;
                  }
                }*/
            });
            util.instances.modal.result.then(function() {
                $scope.designationList = util.appDetails.designations;
            }, function() {

            });
        } else {
            util.editingDesignation = {};
            util.instances.modal = $modal.open({
                templateUrl: 'app/modules/employees/views/adddesignation.html',
                size: ''
            });
            util.instances.modal.result.then(function() {
                $scope.designationList = util.appDetails.designations;
            }, function() {

            });
        }
    };

    $scope.$apply();
}
