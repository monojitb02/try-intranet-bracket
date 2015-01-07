'use strict';
var lib = require('../../lib'),
    leaveUtil = require('../utils/leaveUtil'),
    message = lib.message;
module.exports = {
    /**
     *  validate leave application data during apply leave
     */
    validateLeaveApplication: function(req, res, next) {
        var startDate = req.body.startDate ? new Date(req.body.startDate) : req.body.startDate,
            endDate = req.body.endDate ? new Date(req.body.endDate) : req.body.endDate,
            leaveType = req.body.leaveType,
            reason = req.body.reason,
            workflow = lib.workflow(req, res),
            today = new Date(),
            leaveDuration, leaveObj;

        if (startDate === undefined || endDate === undefined ||
            leaveType === undefined || reason === undefined) {
            workflow.outcome.errfor.message = message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        if (startDate.toString() === 'Invalid Date' || endDate === 'Invalid Date') {
            workflow.outcome.errfor.message = message.INVALID_DATE;
            workflow.emit('response');
            return;
        }
        if (startDate > endDate) {
            workflow.outcome.errfor.message = message.INVALID_START_AND_END_DATE;
            workflow.emit('response');
            return;
        }
        today.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        if (startDate < today) {
            workflow.outcome.errfor.message = message.INVALID_START_DATE;
            workflow.emit('response');
            return;
        }
        if (endDate.getFullYear() > (today.getFullYear() + 1)) {
            workflow.outcome.errfor.message = message.LEAVE_APPLY_RULE;
            workflow.emit('response');
            return;
        }
        if (isNaN(leaveType) || leaveType < 1 || leaveType > 3) {
            workflow.outcome.errfor.message = message.INVALID_LEAVE_TYPE;
            workflow.emit('response');
            return;
        }
        leaveType = Number(leaveType);
        if (leaveType === 2 && ((startDate - today) / 86400000) < 15) {
            workflow.outcome.errfor.message = message.EL_LEAVE_RULE;
            workflow.emit('response');
            return;
        }
        if (leaveType === 1 && ((endDate - startDate) / 86400000) > 2) {
            workflow.outcome.errfor.message = message.CL_LEAVE_RULE;
            workflow.emit('response');
            return;
        }
        leaveUtil.getPendingAndApprovedApplications(req.user._id)
            .then(function(data) {
                for (var i in data) {
                    data[i] = data[i].toObject();
                    if (data[i].typeOfLeave === leaveType && data[i].statusCode === 1) {
                        workflow.outcome.errfor.message = message.PENDING_SAME_TYPE_LEAVE;
                        workflow.emit('response');
                        return;
                    }
                    if ((startDate >= data[i].durationOfLeave.from && startDate <= data[i].durationOfLeave.to) ||
                        (endDate >= data[i].durationOfLeave.from && endDate <= data[i].durationOfLeave.to)) {
                        workflow.outcome.errfor.message = message.LEAVE_SAME_DATE;
                        workflow.emit('response');
                        return;
                    }
                }
                leaveDuration = ((endDate - startDate) / 86400000) + 1;
                leaveObj = {
                    company: req.user.companyProfile.company,
                    applicant: req.user._id,
                    content: reason,
                    durationOfLeave: {
                        from: startDate,
                        to: endDate
                    },
                    typeOfLeave: leaveType
                };
                req.leaveObj = leaveObj;
                req.leaveDuration = leaveDuration;
                next();
            }, function(err) {
                workflow.emit('exception', err);
            });
    },
    /**
     *  validate data of application manage(approve/reject)
     */
    validateManageLeaveApplication: function(req, res, next) {
        var leaveId = req.body.leaveId,
            approved = req.body.approved,
            workflow = lib.workflow(req, res);

        if (leaveId === undefined || approved === undefined) {
            workflow.outcome.errfor.message = message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        if (isNaN(approved) || approved > 1 || approved < 0) {
            workflow.outcome.errfor.message = message.INVALID_VALUE_APPROVED;
            workflow.emit('response');
            return;
        }
        approved = Number(approved);
        leaveUtil.findApplication(leaveId)
            .then(function(result) {
                if (result) {
                    var status = 3;
                    if (approved === 1) {
                        status = 2;
                    }
                    req.updateLeaveApplicationObj = {
                        leaveId: leaveId,
                        status: status
                    };
                    req.statusCode = result.statusCode;
                    next();
                } else {
                    workflow.outcome.errfor.message = message.NO_DATA;
                    workflow.emit('response');
                    return;
                }
            }, function(err) {
                workflow.emit('exception', err);
                return;
            });
    },
    /**
     *  validate data of cancel leave application
     */
    validateCancelLeaveApplication: function(req, res, next) {
        var leaveId = req.body.leaveId,
            workflow = lib.workflow(req, res);

        if (!(leaveId)) {
            workflow.outcome.errfor.message = message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        leaveUtil.findApplication(leaveId)
            .then(function(result) {
                if (!result) {
                    workflow.outcome.errfor.message = message.NO_DATA;
                    workflow.emit('response');
                    return;
                }
                req.removeLeaveObj = {
                    applicant: result.applicant,
                    typeOfLeave: result.typeOfLeave,
                    startDate: result.durationOfLeave.from
                };
                req.updateLeaveApplicationObj = {
                    leaveId: leaveId,
                    status: 4
                };
                req.statusCode = result.statusCode;
                req.startDate = result.durationOfLeave.from;
                next();
            }, function(err) {
                workflow.emit('exception', err);
                return;
            });
    },
    /**
     *  validate data of specific leave application as well as user's leave account
     */
    validateViewSpecificDetails: function(req, res, next) {
        var leaveId = req.query.leaveId,
            workflow = lib.workflow(req, res);
        if (!leaveId) {
            workflow.outcome.errfor.message = message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        leaveUtil.findApplication(leaveId)
            .then(function(result) {
                if (result) {
                    req.applicant = result.applicant;
                    next();
                } else {
                    workflow.outcome.errfor.message = message.NO_DATA;
                    workflow.emit('response');
                }
            }, function(err) {
                workflow.emit('exception', err);
                return;
            });
    },
    /**
     *  validate data of manually update leave account
     */
    validateManuallyUpdateLeaveAccount: function(req, res, next) {
        var user = req.body.user,
            date = req.body.date ? new Date(req.body.date) : req.body.date,
            leaveType = req.body.leaveType,
            workflow = lib.workflow(req, res);
        if (user === undefined || date === undefined || leaveType === undefined) {
            workflow.outcome.errfor.message = message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        leaveType = Number(leaveType);
        if (isNaN(leaveType) || (leaveType !== 1 && leaveType !== 3)) {
            workflow.outcome.errfor.message = message.INVALID_LEAVE_TYPE_MANUAL_ENTRY;
            workflow.emit('response');
            return;
        }
        if (date.toString() === 'Invalid Date') {
            workflow.outcome.errfor.message = message.INVALID_DATE;
            workflow.emit('response');
            return;
        }
        date.setHours(0, 0, 0, 0);
        req.updateLeaveAccountObj = {
            applicant: user,
            typeOfLeave: leaveType,
            dateArray: [date]
        };
        req.date = date;
        next();
    }
};
