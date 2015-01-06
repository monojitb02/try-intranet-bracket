'use strict';

define(['Util'], function(util) {
    return ['$scope', '$http','$location', function($scope, $http, $location) {
        $scope.doSubscribe = function(){
            $http({
                url: util.api.getDetails,
                method: "POST",
                data: {
                    'email' : $scope.email
                }
            })
            .then(function(response) {
                console.log("success",response)
            }, 
            function(response) {
                console.log("fail",response)
            });
            console.log("subscribe",util.api.getDetails);
        }
        $scope.showSignIn = function(){
            $location.path( "/signin" );
        }
        $scope.$apply();
    }];
});


