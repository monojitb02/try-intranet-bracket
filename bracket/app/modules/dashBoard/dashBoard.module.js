'use strict';

var App = angular.module('app.dashBoard', ['ui.router', 'ui.bootstrap'])
    .controller('dashBoardCtrl', require('./controllers/dashBoardCtrl'))
    .config(require('./router/router'));

module.exports = App;
