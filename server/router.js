'use strict';
var lib = require('./lib'),
    multiparty = lib.multiparty({
        limit: 10 + 'mb',
        uploadDir: './temp'
    }),
    /*
     *policies
     */
    permissionPolicy = require('./api/policies/permissionPolicy'),
    userPolicy = require('./api/policies/userPolicy'),
    attendancePolicy = require('./api/policies/attendancePolicy'),
    holidayPolicy = require('./api/policies/holidayPolicy'),
    leavePolicy = require('./api/policies/leavePolicy'),
    canteenPolicy = require('./api/policies/canteenPolicy'),
    /*
     *controllers
     */
    roleController = require('./api/controllers/roleController'),
    designationController = require('./api/controllers/designationController'),
    companyController = require('./api/controllers/companyController'),
    userController = require('./api/controllers/userController'),
    leaveController = require('./api/controllers/leaveController'),
    appController = require('./api/controllers/appController'),
    attendanceController = require('./api/controllers/attendanceController'),
    holidayController = require('./api/controllers/holidayController'),
    canteenController = require('./api/controllers/canteenController'),
    canteenController = require('./api/controllers/canteenController'),
    /*
     *utils
     */
    userUtils = require('./api/utils/userUtil');

module.exports = function(app, passport) {

    //app.use(userPolicy.dummyLogin);
    app.use(userPolicy.authenticate); //check if the client has a proper session or not
    //app.use(userPolicy.populateUserDetails); //append details of the logged in user to req.sender
    app.use('/api/:path/:operation', permissionPolicy.verifyPermissions); //verify permissions for the operation

    //app  Routes  
    app.get('/api/app_details', appController.getDetails);

    //User Routes    
    app.post('/api/login', userPolicy.loginValidationCheck, userController.login);
    app.post('/api/logout', userController.logout);
    app.put('/api/reset_password', userController.resetPassword);
    app.get('/api/user/view', userController.view);
    app.get('/api/user/view_all', userController.viewAll);
    app.get('/api/user/view_one', userController.viewOne);
    app.post('/api/user/add', multiparty, userController.add);
    app.put('/api/user/update_own', multiparty, userController.updateOwn);
    app.put('/api/user/update_others', multiparty, userController.updateOthers);
    app.put('/api/user/block', userController.block);
    app.put('/api/user/change_password', userController.changePassword);
    app.put('/api/user/reset_others_password', userController.resetOthersPassword);
    app.get('/api/user/search', userController.searchEmployee);

    //Role Routes
    app.post('/api/role/add', roleController.add);
    app.get('/api/role/view', roleController.view);
    app.get('/api/role/view_all', roleController.viewAll);

    //Company Routes
    app.post('/api/company/add', companyController.add);
    app.get('/api/company/view', companyController.view);

    //designation Routes
    app.post('/api/designation/add', designationController.add);
    app.put('/api/designation/add', designationController.add);
    app.get('/api/designation/view', designationController.view);

    // Leave Routes
    app.post('/api/leave/apply', leavePolicy.validateLeaveApplication, leaveController.applyLeave);
    app.put('/api/leave/cancel', leavePolicy.validateCancelLeaveApplication, leaveController.cancelLeave);
    app.get('/api/leave/details', leaveController.viewDetails);
    app.get('/api/leave/specific_details', leavePolicy.validateViewSpecificDetails,
        leaveController.viewSpecificDetails);
    app.put('/api/leave/edit', leavePolicy.validateManuallyUpdateLeaveAccount,
        leaveController.manuallyUpdateLeaveAccount);
    app.get('/api/leave/view_all', leaveController.viewDetailsEveryone);
    app.put('/api/leave/manage', leavePolicy.validateManageLeaveApplication, leaveController.manageLeave);
    app.get('/api/leave/view_all_account', leaveController.viewAllLeaveAccount);

    //attendance Routes
    app.post('/api/attendance/upload_csv', multiparty, attendanceController.uploadCSV);
    app.post('/api/attendance/add', attendancePolicy.validateAttendanceData,
        attendanceController.giveAttendance);
    app.get('/api/attendance/view', attendancePolicy.validateViewAttendance,
        attendanceController.viewAttendance);
    app.get('/api/attendance/view_all', attendancePolicy.validateViewAttendance,
        attendanceController.viewAttendanceEveryone);
    app.put('/api/attendance/edit', attendancePolicy.validateAttendanceData,
        attendanceController.updateAttendance);
    app.get('/api/attendance/export_csv', attendanceController.exportCSV);


    //holiday Routes
    app.post('/api/holiday/add', holidayPolicy.validateHolidayData, holidayController.addHoliday);
    app.get('/api/holiday/view', holidayController.viewHoliday);
    app.put('/api/holiday/edit', holidayPolicy.validateHolidayData, holidayController.updateHoliday);
    app.put('/api/holiday/remove', holidayController.removeHoliday);


    //canteen Routes
    app.post('/api/canteen/set_item', canteenController.addToMenu);
    app.put('/api/canteen/delete_item', canteenController.deleteFromMenu);
    app.get('/api/canteen/menu_list', canteenController.availableItemList);
    app.get('/api/canteen/current_menu', canteenController.getMenu);
    app.put('/api/canteen/lock_item', canteenController.lockItem);

    app.put('/api/canteen/set_order', canteenPolicy.validateSetOrder,
        canteenController.orderItem);
    app.get('/api/canteen/view_order', canteenPolicy.validateViewHistory,
        canteenController.viewOrderHistory);
    app.get('/api/canteen/view_order_everyone', canteenPolicy.validateViewHistory,
        canteenController.viewOrderHistoryEveryone);
    app.put('/api/canteen/cancel_order', canteenPolicy.validateCancelOrder,
        canteenController.cancelOrder);

    app.post('/api/canteen/make_payment', canteenPolicy.validateMakePayment,
        canteenController.makePayment);
    app.put('/api/canteen/edit_payment', canteenPolicy.validateEditPayment,
        canteenController.editPayment);
    app.get('/api/canteen/view_payment', canteenPolicy.validateViewHistory,
        canteenController.viewTransactionHistory);
    app.get('/api/canteen/view_payment_everyone', canteenPolicy.validateViewHistory,
        canteenController.viewTransactionHistoryEveryone);
    app.get('/api/canteen/show_current_balance', canteenController.showCurrentBalance);
    app.get('/api/canteen/show_current_balance_everyone', canteenController.showCurrentBalanceEveryone);

    app.put('/api/canteen/deduct_balance', canteenController.deductBalance);

};
