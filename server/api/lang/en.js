'use strict';

module.exports = {
    VALIDATION_ERROR_IN: 'Validation error in',
    NOTHING_UPDATED: 'Nothing Updated',
    UPDATE_NON_EXISTING_DOCUMENT_FAILED: 'Cann\'t update a non-existing document',
    ID_REQUIRED: '\'_id\'is required',
    USERID_REQUIRED: '\'userId\'is required',
    USER_NOT_EXIST: 'User does not exist or blocked.',

    /*
     * leave messages
     */
    FIELD_REQUIRED: 'Please fill all required fields.',
    INVALID_DATE: 'Please give correct date.',
    INVALID_START_AND_END_DATE: 'End date of leave cannot be earlier than start date.',
    INVALID_START_DATE: 'Start date of leave cannot be earlier than today',
    NO_DATA: 'No data found',

    LEAVE_APPLICATION_SUCCESSFULL: 'Leave application is successful',
    PENDING_SAME_TYPE_LEAVE: 'You have pending application of same leave type',
    LEAVE_ALREADY_STARTED: 'Leave already started.',
    LEAVE_ALREADY_REJECTED: 'Application already rejected.',
    SUCCESSFULLY_REJECTED: 'Application rejected successfully.',
    LEAVE_ALREADY_CANCELLED: 'Application already cancelled.',
    LEAVE_ALREADY_APPROVED: 'Application already approved.',
    SUCCESSFULLY_APPROVED: 'Application approved successfully.',
    INVALID_LEAVE_TYPE: 'Invalid leave type, should between 1 and 3.',
    EL_LEAVE_RULE: 'To get EL you must have to apply 15 days before the leave starts.',
    CL_LEAVE_RULE: 'You can take atmost two consecutive CL',
    LEAVE_APPLY_RULE: 'You can only apply leave for current year or next year.',
    LEAVE_SAME_DATE: 'You cannot apply for same date.',
    AVAILABLE_CL: 'Available CL is less than you requested.',
    AVAILABLE_EL: 'Available EL is less than you requested.',
    INVALID_VALUE_APPROVED: 'Invalid value for approved, should either 1 or 0.',
    INVALID_LEAVE_TYPE_MANUAL_ENTRY: 'Invalid leave type, should 1 or 3.',
    LEAVE_DATE_EXIST: 'Date already exist as leave.',
    NO_AVAILABLE_CL: 'No available CL',
    SUCCESSFULLY_CANCELLED: 'Application cancelled successfully.',
    CANNT_SET_OWN_LEAVE_CONFIG: 'You cann\'t set own leave config',
    NO_LEAVE_ACCOUNT: 'You do not have any leave account for cuuent duration. Please contact with your admin',

    /*
     * holiday messages
     */
    HOLIDAY_ADD_SUCCESSFUL: 'Holiday successfully added.',
    HOLIDAY_ADD_RULE: 'You cannot add holiday of previous year.',
    HOLIDAY_UPDATION_SUCCESSFUL: 'Holiday successfully updated.',
    HOLIDAY_REMOVE_SUCCESSFUL: 'Holiday successfully removed.',

    /*
     * user messages
     */
    NOT_LOGGED_IN: 'You are not logged in',
    ALREADY_LOGGED_IN: 'You are already logged in loguot first',
    AUTHENTICATION_FAILED: 'Authentication failed',
    INCOMPLETE_ATTRIBUTE_SET: 'Send proper attributes',
    ABUSE_LOGIN: 'You\'ve reached the maximum number of login attempts. Please try again later.',
    LOGOUT_FAILED: 'Logout failed',
    PERMISSION_DENIED: 'You donn\'t have permission for this operation',
    PERMISSION_UPDATION_COMPANY_PROFILE: 'You don\'t have permission to update Company Profile',
    PERMISSION_UPDATION_PERSONAL_PROFILE: 'You don\'t have permission to update Personal Profile',
    CANNT_UPDATE_PASSWORD_THIS_WAY: 'Cann\'t update password this_way. Use \'change password\' for this operation',
    INCORRECT_EXISTING_PASSWORD: 'incorrect existing password',
    INCORRECT_EMAIL: 'This email does not exists',
    VALIDATION_ERROR: 'validation error',
    UNIQUE_KEY_CONSTRAINT_ERROR: 'Already exists.',
    ADD_ADMIN_NOT_PERMITED: 'You don\'t have permission to add an admin',
    PASSWORD_CHANGED_SUCCESSFULLY: 'Password changed successfully',
    IS_NOT_MANAGER: 'Choosen manager is not a manager',
    USER_BLOCKED: 'You are blocked',
    INVALID_TYPE_IN_BLOCKED: 'Invalid type in blocked',
    USER_SHOULD_HAVE_A_ROLE: 'User should have a role',
    USER_SHOULD_HAVE_A_MANAGER: 'User should have a manager',
    INVALID_ROLE: 'Invalid role',
    USER_SHOULD_HAVE_A_COMPANYPROFILE: 'User should have a company-profile',
    INVALID_CATAGORY_OF_ROLE: 'Invalid catagory of role',
    ROLE_NAME_ALREADY_EXISTS: 'Role name already exists',
    IMAGE_SIZE_LIMIT_EXCEEDED: 'Image size limit exceeded',
    DURATION_MUST_BE_ALTEAST_30_DAYS: 'Duration must be alteast 30 days',
    END_DATE_CANNT_BE_PAST_DATE: 'End date cann\'t be past date',

    /*
     *   attendance messages
     */
    NO_DATA_FOUND_IN_FILE: 'No data found in file',
    ERROR_IN_READING_FILE: 'Error in reading file ',
    INVALID_IN_TIME: 'Invalid inTime',
    INVALID_OUT_TIME: 'Invalid outTime',
    INVALID_IN_OR_OUT_TIME: 'InTime cannot be greater than outTime.',
    ATTENDANCE_ADD_SUCCESSFUL: 'Successfully attendance added.',
    ATTENDANCE_UPDATION_SUCCESSFUL: 'Attendance successfully updated.',
    INVALID_MONTH: 'Invalid month.',
    INVALID_YEAR: 'Invalid year.',
    CSV_UPLOADED_SUCCESSFULLY: 'CSV uploaded successfully',
    CSV_UPLOADED_PARTIALLY: 'CSV uploaded partially',
    NO_ATTENDANCE_MONTH: 'No attendance found for this month.',
    NO_ATTENDANCE_DAY: 'No attendance found for this day.',

    /*
     *   canteen messages
     */
    INVALID_ITEMS: 'Invalid format for items field.',
    ORDER_SUCCESSFUL: 'Successfully ordered.',
    ORDER_PARTIAL_SUCCESSFUL: 'Order partially successful.',
    ORDER_FAILED: 'Order failed.',
    MENU_SET_SUCCESSFUL: 'Menu set successfully.',
    SET_PENDING_EXPENDITURE_FIRST: 'Set pending expenditure first.',
    CANNT_DETELE_LOCKED_ITEM: 'Cann\'t detele locked item.',
    MENU_DELETED_SUCCESSFUL: 'Menu deleted successfully.',
    MENU_DELETE_FAILED: 'Menu delete failed.',
    ITEM_LOCK_SUCCESSFUL: 'Item locked successfully',
    ITEM_NOT_FOUND: 'Item not found.',
    NO_ORDER_FOR_THIS_ITEM: 'No order found for this item',
    ORDER_RULE: 'Your account balance is lower than minimum balance.',
    ORDER_CANCEL_SUCCESSFUL: 'Order cancelled successfully.',
    ORDER_SET_RULE: 'Your account balance is lower than minimum.',
    ORDER_SET_RULE2: 'Cannot order a locked item.',
    NO_ORDER_DAY: 'No order found for this day.',
    NO_ORDER_MONTH: 'No order found for this month.',
    ORDER_CANCEL_RULE: 'Cannot cancel order of a locked item.',
    PAYMENT_SUCCESSFUL: 'Payment successfully completed.',
    INVALID_AMOUNT: 'Given amount is not valid.',
    PAYMENT_EDIT_SUCCESSFUL: 'Successfully edited transaction.',
    NO_TRANSACTION: 'No transaction record found.',
    BALANCE_PARTIALLY_DEDUCTED: 'Balance partially deducted',
    NO_TRANSACTION_MONTH: 'No transaction found for this month',
    NO_TRANSACTION_DAY: 'No transaction found for this day'
};
