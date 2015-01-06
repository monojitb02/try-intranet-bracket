define(["jquery", 'underscore', 'util/api'],
  function($, _, api) {

    'use strict';

    var Util = {
      api: api,
      modules: {},
      successMessageTimeout: function(options) {
        setTimeout(function() {
          options.success(true);
        }, 2000);
      },
      errorMessageTimeout: function(options) {
        setTimeout(function() {
          options.success(true);
        }, 2000);
      },
      config: {
        limit: {
          attenderList: 5,
        }
      },
      statusCode: {
        1: "pending",
        2: "approved",
        3: "rejected",
        4: "cancelled"
      },
      coompanyId: '5428eff3ed96f7b31ed9ed59',
      monthList: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      instances: {},
      loggedInUser: {},
      appDetails: {},
      editingDesignation: {},
      editingHoliday: {},
      editingAttendance: {},
      editingLeaveRequest: {},
      editingLeaveAccount: {},
    }

    return Util;
  });
