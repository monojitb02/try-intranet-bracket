'use strict';

define(['app'], function(app) {
    return app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/signin', {
                    templateUrl: 'app/modules/user/views/signin.html'
                })
                .when('/forgotpassword', {
                    templateUrl: 'app/modules/user/views/forgotpassword.html'
                })
                .when('/resetpassword/:token', {
                    templateUrl: 'app/modules/user/views/resetpassword.html'
                })
                .when('/profile', {
                    templateUrl: 'app/commons/views/layout.html'
                })
                .when('/employees/list', {
                    templateUrl: 'app/commons/views/layout.html'
                })
                .when('/employees/edit/:id', {
                    templateUrl: 'app/commons/views/layout.html'
                })
                .when('/employees/view/:id', {
                    templateUrl: 'app/commons/views/layout.html'
                })
                .when('/employees/add/', {
                    templateUrl: 'app/commons/views/layout.html'
                })
                .when('/dashboard', {
                    templateUrl: 'app/commons/views/layout.html'
                })
                .when('/settings/designation', {
                    templateUrl: 'app/commons/views/layout.html'
                })


            /** attendance route **/
            .when('/attendance/list', {
                    templateUrl: 'app/commons/views/layout.html'
                })
                .when('/attendance/edit', {
                    templateUrl: 'app/commons/views/layout.html'
                })
                .when('/attendance/add', {
                    templateUrl: 'app/commons/views/layout.html'
                })
                .when('/settings/attendance', {
                    templateUrl: 'app/commons/views/layout.html'
                }) /************************* attendance route ENDS ************/
                .when('/leave/list', { /** Leave route **/
                    templateUrl: 'app/commons/views/layout.html'
                })
                .when('/leave/apply', {
                    templateUrl: 'app/commons/views/layout.html'
                })
                .when('/leave/account', {
                    templateUrl: 'app/commons/views/layout.html'
                })
                .when('/settings/leave', {
                    templateUrl: 'app/commons/views/layout.html'
                })
                .when('/settings/holiday', {
                    templateUrl: 'app/commons/views/layout.html'
                })
                .when('/settings/holiday/:id', {
                    templateUrl: 'app/commons/views/layout.html'
                })
                /** Leave route ENDS **/


            .when('/holiday/list', {
                templateUrl: 'app/commons/views/layout.html'
            })

            .otherwise({
                redirectTo: '/signin'
            });
        }
    ]);
});
