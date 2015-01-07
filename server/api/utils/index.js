'use strict';
var lib = require('../../lib');
module.exports = {
    errorNotifier: function(err, workflow) {
        if (err === undefined) {
            workflow.emit('response');
        } else if (err.name === 'ValidationError') {
            workflow.outcome.errfor.message = lib.message.VALIDATION_ERROR;
            workflow.outcome.field = err.errors;
            workflow.emit('response');
        } else if (err.name === 'MongoError' && err.code == 11000) {
            workflow.outcome.errfor.message = lib.message.UNIQUE_KEY_CONSTRAINT_ERROR;
            workflow.emit('response');
        } else {
            workflow.emit('exception', err);
        }
    },
    toLowerFirstLetter: function(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }
}
