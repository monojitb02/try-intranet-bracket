'use strict';

module.exports = angular.module('app.holiday', ['ui.router', 'ui.bootstrap'])
    .controller('holidayCtrl', require('./controllers/holidayCtrl'))
    .config(require('./router/router'));
