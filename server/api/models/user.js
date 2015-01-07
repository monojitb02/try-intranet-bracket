/**
 * User.js
 *
 */
'use strict';
var lib = require('../../lib'),
    Schema = lib.mongoose.Schema,
    userSchema = new Schema({
        companyProfile: {
            empId: {
                type: String,
                required: true
            },
            company: {
                type: Schema.Types.ObjectId,
                ref: 'company',
                required: true
            },
            attendanceId: {
                type: Number,
                required: true
            },
            role: {
                type: Schema.Types.ObjectId,
                ref: 'role',
                required: true
            },
            DOJ: {
                type: Date,
                required: true
            },
            DOB: {
                type: Date,
                required: true
            },
            name: {
                first: {
                    type: String,
                    required: true
                },
                middle: {
                    type: String
                },
                last: {
                    type: String,
                    required: true
                }
            },
            email: {
                type: String,
                unique: true,
                required: true
            },
            gender: {
                type: String,
                required: true
            },
            designation: {
                type: Schema.Types.ObjectId,
                ref: 'designation',
                required: true
            },
            manager: {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
            panId: {
                type: String,
                required: true
            },
            CTC: {
                type: Number,
                required: true
            },
            isActive: {
                type: Boolean,
                default: true
            }
        },
        personalProfile: {
            password: {
                type: String,
                required: true
            },
            photoUrl: {
                type: String
            },
            contactNumbers: [{
                type: String,
                required: true
            }],
            bioData: {
                type: String
            },
            permanentAddress: {
                fullAddress: {
                    type: String,
                    required: true
                },
                PIN: {
                    type: Number,
                    required: true
                },
                city: {
                    type: String,
                    required: true
                },
                state: {
                    type: String,
                    required: true
                },
                country: {
                    type: String,
                    required: true
                }
            },
            currentAddress: {
                fullAddress: {
                    type: String
                },
                PIN: {
                    type: Number
                },
                city: {
                    type: String
                },
                state: {
                    type: String
                },
                country: {
                    type: String
                }
            }
        },
        lastLogin: {
            date: {
                type: Date
            },
            ip: {
                type: String
            }
        }
    }, {
        versionKey: false
    });
module.exports = lib.mongoose.model("user", userSchema)
