'use strict';

var App = angular.module('app.login', ['ui.router', 'ui.bootstrap'])
    .controller('loginCtrl', require('./controllers/loginCtrl'))
    .config(require('./router/router'));

module.exports = App;
