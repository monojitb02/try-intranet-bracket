'use strict';

module.exports = function($stateProvider) {
    $stateProvider
        .state('app.home', {
            url: '/home',
            views: {
                'pages': {
                    template: require('../templates/dashBoard.html'),
                    controller: 'dashBoardCtrl'
                }
            }
        });
};
