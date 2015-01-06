require.config({
  baseUrl: 'app',
  waitSeconds: 0,
  paths: {
    jquery: '../libs/jquery',
    underscore: '../libs/underscore',
    angular: '../libs/angular',
    angularRoute: '../libs/angular-route',
    ckeditor: '../libs/ckeditor',
    jqUploader: '../libs/jquery.uploadfile',
    validator: '../libs/jquery.validate.min',
    bootstrapUi: '../libs/ui-bootstrap-tpls-0.11.0',
    dateparser: '../libs/dateparser',
    timepicker: '../libs/angular.timepicker',
    utf8_encode: '../libs/utf8_encode',
    textAngularSanitize: '../libs/textAngular-sanitize.min',
    textAngular: '../libs/textAngular.min',
    md5: '../libs/md5',
    text: '../libs/text',
    Util: 'util/util',
    employeeModulePath: 'modules/employees/',
    userModulePath: 'modules/user/',
    attendanceModulePath: 'modules/attendance/',
    leaveModulePath: 'modules/leave/',
    lang: '../resources/lang/en',
  },
  shim: {
    angular: {
      exports: 'angular'
    },
    angularRoute: ['angular'],
    jquery: {
      exports: 'jquery'
    },
    ckeditor: {
      deps: ['jquery'],
      exports: 'ckeditor'
    },
    jqUploader: {
      deps: ['jquery'],
      exports: 'jqUploader'
    },
    validator: {
      deps: ['jquery'],
      exports: 'validator'
    },
    bootstrapUi: {
      deps: ['angular', 'jquery']
    },
    dateparser: {
      deps: ['angular'],
      exports: 'dateparser'
    },
    timepicker: {
      deps: ['bootstrapUi', 'dateparser']
    },
    underscore: {
      deps: ['jquery'],
      exports: '_'
    },
    md5: {
      deps: ['utf8_encode'],
      exports: 'md5'
    },
    textAngularSanitize: {
      deps: ['angular'],
      exports: 'textAngularSanitize'
    },
    textAngular: {
      deps: ['textAngularSanitize'],
      exports: 'textAngular'
    },
  },
  priority: [
    'angular'
  ]
});
window.name = "NG_DEFER_BOOTSTRAP!";
require(['angular', 'jquery', 'underscore', 'bootstrapUi', 'dateparser', 'timepicker', 'ckeditor', 'jqUploader', 'validator', 'app', 'router/routes', 'Util', 'lang', /*'textAngularSanitize',*/ 'textAngular'], function(angular, jquery, _, bootstrapUi, dateparser, timepicker, CkEditor, jqUploader, validator, App, routes, util, lang, /*textAngularSanitize,*/ textAngular) {
  angular.element().ready(function() {
    console.log('calling ajax for app details!');
    jquery.ajax({
      methode: 'GET',
      url: util.api.getDetails
    }).success(function(data) {
      util.appDetails = data.data;
      angular.resumeBootstrap([App['name']]);
    }).error(function() {
      console.log(arguments);
    });
    // angular.resumeBootstrap([App['name']]);
  });
});
