'use strict';

var mongoose = require('../../lib').mongoose,
    Schema = mongoose.Schema,
    holidaySchema;

holidaySchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    purpose: {
        type: String,
        required: true
    }
}, {
    versionKey: false
});
holidaySchema.index({
    company: 1,
    date: 1
}, {
    unique: true
});
module.exports = mongoose.model("holiday", holidaySchema);
