define([
  'angular',
  'bootstrapUi',
  "Util"
], function(angular, bootstrapUi, util) {
  'use strict';
  if (!util.modules.user) {
    var app = angular.module("UserModule", ['ui.bootstrap'])
      .controller('LoginController', ['$scope', '$injector', '$modal',
        function($scope, $injector, $modal) {
          require(['userModulePath/controllers/logincontroller'], function(logincontroller) {
            // injector method takes an array of modules as the first argument
            // if you want your controller to be able to use components from
            // any of your other modules, make sure you include it together with 'ng'
            // Furthermore we need to pass on the $scope as it's unique to this controller
            $injector.invoke(logincontroller, this, {
              '$scope': $scope,
              '$modal': $modal
            });
          });
        }
      ]).controller('HeaderController', ['$scope', '$injector',
        function($scope, $injector) {
          require(['userModulePath/controllers/headercontroller'], function(headercontroller) {
            $injector.invoke(headercontroller, this, {
              '$scope': $scope
            });
          });
        }
      ]).controller('ForgotpasswordController', ['$scope', '$injector',
        function($scope, $injector) {
          require(['userModulePath/controllers/forgotpasswordcontroller'], function(forgotpasswordcontroller) {
            $injector.invoke(forgotpasswordcontroller, this, {
              '$scope': $scope
            });
          });
        }
      ]).controller('ResetpasswordController', ['$scope', '$injector', '$routeParams',
        function($scope, $injector, $routeParams) {
          require(['userModulePath/controllers/resetpasswordcontroller'], function(resetpasswordcontroller) {
            $injector.invoke(resetpasswordcontroller, this, {
              '$scope': $scope,
              '$routeParams': $routeParams
            });
          });
        }
      ]).controller('ProfileController', ['$scope', '$injector', '$modal', 'ownProfile',
        function($scope, $injector, $modal, ownProfile) {
          require(['userModulePath/controllers/profilecontroller'], function(profilecontroller) {
            $injector.invoke(profilecontroller, this, {
              '$scope': $scope,
              '$modal': $modal,
              'ownProfile': ownProfile
            });
          });
        }
      ]).controller('ChangePasswordCtrl', ['$scope', '$injector', '$modal',
        function($scope, $injector, $modal) {
          require(['userModulePath/controllers/changepasswordcontroller'], function(changepasswordcontroller) {
            $injector.invoke(changepasswordcontroller, this, {
              '$scope': $scope,
              '$modal': $modal
            });
          });
        }
      ]).controller('SubscribeController', ['$scope', '$injector',
        function($scope, $injector) {
          require(['userModulePath/controllers/subscribecontroller'], function(subscribecontroller) {
            $injector.invoke(subscribecontroller, this, {
              '$scope': $scope
            });
          });
        }
      ]).controller('SignupController', ['$scope', '$injector',
        function($scope, $injector) {
          require(['userModulePath/controllers/signupcontroller'], function(signupcontroller) {
            $injector.invoke(signupcontroller, this, {
              '$scope': $scope
            });
          });
        }
      ]).controller('EditOwnProfileController', ['$scope', '$injector', '$modal', 'ownProfile',
        function($scope, $injector, $modal, ownProfile) {
          require(['userModulePath/controllers/editownprofilecontroller'], function(editownprofilecontroller) {
            $injector.invoke(editownprofilecontroller, this, {
              '$scope': $scope,
              '$modal': $modal,
              'ownProfile': ownProfile
            });
          });
        }
      ]).factory('ownProfile', function() {

        var fac = {};

        fac.user = {};

        return fac;

      });;
    util.modules.user = app;
  }
  return util.modules.user;

});
