'use strict';
var lib = require('../../lib');
module.exports = {
    verifyPermissions: function(req, res, next) {
        var workflow = lib.workflow(req, res),
            path = req.params.path,
            operation = req.params.operation,
            permissions = req.user.companyProfile.role[path],
            isAdmin = req.user.companyProfile.role.trueName === 'admin',
            denyPermission = function() {
                workflow.outcome.errfor.message = lib.message.PERMISSION_DENIED;
                workflow.emit('response');
            };
        switch (path) {
            case 'user':
                switch (operation) {
                    case 'view':
                        if (permissions.own.personalProfile.view ||
                            permissions.own.companyProfile.view) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'view_all':
                    case 'view_one':
                        if (permissions.others.personalProfile.view ||
                            permissions.others.companyProfile.view) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'add':
                        if (permissions.others.add) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'edit_own':
                    case 'change_password':
                        if (permissions.own.personalProfile.edit ||
                            permissions.own.companyProfile.edit) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'edit_others':
                    case 'reset_others_password':
                        if (permissions.others.personalProfile.edit ||
                            permissions.others.companyProfile.edit) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'block':
                        if (permissions.others.block) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    default:
                        next();
                }
                break;
            case 'role':
                switch (operation) {
                    case 'view':
                        if (permissions.view) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'view_all':
                        if (permissions.viewAll) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'edit':
                        if (permissions.edit) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'add':
                        if (permissions.add) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    default:
                        next();
                }
                break;
            case 'designation':
                switch (operation) {
                    case 'add':
                        if (isAdmin) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    default:
                        next();
                }
                break;
            case 'leave':
                switch (operation) {
                    case 'apply':
                    case 'cancel':
                        if (permissions.own.cancelApplication) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'view_all':
                        if (permissions.others.view) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'manage':
                        if (permissions.others.manage) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'details':
                        if (permissions.own.viewApplication) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'specific_details':
                    case 'view_all_account':
                        if (permissions.others.view) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    default:
                        next();
                }
                break;
            case 'attendance':
                switch (operation) {
                    case 'view':
                        if (permissions.own.view) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'view_all':
                        if (permissions.others.view) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'update':
                        if (permissions.others.edit) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    case 'add':
                    case 'upload_csv':
                        if (permissions.others.add) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    default:
                        next();
                }
                break;
            case 'holiday':
                switch (operation) {
                    case 'add':
                        if (isAdmin) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    default:
                        next();
                }
                break;
            case 'canteen':
                switch (operation) {
                    case 'set_item':
                    case 'delete_item':
                    case 'lock_item':
                    case 'deduct_balance':
                    case 'make_payment':
                    case 'view_payment_everyone':
                    case 'show_current_balance_everyone':
                        if (permissions.manage) {
                            next();
                        } else {
                            denyPermission();
                        }
                        break;
                    default:
                        next();
                }
                break;
            default:
                next();
        }
    }
};
