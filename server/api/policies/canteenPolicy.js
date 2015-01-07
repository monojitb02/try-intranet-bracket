'use strict';
var lib = require('../../lib'),
    message = lib.message;
module.exports = {
    /*
     * validation check before set order
     */
    validateSetOrder: function(req, res, next) {
        var workflow = lib.workflow(req, res),
            items = req.body.items;

        if (items === undefined) {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        if (!Array.isArray(items)) {
            workflow.outcome.errfor.message = lib.message.INVALID_ITEMS;
            workflow.emit('response');
            return;
        }
        next();
    },
    /*
     * validation check for view order history and view transaction history
     */
    validateViewHistory: function(req, res, next) {
        var workflow = lib.workflow(req, res),
            date = req.query.date ? new Date(Number(req.query.date)) : req.query.date,
            month = req.query.month,
            year = req.query.year,
            startDate, endDate, findCriteria;
        if (!date && (month === undefined || year === undefined)) {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        if (date && date.toString() !== 'Invalid Date') {
            date.setHours(0, 0, 0, 0);
            if (date > new Date()) {
                workflow.outcome.errfor.message = lib.message.INVALID_DATE;
                workflow.emit('response');
                return;
            }
            findCriteria = {
                date: date
            };
            req.findCriteria = findCriteria;
            next();
            return;
        }
        if (isNaN(month) || month > 11 || month < 0) {
            workflow.outcome.errfor.message = lib.message.INVALID_MONTH;
            workflow.emit('response');
            return;
        }
        if (isNaN(year) || year > new Date().getFullYear() || year < 1970) {
            workflow.outcome.errfor.message = lib.message.INVALID_YEAR;
            workflow.emit('response');
            return;
        }
        if (year === new Date().getFullYear() && month > new Date().getMonth()) {
            workflow.outcome.errfor.message = lib.message.INVALID_MONTH;
            workflow.emit('response');
            return;
        };

        //creates start date and end date from received month and year
        startDate = new Date(year, month, 1);
        month++;
        endDate = new Date(year, month, 0);
        findCriteria = {
            startDate: startDate,
            endDate: endDate
        };
        req.findCriteria = findCriteria;
        next();
    },
    /*
     * validation check before cancel order
     */
    validateCancelOrder: function(req, res, next) {
        var workflow = lib.workflow(req, res),
            item = req.body.item;

        if (item === undefined) {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        next();
    },
    /*
     * validation check before taking payment
     */
    validateMakePayment: function(req, res, next) {
        var workflow = lib.workflow(req, res),
            user = req.body.user,
            amount = req.body.amount;

        if (user === undefined || amount === undefined) {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        if (isNaN(amount)) {
            workflow.outcome.errfor.message = lib.message.INVALID_AMOUNT;
            workflow.emit('response');
            return;
        }
        req.payment = {
            user: user,
            amount: amount,
            date: new Date(new Date().setHours(0, 0, 0, 0))
        }
        next();
    },
    /*
     * validation check before edit transaction
     */
    validateEditPayment: function(req, res, next) {
        var workflow = lib.workflow(req, res),
            paymentId = req.body.paymentId,
            user = req.body.user,
            amount = req.body.amount;

        if (user === undefined || amount === undefined || paymentId === undefined) {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        if (isNaN(amount)) {
            workflow.outcome.errfor.message = lib.message.INVALID_AMOUNT;
            workflow.emit('response');
            return;
        }
        req.payment = {
            user: user,
            amount: amount,
            paymentId: paymentId
        }
        next();
    }
}
