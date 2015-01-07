/**
 * appController
 *
 */
'use strict';
var lib = require('../../lib'),
    designationUtils = require('../utils/designationUtil'),
    companyModel = require('../models/company'),
    designationModel = require('../models/designation'),
    roleModel = require('../models/role');
module.exports = {
    getDetails: function(req, res) {
        var workflow = lib.workflow(req, res),
            getCompany = function() {
                var deferred = lib.q.defer();
                companyModel
                    .findOne({
                        _id: req.query.companyId
                    })
                    .exec(function(err, company) {
                        if (err) {
                            deferred.reject(err);
                        } else if (company) {
                            deferred.resolve(company);
                        } else {
                            deferred.reject(lib.message.NO_DATA);
                        }
                    });
                return deferred.promise;
            },
            getRoles = function() {
                var deferred = lib.q.defer();
                roleModel
                    .find({
                        company: req.query.companyId
                    })
                    .exec(function(err, roles) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(roles);
                        }
                    });
                return deferred.promise;
            };
        if (!req.query.companyId) {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        lib.q.all([getRoles(), getCompany(), designationUtils.getDesignationsCount()])
            .spread(function(roles, company, designations) {
                workflow.outcome.data = {};
                workflow.outcome.data.roles = roles;
                workflow.outcome.data.company = company;
                workflow.outcome.data.designations = designations;
                workflow.emit('response');
            }, function(err1, err2, err3) {
                if (err1) {
                    workflow.emit('exception', err1);
                } else if (err2) {
                    workflow.emit('exception', err2);
                } else if (err3) {
                    workflow.emit('exception', err3);
                }
            })
            .done();
    }
};
