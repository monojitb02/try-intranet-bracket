/**
 * attendanceController
 *
 */
'use strict';
var lib = require('../../lib'),
    utils = require('../utils'),
    fs = require('fs'),
    attendanceUtil = require('../utils/attendanceUtil'),
    message = lib.message,
    userUtil = require('../utils/userUtil'),
    leaveUtil = require('../utils/leaveUtil'),
    designationUtil = require('../utils/designationUtil'),
    attendanceModel = require('../models/attendance'),
    companyModel = require('../models/company'),
    compare = function(a, b) {
        if (a.user.companyProfile.attendanceId < b.user.companyProfile.attendanceId)
            return -1;
        if (a.user.companyProfile.attendanceId > b.user.companyProfile.attendanceId)
            return 1;
        return 0;
    },
    dateCompare = function(a, b) {
        if (a.date < b.date)
            return -1;
        if (a.date > b.date)
            return 1;
        return 0;
    },
    convertToCSV = function(objArray) { //converts array of attendance objects in a csv string
        var array = objArray,
            keys = lib._.keys(objArray[0]),
            str = 'Date,User,In Time,Out Time,Work Duration,Total Duration,' +
            'Overtime,Status,Modified By,Manual Entry,Shift';

        str += '\r\n';
        for (var i = 0; i < array.length; i++) {
            var line = '';
            array[i] = array[i];
            for (var index in array[i]) {
                if (line !== '') {
                    line += ',';
                }
                line += array[i][index];
            }

            str += line + '\r\n';
        }
        return str;
    };

