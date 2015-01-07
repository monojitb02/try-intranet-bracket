'use strict';
var lib = require('../../lib'),
    holidayUtil = require('../utils/holidayUtil'),
    message = lib.message;

module.exports = {
    addHoliday: function(req, res) {
        var workflow = lib.workflow(req, res);
        holidayUtil.saveHoliday(req.holidayObj)
            .then(function() {
                workflow.outcome.message = message.HOLIDAY_ADD_SUCCESSFUL;
                holidayUtil.findHoliday(req.user.companyProfile.company)
                    .then(function(data) {
                        workflow.outcome.data = data;
                        workflow.emit('response');
                    }, function(err) {
                        workflow.emit('exception', err);
                    });
            }, function(err) {
                workflow.emit('exception', err);
            });
    },
    viewHoliday: function(req, res) {
        var workflow = lib.workflow(req, res),
            company = req.user.companyProfile.company,
            year = req.query.year;
        if (year === undefined) {
            year = new Date().getFullYear();
        }
        if (isNaN(year) || year < 0) {
            workflow.outcome.errfor.message = lib.message.INVALID_YEAR;
            workflow.emit('response');
            return;
        }
        holidayUtil.findHoliday(company, year)
            .then(function(holiday) {
                if (holiday) {
                    workflow.outcome.data = holiday;
                } else {
                    workflow.outcome.errfor.message = message.NO_DATA;
                }
                workflow.emit('response');
            }, function(err) {
                workflow.emit('exception', err);
            })
            .done();
    },
    updateHoliday: function(req, res) {
        var holidayId = req.body.holidayId,
            workflow = lib.workflow(req, res);
        if (!holidayId) {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        holidayUtil.updateHoliday(holidayId, req.holidayObj)
            .then(function(updatedData) {
                if (updatedData) {
                    workflow.outcome.message = message.HOLIDAY_UPDATION_SUCCESSFUL;
                    holidayUtil.findHoliday(req.user.companyProfile.company)
                        .then(function(data) {
                            workflow.outcome.data = data;
                            workflow.emit('response');
                        }, function(err) {
                            workflow.emit('exception', err);
                            workflow.emit('response');
                        });
                } else {
                    workflow.outcome.errfor.message = message.NO_DATA;
                }
            }, function(err) {
                workflow.emit('exception', err);
            })
            .done();
    },
    removeHoliday: function(req, res) {
        var holidayId = req.body.holidayId,
            workflow = lib.workflow(req, res);
        if (!holidayId) {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        holidayUtil.deleteHoliday(holidayId)
            .then(function(data) {
                if (data) {
                    workflow.outcome.data = data;
                    workflow.outcome.message = message.HOLIDAY_REMOVE_SUCCESSFUL;
                } else {
                    workflow.outcome.errfor.message = message.NO_DATA;
                }
                workflow.emit('response');
            }, function(err) {
                workflow.emit('exception', err);
            })
            .done();
    }
}
