/**
 * designation controller
 */
'use strict';
var lib = require('../../lib'),
    utils = require('../utils'),
    designationUtils = require('../utils/designationUtil'),
    userModel = require('../models/user'),
    designationModel = require('../models/designation');
module.exports = {
    /**
     * designationController.add()
     */
    add: function(req, res) {
        var workflow = lib.workflow(req, res);
        if (!req.body.post || typeof(req.body.post) !== 'string') {
            workflow.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        if (req.body._id) {
            designationModel
                .update({
                    _id: req.body._id
                }, {
                    post: req.body.post
                })
                .exec(function(err, data) {
                    if (err) {
                        utils.errorNotifier(err, workflow);
                    } else {
                        designationUtils.getDesignationsCount()
                            .then(function(designations) {
                                workflow.outcome.data = designations;
                                workflow.emit('response');
                            }, function(err) {
                                utils.errorNotifier(err, workflow);
                            })
                            .done();
                    }
                });
        } else {
            new designationModel(req.body)
                .save(function(err, data) {
                    if (err) {
                        utils.errorNotifier(err, workflow);
                    } else {
                        designationUtils.getDesignationsCount()
                            .then(function(designations) {
                                workflow.outcome.data = designations;
                                workflow.emit('response');
                            }, function(err) {
                                utils.errorNotifier(err, workflow);
                            })
                            .done();
                    }
                });
        }
    },
    /**
     * designationController.view()
     */
    view: function(req, res) {
        var workflow = lib.workflow(req, res);
        designationUtils.getDesignationsCount()
            .then(function(designations) {
                workflow.outcome.data = designations;
                workflow.emit('response');
            }, function(err) {
                utils.errorNotifier(err, workflow);
            })
            .done();
    }
};
