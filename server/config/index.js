'use strict';

module.exports = {
    //db: 'mongodb://192.168.0.15/intranet',
    //db: 'mongodb://localhost/intranet',
    db: 'mongodb://intranet:innofied123@ds051970.mongolab.com:51970/intranet',
    server: {
        host: 'localhost',
        port: process.env.PORT || 8000
    },
    typeOfLeave: {
        1: "CL",
        2: "EL",
        3: "LWP"
    },
    statusCode: {
        1: "pending",
        2: "approved",
        3: "rejected",
        4: "cancelled"
    },
    leave: {
        leaveforDesignations: [{
            designation: 'trainee',
            maxCL: 2
        }, {
            designation: 'employee',
            maxCL: 6,
            maxEL: 10
        }],
        minimunDaysBeforeApplyEL: 15
    },
    workingHour: {
        hour: 18,
        min: 30
    },
    mailCredential: {
        host: 'secure23.webhostinghub.com',
        port: '465',
        secure: 'SSL',
        maxConnections: 5,
        auth: {
            user: 'noreply@innofied.com',
            pass: 'noreply'
        },
        socketTimeout: 60 * 60 * 1000
    },
    minBalanceToOrder: 0,
    loginAttempts: {
        forIp: 50,
        forIpAndUser: 7,
        logExpiration: '5m'
    }
};
