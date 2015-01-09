'use strict';

var util = require('../../../util');
var interceptor = function($q, $injector) {
    return {
        request: function(config) {
            //console.log('request', config);
            return config;
        },

        requestError: function(rejection) {
            // do something on error
            /*if (canRecover(rejection)) {
                return responseOrNewPromise
            }*/
            return $q.reject(rejection);
        },

        response: function(result) {
            //console.log('response', result);
            /*result.data.splice(0, 10).forEach(function (repo) {
                console.log(repo.name);
            })*/
            return result;
        },

        responseError: function(rejection) {
            //console.log('Failed with', rejection.status);
            if (rejection.status === 401) {
                util.appDetails = null;
                util.loggedInUser = null;
                var $state = $injector.get('$state');
                $state.go('login');
            }
            return $q.reject(rejection);
        }
    }
};

module.exports = function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
        .state('app', {
            template: require('../templates/panel.html'),
            controller: 'panelCtrl'
        });

    $urlRouterProvider.otherwise(function($injector) {
        var $state = $injector.get('$state');
        $state.go('login');
    });
    $httpProvider.interceptors.push(interceptor);
};
