'use strict';
var lib = require('../../lib'),
    Q = lib.q,
    companyModel = require('../models/company.js');

module.exports = {
    /**
     *  know attendance completed upto date from company collection
     */
    knowCompletedAttendanceDate: function(company) {
        var deferred = Q.defer();
        companyModel
            .findOne({
                _id: company
            }, {
                attendanceCompletedUpto: 1,
                rules: 1
            })
            .exec(function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(data);
                }
            });
        return deferred.promise;
    }
};
