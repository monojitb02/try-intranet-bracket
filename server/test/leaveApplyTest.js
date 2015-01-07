'use strict';
var testcases = [{
    desription: 'should response',
    message: 'response',
    body: {
        'senderId': '543299791c70864866f269d8',
        'startDate': '10/25/2014',
        'endDate': '10/20/2014',
        'leaveType': '1',
        'reason': 'Physical problem'
    },
    path: '/leave/apply',
    method: 'POST',
    statusCode: 200
}, {
    desription: 'should response',
    message: 'response',
    body: {
        'startDate': '9/25/2014',
        'endDate': '9/30/2014',
        'leaveType': '1',
        'reason': 'Physical problem'
    },
    path: '/leave/apply',
    method: 'POST',
    statusCode: 200
}, {
    desription: 'should response',
    message: 'response',
    body: {
        'senderId': '543299791c70864866f269d8',
        'startDate': '9/25/2014aa',
        'endDate': '9/30/2014',
        'leaveType': '1',
        'reason': 'Physical problem'
    },
    path: '/leave/apply',
    method: 'POST',
    statusCode: 200
}, {
    desription: 'should response',
    message: 'response',
    body: {
        'senderId': '543299791c70864866f269d8',
        'startDate': '9/25/2014',
        'endDate': '9/10/2014',
        'leaveType': '1',
        'reason': 'Physical problem'
    },
    path: '/leave/apply',
    method: 'POST',
    statusCode: 200
}, {
    desription: 'should response',
    message: 'response',
    body: {
        'senderId': '543299791c70864866f269d8',
        'startDate': '11/25/2014',
        'endDate': '11/27/2014',
        'leaveType': '1',
        'reason': 'Physical problem'
    },
    path: '/leave/apply',
    method: 'POST',
    statusCode: 200
}];
module.exports = testcases;
