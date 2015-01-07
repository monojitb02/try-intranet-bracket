'use strict';
var lib = require('../../lib'),
    schedule = lib.scheduler,
    leaveApplicationModel = require('../models/leaveApplication'),
    leaveModel = require('../models/leave'),
    userModel = require('../models/user'),
    companyModel = require('../models/company'),
    attendanceModel = require('../models/attendance'),
    leaveUtils=require('../utils/leaveUtil'),
    dailyApplicationRejectRule = new schedule.RecurrenceRule(),
    monthlyRule = new schedule.RecurrenceRule(),
    refreshUserLeaveAccounts = function(companyId) {
        var deferred = lib.q.defer();
        leaveModel
            .find({
                company: companId
            })
            .exec(function(err, users) {
                if (err) {
                    deferred.reject(err);
                } else {
                    users.forEach(function(user) {
                        var carriedForwardEL = (user.maxEl - user.takenEL.length);
                        leaveUtils.upsertLeaveDocument(user._id, companyId, undefined, carriedForwardEL)
                            .then(function() {}, function(err) {
                                console.log('Date: ', new Date(), '  companId: ', companyId, '-> ', err);
                            });
                    });
                    deferred.resolve();
                }
            });
        return deferred.promise;
    };

dailyApplicationRejectRule.hour = 0;
dailyApplicationRejectRule.minute = 0;
monthlyRule.hour = 0;
monthlyRule.minute = 0;
monthlyRule.dayOfMonth = 1;

/*
 * Rejects expired pending applications
 */
var autoRejectApplication = schedule.scheduleJob(dailyApplicationRejectRule, function() {
    var today = new Date();
    leaveApplicationModel
        .update({
            $and: [{
                'durationOfLeave.from': {
                    $gte: today
                }
            }, {
                statusCode: 1
            }]
        }, {
            $set: {
                statusCode: 3
            }
        })
        .exec(function(err, data) {
            if (err) {
                console.log(new Date(), ':', err);
            } else if (data !== 0) {
                console.log(data, ' pending leave applications rejected');
            } else {
                console.log('No pending leave applications to reject');
            }
        });
});

/*
 * Updates leave accounts of every user in the company if
 * year ending of that company has reached
 */
var autoCreateLeaveAccount = schedule.scheduleJob(monthlyRule, function() {
    var currentMonth = (new Date().getMonth() + 1);
    companyModel
        .find({
            'rules.monthOfYearBreaks': currentMonth
        }, {
            name: 1
        })
        .exec(function(err, companies) {
            if (err) {
                console.log('Date: ', new Date(), '-> ', err);
            } else {
                companies.forEach(function(company) {
                    refreshUserLeaveAccounts(company._id)
                        .then(function() {
                            console.log(new Date(), ':', 'leave accounts updated for :', company.name);
                        }, function(err) {
                            console.log('Date: ', new Date(), '  companId: ', compan._id, '-> ', err);
                        });
                });
            }
        });
});
