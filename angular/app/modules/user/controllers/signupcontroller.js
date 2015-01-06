'use strict';

define([], function() {
    return ['$scope', '$http','$location', function($scope, $http, $location) {
        $scope.doSignUp = function(){
            console.log("signup");
        }
        $scope.getEmail = function(){
            var paths = [];
            paths = $location.$$path.substring(1,$location.$$path.length).split("/");
            $scope.email = paths[1];
            return $scope.email;
        }
        $scope.$apply();
    }];
});


