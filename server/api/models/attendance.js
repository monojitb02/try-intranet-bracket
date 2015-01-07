/**
 * Attendance.js
 */

'use strict';
var lib = require('../../lib'),
    Schema = lib.mongoose.Schema,
    attendanceSchema = new Schema({
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
        date: {
            type: Date,
            required: true
        },
        shift: {
            type: String,
            default: 'GS'
        },
        inTime: {
            type: String,
            required: true
        },
        outTime: {
            type: String,
            required: true
        },
        workDuration: {
            type: String,
            required: false
        },
        totalDuration: {
            type: String,
            required: false
        },
        overTime: {
            type: String,
            required: false
        },
        status: {
            type: String,
            required: true
        },
        modifiedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        isManualEntry: {
            type: Boolean,
            default: false
        }
    }, {
        versionKey: false
    });
attendanceSchema.index({
    user: 1,
    date: 1
}, {
    unique: true
});
module.exports = lib.mongoose.model('attendance', attendanceSchema);
