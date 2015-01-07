'use strict';

var lib = require('../../lib'),
    Schema = lib.mongoose.Schema,
    menuitemSchema = new Schema({
        date: {
            type: Date,
            required: true
        },
        itemName: {
            type: String,
            required: true
        },
        totalPrice: {
            type: Number,
            default: 0
        },
        unitPrice: {
            type: Number,
            default: 0
        },
        users: [{
            type: Schema.ObjectId,
            ref: 'user'
        }],
        lock: {
            type: Boolean,
            default: false
        }
    }, {
        versionKey: false
    });
menuitemSchema.index({
    date: 1,
    itemName: 1
}, {
    unique: true
});
module.exports = lib.mongoose.model('menuitem', menuitemSchema);
