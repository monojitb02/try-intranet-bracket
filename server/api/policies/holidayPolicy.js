'use strict';
var lib = require('../../lib'),
    message = lib.message;
module.exports = {
    validateHolidayData: function(req, res, next) {
        var workflow = lib.workflow(req, res),
            date = req.body.date ? new Date(req.body.date) : req.body.date,
            purpose = req.body.purpose,
            company = req.user.companyProfile.company,
            holidayObj;
        if (!(date && purpose)) {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        if (date.toString() === 'Invalid Date') {
            workflow.outcome.errfor.message = lib.message.INVALID_DATE;
            workflow.emit('response');
            return;
        }
        if (new Date().getFullYear() > date.getFullYear()) {
            workflow.outcome.errfor.message = lib.message.HOLIDAY_ADD_RULE;
            workflow.emit('response');
            return;
        }
        date.setHours(0, 0, 0, 0);
        holidayObj = {
            company: company,
            date: date,
            purpose: purpose
        };
        req.holidayObj = holidayObj;
        next();
    }
}
