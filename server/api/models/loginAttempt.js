'use strict';
var lib = require('../../lib'),
    Schema = lib.mongoose.Schema,

    attemptSchema = new lib.mongoose.Schema({
        ip: {
            type: String,
            default: ''
        },
        user: {
            type: String,
            default: ''
        },
        time: {
            type: Date,
            default: Date.now,
            expires: lib.config.loginAttempts.logExpiration
        }
    });
attemptSchema.index({
    ip: 1
});
attemptSchema.index({
    user: 1
});

module.exports = lib.mongoose.model('loginattempts', attemptSchema);
