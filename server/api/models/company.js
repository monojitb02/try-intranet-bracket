/**
 * Company.js
 *
 */
'use strict';
var lib = require('../../lib'),
    Schema = lib.mongoose.Schema,
    companySchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        address: {
            fullAddress: {
                type: String,
                required: false
            },
            PIN: {
                type: Number,
                required: false
            },
            city: {
                type: String,
                required: false
            },
            state: {
                type: String,
                required: false
            },
            country: {
                type: String,
                required: false
            }
        },
        rules: {
            leave: {
                maxCL: {
                    type: Number,
                    required: true
                },
                maxEL: {
                    type: Number,
                    required: true
                },
                minimunDaysBeforeApplyEL: {
                    type: Number,
                    required: true
                }
            },
            monthOfYearBreaks: {
                type: Number,
                default: 1
            }
        },
        attendanceCompletedUpto: {
            type: Date,
            default: null
        }
    }, {
        versionKey: false
    });
module.exports = lib.mongoose.model('company', companySchema);
