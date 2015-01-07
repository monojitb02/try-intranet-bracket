'use strict';

var mongoose = require('../../lib').mongoose,
    Schema = mongoose.Schema,
    leaveSchema;

leaveSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    duration: {
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date,
            required: true
        }
    },
    carriedForwardEL: {
        type: Number,
        default: 0
    },
    maxEL: {
        type: Number,
        required: true
    },
    maxCL: {
        type: Number,
        required: true
    },
    takenLWP: [{
        type: Date
    }],
    takenEL: [{
        type: Date
    }],
    takenCL: [{
        type: Date
    }]
}, {
    versionKey: false
});

module.exports = mongoose.model("leave", leaveSchema);
