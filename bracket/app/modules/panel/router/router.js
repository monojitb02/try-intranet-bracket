'use strict';


module.exports = function($stateProvider, $urlRouterProvider, $http, $rootScope, $q, $state) {
    $stateProvider
        .state('app', {
            template: require('../templates/panel.html'),
            controller: 'panelCtrl',
            resolve: {
                app: function() {
                    var defer = $q.defer(),
                        getAppDetail = function() {
                            var defer = $q.defer();
                            $http({
                                method: 'GET',
                                url: api.getDetails,
                                params: {
                                    companyId: util.loggedInUser.companyProfile.company._id
                                }
                            }).success(function(data) {
                                util.appDetails = data.data;
                                //$scope.loading = false;
                                defer.resolve();
                            }).error(function() {
                                defer.reject();
                                // console.log(arguments);
                            });
                            return defer.promise;
                        },
                        identifyUser = function() {
                            var defer = $q.defer();
                            $http({
                                url: api.identifyUser,
                                method: 'GET'
                            }).success(function(response) {
                                if (response.success) {
                                    //console.log(response.data);
                                    util.loggedInUser = response.data;
                                    defer.resolve();
                                    //loadHome();
                                } else {
                                    defer.reject();
                                }

                            }).error(function(error) {
                                defer.reject();
                            });
                            return defer.promise;
                        };


                    //checking login status
                    if (!util.loggedInUser) {
                        $q.all([
                            getAppDetail(),
                            identifyUser()
                        ]).then(function() {
                                $rootScope.stopMainLoading = true;
                                defer.resolve();
                            },
                            function() {
                                $state.go('login');
                                defer.reject();
                            })
                    }
                    return defer.promise;
                }
            }
        });

    $urlRouterProvider.otherwise(function($injector) {
        var $state = $injector.get('$state');
        $state.go('login');
    });
};
