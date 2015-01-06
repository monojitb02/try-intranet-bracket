'use strict';

var App = angular.module('app.profile', ['ui.router', 'ui.bootstrap'])
    .controller('profileCtrl', require('./controllers/profileCtrl'))
    .config(require('./router/router'));

module.exports = App;
