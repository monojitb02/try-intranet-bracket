'use strict';
var lib = require('../../lib'),
    Q = lib.q,
    leaveApplicationModel = require('../models/leaveApplication'),
    leaveModel = require('../models/leave'),
    companyModel = require('../models/company'),
    getYearDuration = function(monthOfYearBreaks) {
        var year = new Date().getFullYear(),
            month = monthOfYearBreaks,
            currentYearFirst = new Date(year, month, 1),
            nextYearFirst = new Date((year + 1), month);
        return {
            from: currentYearFirst,
            to: new Date(nextYearFirst.setDate(0))
        };
    },
    returnFieldName = function(leaveType) {
        var fieldName;
        switch (leaveType) {
            case 1:
                fieldName = 'takenCL';
                break;
            case 2:
                fieldName = 'takenEL';
                break;
            case 3:
                fieldName = 'takenLWP';
                break;
        }
        return fieldName;
    };

module.exports = {
    /**
     *  get manageable(means today is earlier than start date of application) application
     *  from database
     */
    getManageableApplication: function(userIds) {
        var deferred = Q.defer(),
            today = new Date();
        today.setHours(0, 0, 0, 0);
        leaveApplicationModel
            .find({
                applicant: {
                    $in: userIds
                },
                'durationOfLeave.from': {
                    $gte: today
                },
                statusCode: {
                    $in: [1, 2]
                }
            })
            .populate('applicant')
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });

        return deferred.promise;
    },
    /**
     *  get application history of a perticular user from database
     */
    getApplicationHistory: function(applicant) {
        var deferred = Q.defer();
        leaveApplicationModel
            .find({
                applicant: applicant
            })
            .populate('applicant')
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });

        return deferred.promise;
    },
    /**
     *  get pending application history of a perticular user from database
     */
    getPendingAndApprovedApplications: function(applicant) {
        var deferred = Q.defer(),
            today = new Date();
        leaveApplicationModel
            .find({
                $and: [{
                    applicant: applicant
                }, {
                    statusCode: {
                        $in: [1, 2]
                    }
                }, {
                    'durationOfLeave.to': {
                        $gte: today
                    }
                }]
            })
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    },
    /**
     *  get multiple approved applications history of a perticular user from database
     */
    getApprovedApplications: function(applicant, completedAttendanceDate) {
        var deferred = Q.defer(),
            today = new Date();
        leaveApplicationModel
            .find({
                $and: [{
                    applicant: applicant
                }, {
                    statusCode: 2
                }, {
                    typeOfLeave: {
                        $in: [1, 2]
                    }
                }, {
                    'durationOfLeave.to': {
                        $gte: completedAttendanceDate
                    }
                }]
            })
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    },
    /**
     *  get single approved application of a specific date of a perticular user from database
     */
    getApprovedApplication: function(applicant, date) {
        var deferred = Q.defer();
        leaveApplicationModel
            .findOne({
                $and: [{
                    applicant: applicant
                }, {
                    statusCode: 2
                }, {
                    'durationOfLeave.from': {
                        $lte: date
                    }
                }, {
                    'durationOfLeave.to': {
                        $gte: date
                    }
                }]
            })
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });

        return deferred.promise;
    },
    /**
     *  get leave account of a perticular user from database
     */
    getLeaveAccount: function(user) {
        var deferred = Q.defer(),
            today = new Date();
        leaveModel.findOne({
            user: user,
            'duration.from': {
                $lte: today
            },
            'duration.to': {
                $gte: today
            }
        }).exec(function(err, result) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    },
    getLastLeaveAccount: function(user) {
        var deferred = Q.defer(),
            today = new Date();
        leaveModel
            .findOne({
                user: user
            })
            .sort({
                '_id': -1
            })
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    },
    /**
     *  save a leave application into database
     */
    saveLeaveApplication: function(leaveObj) {
        var deferred = Q.defer();
        new leaveApplicationModel(leaveObj)
            .save(function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(data);
                }
            });
        return deferred.promise;
    },
    /**
     *  find a leave application with given leaveId, from database
     */
    findApplication: function(leaveId) {
        var deferred = Q.defer();
        leaveApplicationModel
            .findOne({
                _id: leaveId
            })
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    },
    /**
     *  remove taken leaves from leave collection
     */
    removeLeaves: function(dataObj) {
        var deferred = Q.defer(),
            today = new Date(),
            userId = dataObj.applicant,
            startDate = dataObj.startDate,
            updateData = {
                $pull: {}
            },
            fieldName = returnFieldName(dataObj.typeOfLeave);

        updateData.$pull[fieldName] = {
            $gte: startDate
        };
        leaveModel
            .findOneAndUpdate({
                $and: [{
                    user: userId
                }, {
                    'duration.from': {
                        $lte: today
                    }
                }, {
                    'duration.to': {
                        $gte: today
                    }
                }]
            }, updateData)
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
    },
    /**
     *  update leave account(means add CL/LWP) in leave collection
     */
    updateLeaveAccount: function(dataObj) {
        var deferred = Q.defer(),
            updateData = {
                $addToSet: {}
            },
            today = new Date(),
            fieldName = returnFieldName(dataObj.typeOfLeave);

        updateData.$addToSet[fieldName] = {
            $each: dataObj.dateArray
        };
        leaveModel
            .findOneAndUpdate({
                $and: [{
                    user: dataObj.applicant
                }, {
                    'duration.from': {
                        $lte: today
                    }
                }, {
                    'duration.to': {
                        $gte: today
                    }
                }]
            }, updateData)
            .populate('user')
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    },
    /**
     *  update leave application status(pending/approved to cancelled) in database
     */
    updateLeaveApplication: function(dataObj) {
        var deferred = Q.defer();
        leaveApplicationModel
            .findOneAndUpdate({
                _id: dataObj.leaveId
            }, {
                $set: {
                    statusCode: dataObj.status
                }
            })
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    },
    /**
     *  get leave account of all user from leave collection
     */
    getAllLeaveAccount: function(users, ownId) {
        var today = new Date(),
            deferred = Q.defer();
        leaveModel
            .find({
                $and: [{
                    user: {
                        $in: users
                    }
                }, {
                    user: {
                        $ne: ownId
                    }
                }, {
                    'duration.from': {
                        $lte: today
                    }
                }, {
                    'duration.to': {
                        $gte: today
                    }
                }]
            })
            .populate('user')
            .exec(function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (data.length > 0) {
                        deferred.resolve(data);
                    } else {
                        deferred.resolve();
                    }
                }
            });
        return deferred.promise;
    },
    /**
     *  insert a new entry in leave collection or update a entry
     */
    upsertLeaveDocument: function(userId, companyId, leaveConfig, carriedForwardEL) {
        //console.log(userId, companyId, leaveConfig, carriedForwardEL);
        var deferred = lib.q.defer(),
            leaveDoc = {
                company: companyId,
                user: userId
            },
            leaveId,
            shouldReject = false,
            saveLeave = function() {
                companyModel
                    .findById(companyId)
                    .exec(function(err, company) {
                        var monthOfYearBreaks = company.rules.monthOfYearBreaks;
                        if (leaveConfig === undefined &&
                            !lib._.keys(leaveConfig).length) {
                            leaveDoc.duration = getYearDuration(monthOfYearBreaks);
                            leaveDoc.maxCL = company.rules.leave.maxCL;
                            leaveDoc.maxEL = company.rules.leave.maxEL;
                        } else {
                            leaveDoc.duration = {
                                from: leaveConfig.startDate,
                                to: leaveConfig.endDate
                            };
                            leaveDoc.maxCL = leaveConfig.maxCL;
                            leaveDoc.maxEL = leaveConfig.maxEL;
                        }
                        if (!leaveId) {
                            new leaveModel(leaveDoc)
                                .save(function(err, data) {
                                    if (err) {
                                        deferred.reject(err);
                                    } else {
                                        deferred.resolve(data);
                                    }
                                });
                        } else {
                            delete leaveDoc.user;
                            delete leaveDoc.company;
                            leaveDoc = lib.flat(leaveDoc);
                            console.log(leaveDoc);
                            leaveModel
                                .findOneAndUpdate({
                                    _id: leaveId
                                }, {
                                    $set: leaveDoc
                                })
                                .exec(function(err, data) {
                                    if (err) {
                                        deferred.reject(err);
                                    } else {
                                        deferred.resolve(data);
                                    }
                                });
                        }
                    });
            };
        if (carriedForwardEL) {
            leaveDoc.carriedForwardEL = carriedForwardEL;
        }
        leaveModel
            .findOne({
                user: userId
            }, {
                _id: 1
            }, {
                sort: {
                    _id: -1
                }
            })
            .exec(function(err, leave) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (leave) {
                        leaveId = leave._id;
                    }
                    saveLeave();
                }
            });
        return deferred.promise;
    }
};
