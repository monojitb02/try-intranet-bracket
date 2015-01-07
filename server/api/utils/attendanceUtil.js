'use strict';
var lib = require('../../lib'),
    fs = require('fs'),
    utils = require('../utils'),
    Q = lib.q,
    userModel = require('../models/user'),
    attendanceModel = require('../models/attendance'),
    /*
     * Get attendance array from csv file
     */
    getAttendanceArray = function(data, index) {
        var i,
            csvObject,
            key,
            date,
            resultArray = [],
            dayWiseAttendance = [],
            isheader = function(data) {
                return (data.length !== 0 &&
                    lib._.difference(data, ['']).length === 0);
            };
        while (!isheader(data[index++]));
        if (data[(index)][1] === 'Attendance Date') {
            date = new Date(data[index++][4]).setHours(0, 0, 0, 0);
        }
        if (isheader(data[index++])) {
            index += 2;
            for (i = index; i < data.length; i++) {
                if (isheader(data[i])) {
                    break;
                } else {
                    csvObject = {};
                    for (var j = 0; j < data[(index - 1)].length; j++) {
                        key = data[(index - 1)][j].toString().trim();
                        csvObject[key] = data[i][j];
                    }
                    delete csvObject[''];
                    csvObject.date = date;
                    dayWiseAttendance.push(csvObject);
                }
            }
            if (i < data.length - 1) {
                resultArray = getAttendanceArray(data, i);

            }
            return resultArray.concat(dayWiseAttendance);

        }
    },
    upsertAttendanceCollection = function(attendanceObject) {
        var deferred = Q.defer();
        attendanceModel
            .findOneAndUpdate({
                user: attendanceObject.user,
                date: attendanceObject.date
            }, {
                $set: attendanceObject
            }, {
                upsert: true,
                multi: false
            })
            .exec(function(err, attendance) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(attendance);
                }
            });
        return deferred.promise;
    };

module.exports = {
    getAttendanceArray: function(filePath) {
        var deferred = Q.defer();
        fs.readFile(filePath, {
            encoding: 'utf-8'
        }, function(err, csvData) {
            if (err) {
                deferred.reject(lib.message.ERROR_IN_READING_FILE);
                return;
            }
            lib.csvParser(csvData, {
                delimiter: ','
            }, function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else if (data) {
                    deferred.resolve(getAttendanceArray(data, 5));
                } else {
                    deferred.reject(lib.message.NO_DATA_FOUND_IN_FILE);
                }
            });
        });
        return deferred.promise;
    },

    /*
     * inserts attendance to database
     */
    giveAttendance: function(sender, attendanceObject) {
        var deferred = Q.defer(),
            attendanceToSave = {},
            attendanceId = Number(attendanceObject['E. Code']);
        userModel
            .findOne({
                'companyProfile.attendanceId': attendanceId
            }, {
                _id: 1
            })
            .exec(function(err, user) {
                if (err) {
                    deferred.reject(err);
                    return;
                }
                if (!user) {
                    deferred.reject('No user found having the attendanceId: ' + attendanceId);
                    return;
                }
                attendanceToSave = {
                    company: sender.companyProfile.company,
                    user: user._id,
                    date: attendanceObject.date,
                    inTime: attendanceObject.InTime,
                    outTime: attendanceObject.OutTime,
                    workDuration: attendanceObject['Work Dur.'],
                    totalDuration: attendanceObject['Tot.  Dur.'],
                    overTime: attendanceObject.OT,
                    status: attendanceObject.Status,
                    modifiedBy: sender._id,
                    isManualEntry: false
                };
                upsertAttendanceCollection(attendanceToSave)
                    .then(function() {
                        deferred.resolve();
                    }, function(err) {
                        deferred.reject(err);
                    });
            });
        return deferred.promise;
    },

    /*
     * inserts attendance manually
     */
    saveAttendance: function(data) {
        var deffered = Q.defer();
        new attendanceModel(data)
            .save(function(err, data) {
                if (err) {
                    deffered.reject(err);
                } else {
                    deffered.resolve(data);
                }
            });
        return deffered.promise;
    },

    upsertAttendance: upsertAttendanceCollection,

    /*
     * finds attendance month wise
     */
    findAttendanceMonth: function(findCriteria) {
        var deferred = Q.defer();
        attendanceModel
            .find({
                $and: [{
                    user: findCriteria.senderId
                }, {
                    date: {
                        $gte: findCriteria.startDate
                    }
                }, {
                    date: {
                        $lte: findCriteria.endDate
                    }
                }]
            })
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });
        return deferred.promise;
    },


    /*
     * finds own attendance date wise
     */
    findAttendanceDay: function(findCriteria) {
        var deferred = Q.defer();
        attendanceModel
            .findOne({
                $and: [{
                    user: findCriteria.senderId
                }, {
                    date: findCriteria.date
                }]
            })
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });
        return deferred.promise;
    },

    /*
     * finds attendance date wise
     */
    findAttendanceEveryone: function(userIds, date) {
        var deferred = Q.defer();
        attendanceModel
            .find({
                $and: [{
                    user: {
                        $in: userIds
                    }
                }, {
                    date: date
                }]
            })
            .populate('user', 'personalProfile.photoUrl companyProfile.name companyProfile.attendanceId companyProfile.designation')
            .populate('company', 'name')
            .populate('modifiedBy', 'companyProfile.name')
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });
        return deferred.promise;
    }
};
