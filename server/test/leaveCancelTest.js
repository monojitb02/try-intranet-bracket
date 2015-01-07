'use strict';
var testcases = [{
    desription: 'should response',
    message: 'response',
    body: {
        'senderId': '543299791c70864866f269d8',
        'leaveId': 'aaaa'
    },
    path: '/leave/cancel',
    method: 'POST',
    statusCode: 200
}, {
    desription: 'should response',
    message: 'response',
    body: {
        'senderId': 'aaa',
        'leaveId': '5434010b7e97481903471f23'
    },
    path: '/leave/cancel',
    method: 'POST',
    statusCode: 200
}, {
    desription: 'should response',
    message: 'response',
    body: {
        'senderId': '543299791c70864866f269d8'
    },
    path: '/leave/cancel',
    method: 'POST',
    statusCode: 200
}, {
    desription: 'should response',
    message: 'response',
    body: {
        'senderId': '543299791c70864866f269d8',
        'leaveId': '5434010b7e97481903471f23'
    },
    path: '/leave/cancel',
    method: 'POST',
    statusCode: 200
}, {
    desription: 'should response',
    message: 'response',
    body: {
        'senderId': '543299791c70864866f269d8',
        'leaveId': '5434010b7e97481903471f23'
    },
    path: '/leave/cancel',
    method: 'POST',
    statusCode: 200
}];
module.exports = testcases;
