'use strict';

module.exports = function($stateProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            template: require('../templates/login.html'),
            controller: 'loginCtrl'
        });
};