module.exports = {
    /**
     *   Uploads attendacce csv file and deducts leave if a user is absent
     */
    uploadCSV: function(req, res) {
        var workflow = lib.workflow(req, res),
            attendances,
            attendanceDates = [],
            successCount = 0,
            errorArray = [],
            responsePending = true,
            deductLeave = function(absentUser) {
                var updateLeaveObject = {
                    applicant: absentUser.user,
                    dateArray: [absentUser.date]
                };
                leaveUtil.getApprovedApplication(absentUser.user, absentUser.date)
                    .then(function(application) {
                        if (application) {
                            updateLeaveObject.typeOfLeave = application.typeOfLeave;
                        } else {
                            updateLeaveObject.typeOfLeave = 3;
                        }
                        return leaveUtil.updateLeaveAccount(updateLeaveObject);
                    }, function(err) {
                        var deferred = lib.q.defer();
                        deferred.reject();
                        return deferred.promise;
                    })
                    .then(function() {}, function(err) {
                        console.log('Error on handling Absent users', err);
                    });
            },
            handleAbsents = function() { //Deducts leave if a user is absent
                var attendanceCompletedUpto;
                attendanceDates = attendanceDates.sort();
                attendanceDates.pop();
                attendanceCompletedUpto = attendanceDates[(attendanceDates.length - 1)];
                companyModel //update attendanceCompletedUpto field
                    .findOneAndUpdate({
                        _id: req.user.companyProfile.company
                    }, {
                        $set: {
                            attendanceCompletedUpto: attendanceCompletedUpto
                        }
                    })
                    .exec(function(err) {
                        if (err) {
                            console.log('Error on handling Absent users', err);
                        }
                    });
                for (var i = 0; i < attendanceDates.length; i++) {
                    attendanceDates[i] = new Date(attendanceDates[i]);
                }
                attendanceModel
                    .find({
                        date: {
                            $in: attendanceDates
                        },
                        status: 'Absent'
                    })
                    .exec(function(err, absentUsers) {
                        if (absentUsers) {
                            absentUsers.forEach(deductLeave); //Deducts leave of absent user
                        }
                    });
            },
            storeAttendance = function(attendanceObject) { //stores attendance for a single user and single date
                attendanceUtil.giveAttendance(req.user, attendanceObject)
                    .then(function() {
                        successCount++;
                        attendanceDates = lib._.union(attendanceDates, [attendanceObject.date]);
                    }, function(err) {
                        errorArray.push(err);
                    })
                    .done(function() {
                        if (successCount + errorArray.length === attendances.length) {
                            if (errorArray.length !== 0) {
                                workflow.outcome.message = lib.message.CSV_UPLOADED_PARTIALLY;
                                workflow.outcome.errorData = lib._.unique(errorArray);
                            } else {
                                workflow.outcome.message = lib.message.CSV_UPLOADED_SUCCESSFULLY;
                            }
                            if (responsePending) {
                                responsePending = false; //prevents other storeAttendance threads to send response
                                workflow.emit('response');
                                handleAbsents();
                            }
                        }
                    });
            };
        if (!req.files || !req.files.attendanceFile) {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        attendanceUtil.getAttendanceArray(req.files.attendanceFile.path)
            .then(function(attendanceArray) {
                    attendances = attendanceArray;
                    attendanceArray.forEach(storeAttendance); //initiate storeAttendance threads
                },
                function(err) {
                    utils.errorNotifier(err, workflow);
                })
            .done(function() {
                fs.unlink(req.files.attendanceFile.path); //Delete attendence temp file 
            });
    },


    /**
     *   Exports attendacce csv file
     */
    exportCSV: function(req, res) {
        var workflow = lib.workflow(req, res);
        attendanceModel.find({
                company: req.user.companyProfile.company
            }, '-_id -company')
            .sort('date')
            .populate('user', 'companyProfile.name')
            .populate('modifiedBy', 'companyProfile.name')
            .exec(function(err, attendanceArray) {
                var result = [];
                if (err) {
                    utils.errorNotifier(err, workflow);
                } else {
                    res.set({
                        'Content-Disposition': 'attachment; filename=\"attendance.csv\"'
                    });
                    attendanceArray.forEach(function(attendance) {
                        attendance = attendance.toObject();
                        attendance.date = new Date(attendance.date).toDateString();
                        if (attendance.user.companyProfile.name.middle) {
                            attendance.user = attendance.user.companyProfile.name.first +
                                ' ' + attendance.user.companyProfile.name.middle +
                                ' ' + attendance.user.companyProfile.name.last;
                        } else {
                            attendance.user = attendance.user.companyProfile.name.first +
                                ' ' + attendance.user.companyProfile.name.last;
                        }
                        if (attendance.modifiedBy.companyProfile.name.middle) {
                            attendance.modifiedBy = attendance.modifiedBy.companyProfile.name.first +
                                ' ' + attendance.modifiedBy.companyProfile.name.middle +
                                ' ' + attendance.modifiedBy.companyProfile.name.last;
                        } else {
                            attendance.modifiedBy = attendance.modifiedBy.companyProfile.name.first +
                                ' ' + attendance.modifiedBy.companyProfile.name.last;
                        }
                        result.push(attendance);
                    });
                    res.send(convertToCSV(result));
                }
            });
    },
    /**
     *   add an attendance for a user manually(by admin/manager)
     */
    giveAttendance: function(req, res) {
        var workflow = lib.workflow(req, res);
        attendanceUtil.saveAttendance(req.attendanceObj)
            .then(function() {
                workflow.outcome.message = message.ATTENDANCE_ADD_SUCCESSFUL;
                workflow.emit('response');
            }, function(err) {
                utils.errorNotifier(err, workflow);
            });
    },
    /**
     *   view attendance of a particular month
     */
    viewAttendance: function(req, res) {
        var workflow = lib.workflow(req, res);
        req.findCriteria.senderId = req.user._id;
        if (req.findCriteria.startDate) {
            attendanceUtil.findAttendanceMonth(req.findCriteria)
                .then(function(data) {
                    if (data.length > 0) {
                        workflow.outcome.data = data;
                    } else {
                        workflow.outcome.errfor.message = message.NO_ATTENDANCE_MONTH;
                    }
                    workflow.emit('response');
                }, function(err) {
                    utils.errorNotifier(err, workflow);
                });
        } else {
            attendanceUtil.findAttendanceDay(req.findCriteria)
                .then(function(data) {
                    if (data) {
                        workflow.outcome.data = [data];
                    } else {
                        workflow.outcome.errfor.message = message.NO_ATTENDANCE_DAY;
                    }
                    workflow.emit('response');
                }, function(err) {
                    utils.errorNotifier(err, workflow);
                });
        }
    },
    /**
     *   view attendance of everyone of a particular date
     */
    viewAttendanceEveryone: function(req, res) {
        var userId = req.user._id,
            workflow = lib.workflow(req, res),
            dateArray = [],
            resultArray = [],
            resultObj = {},
            getAllUsers = function(user) {
                if (user.companyProfile.role.trueName === 'admin') {
                    return userUtil.getAll(user.companyProfile.company);
                } else {
                    return userUtil.getSubordinates([userId]);
                }
            },
            makeResult = function(designations, allAttendance) {
                var result = [];
                designations = lib._.indexBy(designations, '_id');
                allAttendance.forEach(function(attendance) {
                    attendance = attendance.toObject();
                    for (var i in designations) {
                        if (attendance.user.companyProfile.designation.toString() === i) {
                            attendance.user.companyProfile.designation = designations[i];
                            attendance.user.companyProfile.company = attendance.company;
                            delete attendance.company;
                            result.push(attendance);
                            break;
                        }
                    }
                });
                result.sort(compare);
                return result;
            };
        if (req.findCriteria.startDate) {
            while (req.findCriteria.startDate <= req.findCriteria.endDate) {
                dateArray.push(new Date(req.findCriteria.startDate));
                req.findCriteria.startDate.setDate(req.findCriteria.startDate.getDate() + 1);
            }
            lib.q.all([
                    designationUtil.getAllDesignations(),
                    getAllUsers(req.user)
                ])
                .spread(function(designations, users) {
                    var successCount = 0,
                        errorCount = 0,
                        noDataCount = 0,
                        unlocked = true;
                    dateArray.forEach(function(date) {
                        attendanceUtil.findAttendanceEveryone(users, date)
                            .then(function(allAttendance) {
                                if (allAttendance.length > 0) {
                                    resultObj = {
                                        date: date,
                                        attendance: makeResult(designations, allAttendance)
                                    };
                                    resultArray.push(resultObj);
                                } else {
                                    noDataCount++;
                                }
                                successCount++;
                            }, function() {
                                errorCount++;
                            })
                            .done(function() {
                                if (noDataCount === dateArray.length) {
                                    if (unlocked) {
                                        workflow.outcome.errfor.message = message.NO_ATTENDANCE_MONTH;
                                        unlocked = false;
                                        workflow.emit('response');
                                    }
                                } else if (errorCount + successCount === dateArray.length) {
                                    if (unlocked) {
                                        unlocked = false;
                                        resultArray.sort(dateCompare);
                                        workflow.outcome.data = resultArray;
                                        workflow.emit('response');
                                    }
                                }
                            });
                    });

                }, function(err1, err2) {
                    if (err1) {
                        workflow.emit('exception', err1);
                    } else {
                        workflow.emit('exception', err2);
                    }
                });
        } else {
            getAllUsers(req.user)
                .then(function(userIds) {
                    lib.q.all([attendanceUtil.findAttendanceEveryone(userIds, req.findCriteria.date),
                            designationUtil.getAllDesignations()
                        ])
                        .spread(function(allAttendance, designations) {
                            if (allAttendance.length === 0) {
                                workflow.outcome.errfor.message = message.NO_ATTENDANCE_DAY;
                                workflow.emit('response');
                                return;
                            }
                            resultObj = {
                                date: req.findCriteria.date,
                                attendance: makeResult(designations, allAttendance)
                            };
                            resultArray.push(resultObj);
                            workflow.outcome.data = resultArray;
                            workflow.emit('response');
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
        }
    },
    /**
     *   update attendance of a particular user
     */
    updateAttendance: function(req, res) {
        var workflow = lib.workflow(req, res);
        attendanceUtil.upsertAttendance(req.attendanceObj)
            .then(function() {
                workflow.outcome.message = message.ATTENDANCE_UPDATION_SUCCESSFUL;
                workflow.emit('response');
            }, function(err) {
                workflow.emit('exception', err);
            });
    }
};
