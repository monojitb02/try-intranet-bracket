/**
 * common policies
 *
 */
'use strict';
var lib = require('../../lib'),
    roleModel = require('../models/role'),
    userModel = require('../models/user');

module.exports = {

    loginValidationCheck: function(req, res, next) {
        var workflow = lib.workflow(req, res);

        /* if (req.user) {
             workflow.outcome.errfor.message = lib.message.ALREADY_LOGGED_IN;
             workflow.emit('response');
             return;
         }*/
        if (req.body.username === undefined || req.body.password === undefined) {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        if (req.body.secure === undefined || req.body.secure === 'false' ||
            req.body.secure === false) {
            req.body.password = lib.md5(req.body.password);
        }
        next();
    },
    dummyLogin: function(req, res, next) {
        userModel.findOne({
                _id: "542a3a5aed25bb350faef507"
            })
            .exec(function(errr, data) {
                req.session.user = data;
                next();
            });
    },
    authenticate: function(req, res, next) {
        var workflow = lib.workflow(req, res);
        // console.log('checking: ', req.body);
        // if (!req.session)
        if (req.path !== '/api/login' &&
            req.path !== '/api/reset_password' &&
            req.path !== '/api/app_details' &&
            req.path !== '/assets/images' &&
            req.path.split('/profile_pictures/')[0]) {
            if (!req.user
                /*!req.body.senderId &&
                                !req.query.senderId*/
            ) {
                workflow.outcome.errfor.message = lib.message.NOT_LOGGED_IN;
                workflow.emit('response');
            } else {
                next();
            }
        } else {
            next();
        }
    }
};
