/**
 *designation model
 */
'use strict';
var lib = require('../../lib'),
    Schema = lib.mongoose.Schema,
    designationSchema = new Schema({
        post: {
            type: String,
            required: true,
            unique: true,
            index: true
        }
    }, {
        versionKey: false
    });
module.exports = lib.mongoose.model('designation', designationSchema);
