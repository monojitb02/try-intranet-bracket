/**
 * User.js
 *
 */

'use strict';
var lib = require('../../lib'),
    Schema = lib.mongoose.Schema,
    roleSchema = new Schema({
        company: {
            type: Schema.Types.ObjectId,
            ref: 'company',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        trueName: {
            type: String,
            required: true
        },
        user: {
            own: {
                personalProfile: {
                    edit: {
                        type: Boolean,
                        'default': false
                    },
                    view: {
                        type: Boolean,
                        'default': false
                    }
                },
                companyProfile: {
                    edit: {
                        type: Boolean,
                        'default': false
                    },
                    view: {
                        type: Boolean,
                        'default': false
                    }
                }
            },
            others: {
                personalProfile: {
                    edit: {
                        type: Boolean,
                        'default': false
                    },
                    view: {
                        type: Boolean,
                        'default': false
                    }
                },
                companyProfile: {
                    edit: {
                        type: Boolean,
                        'default': false
                    },
                    view: {
                        type: Boolean,
                        'default': false
                    }
                },
                add: {
                    type: Boolean,
                    'default': false
                },
                block: {
                    type: Boolean,
                    'default': false
                }
            }
        },
        leave: {
            own: {
                viewApplication: {
                    type: Boolean,
                    'default': false
                },
                cancelApplication: {
                    type: Boolean,
                    'default': false
                }
            },
            others: {
                view: {
                    type: Boolean,
                    'default': false
                },
                manage: {
                    type: Boolean,
                    'default': false
                },
                updateLeaveAccount: {
                    type: Boolean,
                    'default': false
                },
            }
        },
        attendance: {
            own: {
                view: {
                    type: Boolean,
                    'default': false
                },
                add: {
                    type: Boolean,
                    'default': false
                },
                edit: {
                    type: Boolean,
                    'default': false
                }
            },
            others: {
                view: {
                    type: Boolean,
                    'default': false
                },
                add: {
                    type: Boolean,
                    'default': false
                },
                edit: {
                    type: Boolean,
                    'default': false
                }
            }
        },
        role: {
            add: {
                type: Boolean,
                'default': false
            },
            edit: {
                type: Boolean,
                'default': false
            },
            view: {
                type: Boolean,
                'default': false
            },
            viewAll: {
                type: Boolean,
                'default': false
            }
        },
        canteen: {
            manage: {
                type: Boolean,
                'default': false
            }
        }
    }, {
        versionKey: false
    });
module.exports = lib.mongoose.model('role', roleSchema);
