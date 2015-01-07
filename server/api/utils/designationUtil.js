'use strict';
var lib = require('../../lib'),
    fs = require('fs'),
    utils = require('../utils'),
    userModel = require('../models/user'),
    designationModel = require('../models/designation'),
    groupDesignations = function() {
        var deferred = lib.q.defer(),
            mapReduceOptions = {
                map: function() {
                    emit(this.companyProfile.designation, 1)
                },
                reduce: function(k, vals) {
                    return vals.length;
                }
            };
        userModel.mapReduce(mapReduceOptions, function(err, results) {
            if (err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(results);
        })
        return deferred.promise;
    },
    getAllDesignations = function() {
        var deferred = lib.q.defer();
        designationModel.find()
            .exec(function(err, designations) {
                if (err) {
                    deferred.reject(err);
                    return;
                }
                deferred.resolve(designations);
            });
        return deferred.promise;
    };
module.exports = {
    getAllDesignations: getAllDesignations,
    getDesignationsCount: function() {
        var deferred = lib.q.defer();
        lib.q.all([groupDesignations(), getAllDesignations()])
            .spread(function(designationCounts, designations) {
                var response = [];
                designations.forEach(function(designation) {
                    designation = designation.toObject();
                    designationCounts.forEach(function(designationCount) {
                        if (designation._id.toString() === designationCount._id.toString()) {
                            designation.count = designationCount.value;
                        }
                    });
                    if (designation.count === undefined) {
                        designation.count = 0;
                    }
                    response.push(designation);
                });
                deferred.resolve(response);
            })
        return deferred.promise;
    }
};
