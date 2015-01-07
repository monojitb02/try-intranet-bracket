'use strict';

var mongoose = require('../../lib').mongoose,
    Schema = mongoose.Schema,
    leaveApplicationSchema;

leaveApplicationSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
    applicant: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    date: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    },
    durationOfLeave: {
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date,
            required: true
        }
    },
    typeOfLeave: { //1:CL,2:EL,3:LWP
        type: Number,
        required: true
    },
    statusCode: { //1:pending,2:approved,3:rejected,4:cancelled
        type: Number,
        default: 1
    }
}, {
    versionKey: false
});

module.exports = mongoose.model("leaveApplication", leaveApplicationSchema);
