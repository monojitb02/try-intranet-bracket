'use strict';

var lib = require('../../lib'),
    Schema = lib.mongoose.Schema,
    transactionSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        menuitem: {
            type: Schema.Types.ObjectId,
            ref: 'menuitem'
        }
    }, {
        versionKey: false
    });

module.exports = lib.mongoose.model('transaction', transactionSchema);
