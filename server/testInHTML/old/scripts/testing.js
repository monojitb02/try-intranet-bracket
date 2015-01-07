'use strict';
// var $ = function() {};
var baseUrl = 'http://192.168.2.6:8000/api',
    sendAjaxRequest = function(config, options) {
        if (options === undefined) {
            options = {
                success: function(data) {
                    if (data.success) {
                        $('#' + path).removeClass('pending').addClass('loading complete').text('Complete');
                    } else {
                        $('#' + path).removeClass('pending').addClass('loading fail').text('Fail');
                    }
                    if (data.data) {
                        data.data = 'some data....';
                    }
                    $('#' + path + '_response').text(JSON.stringify(data));
                    $('#' + path + 'Img').hide();
                },
                error: function() {
                    $('#' + path).removeClass('pending').addClass('loading err').text('Error Connection');
                    $('#' + path + 'Img').hide();
                }
            };
        }
        $.ajax({
            url: baseUrl + config.url,
            active: false,
            method: config.method,
            data: config.data,
            success: function(data) {
                return options.success(data);
            },
            error: function(err) {
                return options.error(err);
            }
        });
    },
    paths = {
        appDetails1: {
            data: {},
            url: '/app_details',
            method: 'GET',
            active: true
        },
        appDetails2: {
            data: {
                companyId: '5428eff3ed96f7b31ed9ed59'
            },
            url: '/app_details',
            method: 'GET',
            active: true
        },
        login1: {
            data: {},
            url: '/login',
            method: 'POST',
            active: true
        },
        login2: {
            data: {
                'email': 'monojit@innofied.com',
                'password': 'hi'
            },
            url: '/login',
            method: 'POST',
            active: true
        },
        login3: {
            data: {
                'email': 'monojit@innofied.com',
                'password': 'hi',
                'secure': true
            },
            url: '/login',
            method: 'POST',
            active: true
        },
        login4: {
            data: {
                'email': 'sandip.saha@innofied.com',
                'password': 'sandip',
                'secure': true
            },
            url: '/login',
            method: 'POST',
            active: true
        },
        login5: {
            data: {
                'email': 'sandip.saha@innofied.com',
                'password': 'sandip',
                'secure': false
            },
            url: '/login',
            method: 'POST',
            active: true
        },
        logout1: {
            data: {
                senderId: '54353f7085256eaa4d3c9a14'
            },
            url: '/logout',
            method: 'GET',
            active: true
        },
        logout2: {
            data: {},
            url: '/logout',
            method: 'GET',
            active: true
        },
        resetPassword1: {
            data: {},
            url: '/reset_password',
            method: 'PUT',
            active: true
        },
        userView1: {
            data: {},
            url: '/user/view',
            method: 'GET',
            active: true
        },
        userView2: {
            data: {
                senderId: '54353f7085256eaa4d3c9a14'
            },
            url: '/user/view',
            method: 'GET',
            active: true
        },
        userViewAll1: {
            data: {
                senderId: '54353f7085256eaa4d3c9a14'
            },
            url: '/user/view_all',
            method: 'GET',
            active: true
        },
        userViewAll2: {
            data: {
                senderId: '542a3a5aed25bb350faef507'
            },
            url: '/user/view_all',
            method: 'GET',
            active: true
        },
        userViewOne1: {
            data: {
                senderId: '542a3a5aed25bb350faef507'
            },
            url: '/user/view_one',
            method: 'GET',
            active: true
        },
        userViewOne2: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                userId: '54353f7085256eaa4d3c9a14'
            },
            url: '/user/view_one',
            method: 'GET',
            active: true
        },
        userAdd1: {
            data: {
                senderId: '542a3a5aed25bb350faef507'
            },
            url: '/user/add',
            method: 'POST',
            active: true
        },
        userAdd2: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                name: 'ddgh'
            },
            url: '/user/add',
            method: 'POST',
            active: true
        },
        userAdd3: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                companyProfile: {
                    name: 'ddgh'
                }
            },
            url: '/user/add',
            method: 'POST',
            active: true
        },
        userAdd4: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                companyProfile: {
                    name: 'ddgh',
                    role: 'fhkjgjfg'
                }
            },
            url: '/user/add',
            method: 'POST',
            active: true
        },
        userAdd5: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                companyProfile: {
                    name: 'ddgh',
                    role: '5428f00bed96f7b31ed9ed5c'
                }
            },
            url: '/user/add',
            method: 'POST',
            active: true
        },
        userUpdateOwn1: {
            data: {
                senderId: '542a3a5aed25bb350faef507'
            },
            url: '/user/update_own',
            method: 'PUT',
            active: true
        },

        //asis//////////////////////////////////
        holidayAdd1: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014'
            },
            url: '/holiday/add',
            method: 'POST',
            active: true
        },
        holidayAdd2: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                purpose: 'Independence Day'
            },
            url: '/holiday/add',
            method: 'POST',
            active: true
        },
        holidayAdd3: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '08/15/2014aaaa',
                purpose: 'Independence Day'
            },
            url: '/holiday/add',
            method: 'POST',
            active: true
        },
        holidayAdd4: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '08/15/2010',
                purpose: 'Independence Day'
            },
            url: '/holiday/add',
            method: 'POST',
            active: true
        },
        holidayAdd5: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '08/15/2014',
                purpose: 'Independence Day'
            },
            url: '/holiday/add',
            method: 'POST',
            active: true
        },
        holidayAdd6: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/02/2014',
                purpose: 'Dry Day'
            },
            url: '/holiday/add',
            method: 'POST',
            active: true
        },
        attendanceAdd1: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014',
                user: '54353f7085256eaa4d3c9a14',
                inTime: '9:30'
            },
            url: '/attendance/add',
            method: 'POST',
            active: true
        },
        attendanceAdd2: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014aaa',
                user: '54353f7085256eaa4d3c9a14',
                inTime: '9:30',
                outTime: '19:30'
            },
            url: '/attendance/add',
            method: 'POST',
            active: true
        },
        attendanceAdd3: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014',
                user: 'abcd',
                inTime: '9:30',
                outTime: '19:30'
            },
            url: '/attendance/add',
            method: 'POST',
            active: true
        },
        attendanceAdd4: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014',
                user: '54353f7085256eaa4d3c9a14',
                inTime: 'aaa',
                outTime: '19:30'
            },
            url: '/attendance/add',
            method: 'POST',
            active: true
        },
        attendanceAdd5: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014',
                user: '54353f7085256eaa4d3c9a14',
                inTime: '9:30',
                outTime: 'aaa'
            },
            url: '/attendance/add',
            method: 'POST',
            active: true
        },
        attendanceAdd6: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2020',
                user: '54353f7085256eaa4d3c9a14',
                inTime: '9:30',
                outTime: '19:30'
            },
            url: '/attendance/add',
            method: 'POST',
            active: true
        },
        attendanceAdd7: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014',
                user: '54353f7085256eaa4d3c9a14',
                inTime: '29:30',
                outTime: '19:30'
            },
            url: '/attendance/add',
            method: 'POST',
            active: true
        },
        attendanceAdd8: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014',
                user: '54353f7085256eaa4d3c9a14',
                inTime: '9:30',
                outTime: '39:30'
            },
            url: '/attendance/add',
            method: 'POST',
            active: true
        },
        attendanceAdd9: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014',
                user: '54353f7085256eaa4d3c9a14',
                inTime: '9:30',
                outTime: '19:30'
            },
            url: '/attendance/add',
            method: 'POST',
            active: true
        },
        leaveManage1: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                leaveId: '5438d245b90942b83e557b5a'
            },
            url: '/leave/manage',
            method: 'PUT',
            active: true
        },
        leaveManage2: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                approved: '1'
            },
            url: '/leave/manage',
            method: 'PUT',
            active: true
        },
        leaveManage3: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                leaveId: 'abcd',
                approved: '1'
            },
            url: '/leave/manage',
            method: 'PUT',
            active: true
        },
        leaveManage4: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                leaveId: '5438d245b90942b83e557b5a',
                approved: '1aaa'
            },
            url: '/leave/manage',
            method: 'PUT',
            active: true
        },
        leaveManage5: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                leaveId: '5438d245b90942b83e557b5a',
                approved: '2'
            },
            url: '/leave/manage',
            method: 'PUT',
            active: true
        },
        leaveManage6: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                leaveId: '5435477d52bfed4336011cf8',
                approved: '1'
            },
            url: '/leave/manage',
            method: 'PUT',
            active: true
        },
        leaveEdit1: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                user: '54353f7085256eaa4d3c9a14',
                date: '10/11/2014'
            },
            url: '/leave/edit',
            method: 'PUT',
            active: true
        },
        leaveEdit2: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                user: 'abcd',
                date: '10/11/2014',
                leaveType: '1'
            },
            url: '/leave/edit',
            method: 'PUT',
            active: true
        },
        leaveEdit3: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                user: '54353f7085256eaa4d3c9a14',
                date: '10/11/2014',
                leaveType: 'rr'
            },
            url: '/leave/edit',
            method: 'PUT',
            active: true
        },
        leaveEdit4: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                user: '54353f7085256eaa4d3c9a14',
                date: '10/11/2014',
                leaveType: '1'
            },
            url: '/leave/edit',
            method: 'PUT',
            active: true
        },
        leaveEdit5: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                user: '54353f7085256eaa4d3c9a14',
                date: '10/11/2014',
                leaveType: '2'
            },
            url: '/leave/edit',
            method: 'PUT',
            active: true
        },
        leaveEdit6: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                user: '54353f7085256eaa4d3c9a14',
                date: '10/11/2014',
                leaveType: '4'
            },
            url: '/leave/edit',
            method: 'PUT',
            active: true
        },
        leaveEdit7: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                user: '54353f7085256eaa4d3c9a14',
                date: 'ab',
                leaveType: '1'
            },
            url: '/leave/edit',
            method: 'PUT',
            active: true
        },
        holidayRemove1: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
            },
            url: '/holiday/remove',
            method: 'PUT',
            active: true
        },
        holidayRemove2: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                holidayId: 'abcd'
            },
            url: '/holiday/remove',
            method: 'PUT',
            active: true
        },
        holidayRemove3: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                holidayId: '5438fe8634137b9c524ae326'
            },
            url: '/holiday/remove',
            method: 'PUT',
            active: true
        },
        holidayRemove4: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                holidayId: '5438fe8634137b9c524ae326'
            },
            url: '/holiday/remove',
            method: 'PUT',
            active: true
        },
        attendanceEdit1: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014',
                user: '54353f7085256eaa4d3c9a14',
                inTime: '9:30'
            },
            url: '/attendance/edit',
            method: 'PUT',
            active: true
        },
        attendanceEdit2: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014aaa',
                user: '54353f7085256eaa4d3c9a14',
                inTime: '9:30',
                outTime: '19:30'
            },
            url: '/attendance/edit',
            method: 'PUT',
            active: true
        },
        attendanceEdit3: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014',
                user: 'abcd',
                inTime: '9:30',
                outTime: '19:30'
            },
            url: '/attendance/edit',
            method: 'PUT',
            active: true
        },
        attendanceEdit4: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014',
                user: '54353f7085256eaa4d3c9a14',
                inTime: 'aaa',
                outTime: '19:30'
            },
            url: '/attendance/edit',
            method: 'PUT',
            active: true
        },
        attendanceEdit5: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014',
                user: '54353f7085256eaa4d3c9a14',
                inTime: '9:30',
                outTime: 'aaa'
            },
            url: '/attendance/edit',
            method: 'PUT',
            active: true
        },
        attendanceEdit6: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2020',
                user: '54353f7085256eaa4d3c9a14',
                inTime: '9:30',
                outTime: '19:30'
            },
            url: '/attendance/edit',
            method: 'PUT',
            active: true
        },
        attendanceEdit7: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014',
                user: '54353f7085256eaa4d3c9a14',
                inTime: '29:30',
                outTime: '19:30'
            },
            url: '/attendance/edit',
            method: 'PUT',
            active: true
        },
        attendanceEdit8: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014',
                user: '54353f7085256eaa4d3c9a14',
                inTime: '9:30',
                outTime: '19:30'
            },
            url: '/attendance/edit',
            method: 'PUT',
            active: true
        },
        holidayEdit1: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '10/11/2014',
                purpose: 'Independence Day'
            },
            url: '/holiday/edit',
            method: 'PUT',
            active: true
        },
        holidayEdit2: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                holidayId: '5438fe8634137b9c524ae326',
                purpose: 'Independence Day'
            },
            url: '/holiday/edit',
            method: 'PUT',
            active: true
        },
        holidayEdit3: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                holidayId: 'adsd',
                date: '08/15/2014',
                purpose: 'Independence Day'
            },
            url: '/holiday/edit',
            method: 'PUT',
            active: true
        },
        holidayEdit4: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                holidayId: '5438fe8634137b9c524ae326',
                date: '08/15/2014aaaa',
                purpose: 'Independence Day'
            },
            url: '/holiday/edit',
            method: 'PUT',
            active: true
        },
        holidayEdit5: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                holidayId: '5438fe8634137b9c524ae326',
                date: '08/15/2010',
                purpose: '68th Independence Day'
            },
            url: '/holiday/edit',
            method: 'PUT',
            active: true
        },
        holidayEdit6: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                holidayId: '5437689587aa6d670db11580',
                date: '08/15/2014',
                purpose: '68th Independence Day'
            },
            url: '/holiday/edit',
            method: 'PUT',
            active: true
        },
        attendanceView_all1: {
            data: {
                senderId: '542a3a5aed25bb350faef507'
            },
            url: '/attendance/view_all',
            method: 'GET',
            active: true
        },
        attendanceView_all2: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: 'abcd'
            },
            url: '/attendance/view_all',
            method: 'GET',
            active: true
        },
        attendanceView_all3: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '1413096679049'
            },
            url: '/attendance/view_all',
            method: 'GET',
            active: true
        },
        attendanceView_all4: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                date: '1412101800000'
            },
            url: '/attendance/view_all',
            method: 'GET',
            active: true
        },
        attendanceView1: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                month: '10'
            },
            url: '/attendance/view',
            method: 'GET',
            active: true
        },
        attendanceView2: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                year: '2014'
            },
            url: '/attendance/view',
            method: 'GET',
            active: true
        },
        attendanceView3: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                month: 'aaa',
                year: '2014'
            },
            url: '/attendance/view',
            method: 'GET',
            active: true
        },
        attendanceView4: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                month: '10',
                year: 'yyyy'
            },
            url: '/attendance/view',
            method: 'GET',
            active: true
        },
        attendanceView5: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                month: '10',
                year: '2015'
            },
            url: '/attendance/view',
            method: 'GET',
            active: true
        },
        attendanceView6: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                month: '12',
                year: '2014'
            },
            url: '/attendance/view',
            method: 'GET',
            active: true
        },
        attendanceView7: {
            data: {
                senderId: '54353f7085256eaa4d3c9a14',
                month: '09',
                year: '2014'
            },
            url: '/attendance/view',
            method: 'GET',
            active: true
        },
        leaveDetails1: {
            data: {
                senderId: '542a3a5aed25bb350faef507'
            },
            url: '/leave/details',
            method: 'GET',
            active: true
        },
        leaveView_all1: {
            data: {
                senderId: '542a3a5aed25bb350faef507'
            },
            url: '/leave/view_all',
            method: 'GET',
            active: true
        },
        holidayView1: {
            data: {
                senderId: '542a3a5aed25bb350faef507'
            },
            url: '/holiday/view',
            method: 'GET',
            active: true
        },
        holidayView2: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                year: 'aaa'
            },
            url: '/holiday/view',
            method: 'GET',
            active: true
        },
        holidayView3: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                year: '2016'
            },
            url: '/holiday/view',
            method: 'GET',
            active: true
        },
        holidayView4: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                year: '-2014'
            },
            url: '/holiday/view',
            method: 'GET',
            active: true
        },
        holidayView5: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                year: '2014'
            },
            url: '/holiday/view',
            method: 'GET',
            active: true
        },
        leaveSpecific_details1: {
            data: {
                senderId: '542a3a5aed25bb350faef507'
            },
            url: '/leave/specific_details',
            method: 'GET',
            active: true
        },
        leaveSpecific_details2: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                leaveId: 'abcd'
            },
            url: '/leave/specific_details',
            method: 'GET',
            active: true
        },
        leaveSpecific_details3: {
            data: {
                senderId: '542a3a5aed25bb350faef507',
                leaveId: '5435477d52bfed4336011cf8'
            },
            url: '/leave/specific_details',
            method: 'GET',
            active: true
        }

    };
