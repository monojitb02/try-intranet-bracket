define([],
  function() {

    'use strict';

    // var baseUrl = 'http://localhost:8000/';
    var baseUrl = '';
    //    var baseUrl = 'http://192.168.2.6:8000/';

    return {
      getBaseUrl: function() {
        return baseUrl;
      },
      addAttender: baseUrl + 'api/attender/add-attender',
      getDetails: baseUrl + 'api/app_details?companyId=5428eff3ed96f7b31ed9ed59',
      addSpeaker: baseUrl + 'api/speaker/add-speaker',
      getFullSpeakerList: baseUrl + 'api/speakers',
      getAutoSearchSpeakerList: baseUrl + 'api/speaker-search',
      addAgenda: baseUrl + 'api/agenda/add-agenda',
      agendaList: baseUrl + 'api/agendas',
      getSingleSpeaker: baseUrl + 'api/speaker/',
      getSingleAgenda: baseUrl + 'api/agenda/',
      updateSingleAgenda: baseUrl + 'api/agenda/',
      allAttenders: baseUrl + 'api/user/view_all',
      getManagers: baseUrl + 'api/user/search',
      getUser: '../jsons/userProfile.json',
      getLeaveAccounts: baseUrl + 'api/leave/view_all_account',
      singleAttender: baseUrl + 'api/attender/',
      eventApi: baseUrl + 'api/event/',
      updateFloorPlan: baseUrl + 'api/upload/floor-plan/event/',
      updateOther: baseUrl + 'api/user/update_others',
      // login: '../jsons/login-response.json',
      login: baseUrl + 'api/login',
      addEmployee: baseUrl + 'api/user/add',
      updateMyProfile: baseUrl + 'api/user/update_own',
      forgotPassword: baseUrl + 'api/attender/forgot-password',
      resetPassword: baseUrl + 'api/attender/reset-password',
      changePassword: baseUrl + 'api/user/change_password',
      addSponsorCategory: baseUrl + 'api/sponser-category/add',
      getSingleSponsorCategory: baseUrl + 'api/sponser-category/',
      getAllSponsorCategories: baseUrl + 'api/sponser-categories',
      getAllSponsors: baseUrl + 'api/sponsers',
      addSponsor: baseUrl + 'api/sponser/add-sponser',
      getSingleSponsor: baseUrl + 'api/sponser/',
      applyForLeave: baseUrl + 'api/leave/apply',
      leaveRequestsForOwn: baseUrl + 'api/leave/details',
      leaveRequestsForOthers: baseUrl + 'api/leave/view_all',
      getSingleEmployee: baseUrl + 'api/user/view_one',
      getOwnProfile: baseUrl + 'api/user/view',
      designationAddEdit: baseUrl + 'api/designation/add',
      uploadAttendanceCSV: baseUrl + 'api/attendance/upload_csv',
      addHoliday: baseUrl + 'api/holiday/add',
      viewHolidays: baseUrl + 'api/holiday/view',
      editHoliday: baseUrl + 'api/holiday/edit',
      removeHoliday: baseUrl + 'api/holiday/remove',
      getSingleApplicationDetails: baseUrl + 'api/leave/specific_details',
      approveOrRejectApplication: baseUrl + 'api/leave/manage',
      viewAllAttendance: baseUrl + 'api/attendance/view_all',
      viewOwnAttendance: baseUrl + 'api/attendance/view',
      addAttendance: baseUrl + 'api/attendance/add',
      editAttendance: baseUrl + 'api/attendance/edit',
      editLeaveAccount: baseUrl + 'api/leave/edit',
      blockUser: baseUrl + 'api/user/block',
      logout: baseUrl + 'api/logout',
    };

  }
);
