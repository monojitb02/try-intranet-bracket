/**
 * companyController
 *
 */
'use strict';
var lib = require('../../lib'),
    companyModel = require('../models/company');
module.exports = {
    /**
     * `roleController.add()`
     */
    add: function(req, res) {
        new companyModel(req.body).save(function(err, data) {
            if (err) {
                utils.errorNotifier(err, workflow);
            } else {
                workflow.outcome.data = data;
                workflow.emit('response');
            }
        });
    },
    /**
     * `roleController.view()`
     */
    view: function(req, res) {
        companyModel.find()
            .exec(function(err, company) {
                if (err) {
                    utils.errorNotifier(err, workflow);
                } else {
                    workflow.outcome.data = company;
                    workflow.emit('response');
                }
            });
    }
}
