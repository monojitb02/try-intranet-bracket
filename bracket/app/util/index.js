'use strict';

module.exports = {
    deleteCookie: function(name) {
        document.cookie = name + '=;expires=Thu, 01Jan 1970 00:00:01 GMT; ';
    },
    setCookie: function(cname, cvalue) {
        document.cookie = cname + '=' + cvalue + ';';
    },
    getCookie: function(cname) {
        var name = cname + '=',
            ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    },
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
    editingLeaveAccount: {}

};
