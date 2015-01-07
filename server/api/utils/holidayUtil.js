'use strict';
var Q = require('../../lib').q,
    holydayModel = require('../models/holiday');

module.exports = {
    saveHoliday: function(data) {
        var deferred = Q.defer();
        new holydayModel(data)
            .save(function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve();
                }
            });
        return deferred.promise;
    },

    findHoliday: function(company, year) {
        var deferred = Q.defer(),
            firstDate, lastDate;
        if (!year) {
            year = new Date().getFullYear();
        }
        firstDate = new Date(year, 0, 1);
        lastDate = new Date(year, 11, 31);
        holydayModel
            .find({
                $and: [{
                    company: company
                }, {
                    date: {
                        $gte: firstDate
                    }
                }, {
                    date: {
                        $lte: lastDate
                    }

                }]
            })
            .sort('date')
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
    updateHoliday: function(holidayId, holidayObj) {
        var deferred = Q.defer();
        holydayModel.findOneAndUpdate({
                _id: holidayId
            }, holidayObj)
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                }
                if (result) {
                    deferred.resolve(result);
                } else {
                    deferred.resolve();
                }
            });
        return deferred.promise;
    },
    deleteHoliday: function(holidayId) {
        var deferred = Q.defer();
        holydayModel.findOneAndRemove({
                _id: holidayId
            })
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                }
                if (result) {
                    deferred.resolve(result);
                } else {
                    deferred.resolve();
                }
            });
        return deferred.promise;
    }
}
