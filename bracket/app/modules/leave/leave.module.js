'use strict';

module.exports = angular.module('app.leave', ['ui.router', 'ui.bootstrap'])
    .controller('leaveAccountCtrl', require('./controllers/leaveAccountCtrl'))
    .controller('leaveAccountModalCtrl', require('./controllers/leaveAccountModalCtrl'))
    .controller('leaveDetailCtrl', require('./controllers/leaveDetailCtrl'))
    .controller('leaveRequestsCtrl', require('./controllers/leaveRequestsCtrl'))
    .controller('requestLeaveCtrl', require('./controllers/requestLeaveCtrl'))
    .config(require('./router/router'));
