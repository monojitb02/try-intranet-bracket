'use strict';

var App = angular.module('app.panel', ['ui.router', 'ui.bootstrap'])
    .controller('panelCtrl', require('./controllers/panelCtrl'))
    .config(require('./router/router'));

module.exports = App;
