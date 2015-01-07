/**
 * roleController
 *
 */
'use strict';
var lib = require('../../lib'),
    userModel = require('../models/user'),
    roleModel = require('../models/role'),
    roleUtils = require('../utils/roleUtil');
module.exports = {
    /**
     * `roleController.add()`
     */
    add: function(req, res) {
        var workflow = lib.workflow(req, res);
        req.body.company = req.user.companyProfile.company;
        roleUtils.isNewRole(req.body.name, req.body.company)
            .then(function() {
                if (req.body.trueName !== 'admin' &&
                    req.body.trueName !== 'manager' &&
                    req.body.trueName !== 'employee') {
                    new roleModel(req.body)
                        .save(function(err, data) {
                            if (err) {
                                utils.errorNotifier(err, workflow);
                                return;
                            }
                            workflow.outcome.data = data;
                            workflow.emit('response');
                        });
                } else {
                    workflow.outcome.errfor.message = lib.message.INVALID_CATAGORY_OF_ROLE;
                    workflow.emit('response');
                    return;
                }
            }, function() {
                workflow.outcome.errfor.message = lib.message.ROLE_NAME_ALREADY_EXISTS;
                workflow.emit('response');
            })
            .done();
    },
    /**
     * `roleController.view()`
     */
    view: function(req, res) {
        var workflow = lib.workflow(req, res);
        roleModel.findOne({
                _id: req.user.companyProfile.role._id
            })
            .exec(function(err, role) {
                if (err) {
                    workflow.emit('exception', err);
                } else {
                    workflow.outcome.data = role;
                    workflow.emit('response');
                }
            });
    },

    /**
     * `roleController.edit()`
     */
    edit: function(req, res) {
        var workflow = lib.workflow(req, res),
            userId = req.body._id;
        delete req.body._id;
        delete req.body.trueName;
        req.body.company = req.user.companyProfile.company;
        roleModel
            .findOneAndUpdate({
                _id: userId
            }, {
                $set: lib.flat(req.body)
            })
            .exec(function(err, updatedRole) {
                if (err) {
                    workflow.emit('exception', err);
                    return;
                }
                workflow.outcome.data = updatedRole;
                workflow.emit('response');
            });
    },
    viewAll: function(req, res) {
        var workflow = lib.workflow(req, res);
        roleModel.find({
                company: req.user.companyProfile.company
            })
            .exec(function(err, role) {
                if (err) {
                    workflow.emit('exception', err);
                } else {
                    workflow.outcome.data = role;
                    workflow.emit('response');
                }
            });
    }
};
