'use strict';
var lib = require('../../lib'),
    message = lib.message,
    Q = lib.q,
    leaveUtil = require('../utils/leaveUtil'),
    userUtil = require('../utils/userUtil'),
    companyUtil = require('../utils/companyUtil'),
    compare = function(a, b) {
        if (a.emp.mcId < b.emp.mcId)
            return -1;
        if (a.emp.mcId > b.emp.mcId)
            return 1;
        return 0;
    };

module.exports = {
    /**
     *  apply for a leave
     */
    applyLeave: function(req, res) {
        var workflow = lib.workflow(req, res),
            currentYearApplication = function(duration, leaveAccount, aditionalLeave) {
                if (req.leaveObj.typeOfLeave === 1) {
                    var maxCL = leaveAccount.maxCL,
                        takenCL = leaveAccount.takenCL.length + aditionalLeave;
                    if (duration > (maxCL - takenCL)) {
                        workflow.outcome.errfor.message = lib.message.AVAILABLE_CL;
                        workflow.emit('response');
                        return false;
                    }
                } else if (req.leaveObj.typeOfLeave === 2) {
                    var totalEL = leaveAccount.maxEL + leaveAccount.carriedForwardEL,
                        takenEL = leaveAccount.takenEL.length + aditionalLeave;
                    if (duration > (totalEL - takenEL)) {
                        workflow.outcome.errfor.message = lib.message.AVAILABLE_EL;
                        workflow.emit('response');
                        return false;
                    }
                }
                return true;
            },
            nextYearApplication = function(duration, leaveAccount, aditionalLeave) {
                if (req.leaveObj.typeOfLeave === 1) {
                    if (duration > (leaveAccount.maxCL - aditionalLeave)) {
                        workflow.outcome.errfor.message = lib.message.AVAILABLE_CL;
                        workflow.emit('response');
                        return false;
                    }
                } else if (req.leaveObj.typeOfLeave === 2) {
                    if (duration > (leaveAccount.maxEL - aditionalLeave)) {
                        workflow.outcome.errfor.message = lib.message.AVAILABLE_EL;
                        workflow.emit('response');
                        return false;
                    }
                }
                return true;
            },
            save = function() {
                leaveUtil.saveLeaveApplication(req.leaveObj)
                    .then(function(application) {
                        workflow.outcome.message = message.LEAVE_APPLICATION_SUCCESSFULL;
                        workflow.outcome.data = application;
                        workflow.emit('response');
                    }, function(err) {
                        workflow.emit('exception', err);
                    });
            },
            findAditionalLeave = function(applications, sessionEnd, currentYear, attendanceDate) {
                var duration = 0,
                    aditionalLeave = 0,
                    startDate, endDate;
                applications.forEach(function(application) {
                    startDate = application.durationOfLeave.from;
                    endDate = application.durationOfLeave.to;

                    if (application.typeOfLeave === req.leaveObj.typeOfLeave && currentYear) {
                        if (startDate <= attendanceDate && endDate >= attendanceDate) {
                            if (endDate > sessionEnd) {
                                duration = (sessionEnd - attendanceDate) / 86400000;
                            } else {
                                duration = (endDate - attendanceDate) / 86400000;
                            }
                        } else {
                            if (endDate > sessionEnd) {
                                duration = ((sessionEnd - startDate) / 86400000) + 1;
                            } else {
                                duration = ((endDate - startDate) / 86400000) + 1;
                            }
                        }
                    } else if (application.typeOfLeave === req.leaveObj.typeOfLeave) {
                        if (sessionEnd > startDate) {
                            duration = ((endDate - sessionEnd) / 86400000);
                        } else {
                            duration = ((endDate - startDate) / 86400000) + 1;
                        }
                    }
                    aditionalLeave += duration;
                });
                return aditionalLeave;
            };
        companyUtil.knowCompletedAttendanceDate(req.user.companyProfile.company)
            .then(function(companyData) {
                var completedAttendanceDate = companyData.attendanceCompletedUpto,
                    aditionalLeave = 0;
                Q.all([
                        leaveUtil.getApprovedApplications(req.user._id, completedAttendanceDate),
                        leaveUtil.getLeaveAccount(req.user._id)
                    ])
                    .spread(function(applications, leaveAccount) {
                        if (!leaveAccount) {
                            workflow.outcome.errfor.message = message.NO_LEAVE_ACCOUNT;
                            workflow.emit('response');
                            return;
                        }
                        var currentSessionStart = leaveAccount.duration.from,
                            currentSessionEnd = leaveAccount.duration.to,
                            startDate = req.leaveObj.durationOfLeave.from,
                            endDate = req.leaveObj.durationOfLeave.to;
                        if (startDate >= currentSessionStart && endDate <= currentSessionEnd) {
                            //application for current year
                            aditionalLeave = findAditionalLeave(applications, currentSessionEnd, true, completedAttendanceDate);
                            if (currentYearApplication(req.leaveDuration, leaveAccount, aditionalLeave)) {
                                save();
                            }
                        } else if (startDate <= currentSessionEnd && endDate >= currentSessionEnd) {
                            //application spans two year
                            var currentYearSpan = ((currentSessionEnd - startDate) / 86400000) + 1,
                                nextYearSpan = ((endDate - currentSessionEnd) / 86400000) + 1;
                            aditionalLeave = findAditionalLeave(applications, currentSessionEnd, true, completedAttendanceDate);
                            if (currentYearApplication(currentYearSpan, leaveAccount, aditionalLeave)) {
                                aditionalLeave = findAditionalLeave(applications, currentSessionEnd, false);
                                if (nextYearApplication(nextYearSpan, companyData.rules.leave, aditionalLeave)) {
                                    save();
                                }
                            }
                        } else { //application for next year
                            aditionalLeave = findAditionalLeave(applications, currentSessionEnd, false);
                            if (nextYearApplication(req.leaveDuration, companyData.rules.leave, aditionalLeave)) {
                                save();
                            }
                        }
                    }, function(err1, err2) {
                        if (err1) {
                            workflow.emit('exception', err1);
                        } else {
                            workflow.emit('exception', err2);
                        }
                    });
            }, function(err) {
                workflow.emit('exception', err);
            });
    },

    /**
     *  cancel a leave
     */
    cancelLeave: function(req, res) {
        var workflow = lib.workflow(req, res),
            today = new Date();
        today.setHours(0, 0, 0, 0);
        switch (req.statusCode) {
            case 1: //pending application
                if (today > req.startDate) {
                    workflow.outcome.errfor.message = message.LEAVE_ALREADY_STARTED;
                    return workflow.emit('response');
                }
                leaveUtil.updateLeaveApplication(req.updateLeaveApplicationObj)
                    .then(function() {
                        workflow.outcome.message = message.SUCCESSFULLY_CANCELLED;
                        workflow.emit('response');
                    }, function(err) {
                        workflow.emit('exception', err);
                    });

                break;
            case 2: //approved application
                if (today >= req.startDate) {
                    workflow.outcome.errfor.message = message.LEAVE_ALREADY_STARTED;
                } else {
                    Q.all([
                        leaveUtil.updateLeaveApplication(req.updateLeaveApplicationObj),
                        leaveUtil.removeLeaves(req.removeLeaveObj)
                    ]).spread(function() {
                        workflow.outcome.message = message.SUCCESSFULLY_CANCELLED;
                        workflow.emit('response');
                    }, function(err1, err2) {
                        if (err1) {
                            workflow.emit('exception', err1);
                        } else {
                            workflow.emit('exception', err2);
                        }
                    });
                }
                break;
            case 3: //rejected application
                workflow.outcome.errfor.message = message.LEAVE_ALREADY_REJECTED;
                workflow.emit('response');
                break;
            case 4: //cancelled application
                workflow.outcome.errfor.message = message.LEAVE_ALREADY_CANCELLED;
                workflow.emit('response');
                break;
        }
    },
    /**
     *  approve/reject a leave application
     */

    manageLeave: function(req, res) {
        var workflow = lib.workflow(req, res),
            approved = Number(req.body.approved),
            updateApplication = function() {
                leaveUtil.updateLeaveApplication(req.updateLeaveApplicationObj)
                    .then(function(leaveApplication) {
                        workflow.outcome.message = message.SUCCESSFULLY_APPROVED;
                        workflow.outcome.data = {
                            leaveApplication: leaveApplication
                        };
                        workflow.emit('response');
                    }, function(err) {
                        workflow.emit('exception', err);
                    });
            };

        switch (req.statusCode) {
            case 1: //pending application
                updateApplication();
                break;
            case 2: //approved application
                if (approved === 1) {
                    workflow.outcome.errfor.message = message.LEAVE_ALREADY_APPROVED;
                    workflow.emit('response');
                } else {
                    leaveUtil.updateLeaveApplication(req.updateLeaveApplicationObj)
                        .then(function() {
                            workflow.outcome.message = message.SUCCESSFULLY_REJECTED;
                            workflow.emit('response');
                        }, function(err) {
                            workflow.emit('exception', err);
                        });
                }
                break;
            case 3: //rejected application
                workflow.outcome.errfor.message = message.LEAVE_ALREADY_REJECTED;
                workflow.emit('response');
                break;
            case 4: //cancelled application
                workflow.outcome.errfor.message = message.LEAVE_ALREADY_CANCELLED;
                workflow.emit('response');
                break;
        }
    },

    /**
     *  get leave history and leave account of a user(by user)
     */
    viewDetails: function(req, res) {
        var userId = req.user._id,
            workflow = lib.workflow(req, res);

        Q.all([
            leaveUtil.getApplicationHistory(userId),
            leaveUtil.getLeaveAccount(userId)
        ]).spread(function(appliedLeave, leaveAccount) {
            workflow.outcome.data = {
                appliedLeave: appliedLeave,
                leaveAccount: leaveAccount
            };
            workflow.emit('response');
        }, function(err1, err2) {
            if (err1) {
                workflow.emit('exception', err1);
            } else {
                workflow.emit('exception', err2);
            }
        });
    },
    /**
     *  get pending applications of all user(by admin)
     */
    viewDetailsEveryone: function(req, res) {
        var workflow = lib.workflow(req, res),

            getAllUsers = function(user) {
                if (user.companyProfile.role.trueName === 'admin') {
                    return userUtil.getAll(user.companyProfile.company);
                } else {
                    return userUtil.getSubordinates([user._id]);
                }
            };
        getAllUsers(req.user)
            .then(function(userIds) {
                return leaveUtil.getManageableApplication(userIds);
            }, function(err) {
                var deferred = Q.defer();
                deferred.reject(err);
                return deferred.promise;
            })
            .then(function(result) {
                workflow.outcome.data = {
                    appliedLeave: result
                };
                workflow.emit('response');
            }, function(err) {
                workflow.emit('exception', err);
            });
    },
    /**
     *  get leave account of a specific user(by admin)
     */
    viewSpecificDetails: function(req, res) {
        var workflow = lib.workflow(req, res);
        leaveUtil.getLeaveAccount(req.applicant)
            .then(function(leaveAccount) {
                if (leaveAccount) {
                    var totalEL = leaveAccount.maxEL + leaveAccount.carriedForwardEL;
                    workflow.outcome.data = {
                        availableCL: leaveAccount.maxCL - leaveAccount.takenCL.length,
                        availableEL: totalEL - leaveAccount.takenEL.length,
                        leaveAccount: leaveAccount
                    };
                } else {
                    workflow.outcome.errfor.message = message.NO_DATA;
                }
                workflow.emit('response');
            }, function(err) {
                workflow.emit('exception', err);
            });
    },
    /**
     *  update leave account of a specific user(by admin)
     */
    manuallyUpdateLeaveAccount: function(req, res) {
        var workflow = lib.workflow(req, res),
            dateArray = [];
        leaveUtil.getLeaveAccount(req.body.user)
            .then(function(leaveAccount) {
                if (leaveAccount) {
                    dateArray = leaveAccount.takenCL.concat(leaveAccount.takenEL);
                    dateArray = dateArray.concat(leaveAccount.takenLWP);
                    for (var index in dateArray) {
                        if (dateArray[index].getTime() === req.date.getTime()) {
                            workflow.outcome.errfor.message = message.LEAVE_DATE_EXIST;
                            workflow.emit('response');
                            return;
                        }
                    }
                    if (Number(req.body.leaveType) === 1 && leaveAccount.takenCL.length === leaveAccount.maxCL) {
                        workflow.outcome.errfor.message = lib.message.NO_AVAILABLE_CL;
                        workflow.emit('response');
                        return;
                    }
                    return leaveUtil.updateLeaveAccount(req.updateLeaveAccountObj);
                } else {
                    workflow.outcome.errfor.message = message.NO_DATA;
                }
            }, function(err) {
                var deferred = Q.defer();
                deferred.reject(err);
                return deferred.promise;
            })
            .then(function(result) {
                if (result) {
                    workflow.outcome.data = {
                        CL: result.maxCL - result.takenCL.length,
                        EL: (result.maxEL + result.carriedForwardEL) - result.takenEL.length,
                        LWP: result.takenLWP.length,
                        emp: {
                            _id: result.user._id,
                            name: result.user.companyProfile.name,
                            mcId: result.user.companyProfile.attendanceId,
                            profilePicture: result.user.companyProfile.photoUrl ? result.user.companyProfile.photoUrl : ''
                        }
                    };
                } else {
                    workflow.outcome.errfor.message = message.NO_DATA;
                }
                workflow.emit('response');
            }, function(err) {
                workflow.emit('exception', err);
            });

    },
    /**
     *  update leave account of a specific user(by admin)
     */
    viewAllLeaveAccount: function(req, res) {
        var workflow = lib.workflow(req, res),
            getAllUsers = function(user) {
                if (user.companyProfile.role.trueName === 'admin') {
                    return userUtil.getAll(user.companyProfile.company);
                } else {
                    return userUtil.getSubordinates([user._id]);
                }
            };
        getAllUsers(req.user)
            .then(function(users) {
                return leaveUtil.getAllLeaveAccount(users, req.user._id);
            }, function(err) {
                var deferred = Q.defer();
                deferred.reject(err);
                return deferred.promise;
            })
            .then(function(data) {
                if (data) {
                    var result = [];
                    data.forEach(function(index) {
                        var resultObj = {},
                            url = index.user.personalProfile.photoUrl;
                        resultObj.CL = index.maxCL - index.takenCL.length;
                        resultObj.EL = (index.maxEL + index.carriedForwardEL) - index.takenEL.length;
                        resultObj.LWP = index.takenLWP.length;
                        resultObj.emp = {};
                        resultObj.emp._id = index.user._id;
                        resultObj.emp.name = index.user.companyProfile.name;
                        resultObj.emp.mcId = index.user.companyProfile.attendanceId;
                        resultObj.emp.profilePicture = url ? url : '';
                        result.push(resultObj);
                    });
                    result.sort(compare);
                    workflow.outcome.data = result;
                } else {
                    workflow.outcome.errfor.message = message.NO_DATA;
                }
                workflow.emit('response');
            }, function(err) {
                workflow.emit('exception', err);
            });
    }
};
