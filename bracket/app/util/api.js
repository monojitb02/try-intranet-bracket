'use strict';

// var baseUrl = 'http://localhost:8000/';
var baseUrl = 'api/';
//    var baseUrl = 'http://192.168.2.6:8000/';
module.exports = {
    getBaseUrl: function() {
        return '';
    },

    getDetails: baseUrl + 'app_details',

    //user route
    login: baseUrl + 'login',
    identifyUser: baseUrl + 'user/identify',
    allAttenders: baseUrl + 'user/view_all',
    getManagers: baseUrl + 'user/search',
    updateOther: baseUrl + 'user/update_others',
    updateMyProfile: baseUrl + 'user/update_own',
    changePassword: baseUrl + 'user/change_password',
    getSingleEmployee: baseUrl + 'user/view_one',
    getOwnProfile: baseUrl + 'user/view',
    addEmployee: baseUrl + 'user/add',
    blockUser: baseUrl + 'user/block',
    logout: baseUrl + 'logout',

    designationAddEdit: baseUrl + 'designation/add',

    //leave route
    getLeaveAccounts: baseUrl + 'leave/view_all_account',
    applyForLeave: baseUrl + 'leave/apply',
    leaveRequestsForOwn: baseUrl + 'leave/details',
    leaveRequestsForOthers: baseUrl + 'leave/view_all',
    editLeaveAccount: baseUrl + 'leave/edit',
    getSingleApplicationDetails: baseUrl + 'leave/specific_details',
    approveOrRejectApplication: baseUrl + 'leave/manage',

    //holiday route
    addHoliday: baseUrl + 'holiday/add',
    viewHolidays: baseUrl + 'holiday/view',
    editHoliday: baseUrl + 'holiday/edit',
    removeHoliday: baseUrl + 'holiday/remove',

    //attendance route
    viewAllAttendance: baseUrl + 'attendance/view_all',
    viewOwnAttendance: baseUrl + 'attendance/view',
    addAttendance: baseUrl + 'attendance/add',
    editAttendance: baseUrl + 'attendance/edit',
    uploadAttendanceCSV: baseUrl + 'attendance/upload_csv',
};
