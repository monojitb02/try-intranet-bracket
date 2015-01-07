'use strict';

var expect = require('chai').expect,
    baseUrl = 'localhost:8000/api/user/',
    adminRequest = require('superagent').agent(),
    userRequest = require('superagent').agent();

describe('User test', function() {
    var currentlyAddedEmployee;
    this.timeout(15000);

    /*
     * app details
     */
    it('get app details', function(done) {
        adminRequest
            .get('localhost:8000/api/app_details')
            .query({
                companyId: '5428eff3ed96f7b31ed9ed59'
            })
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.equal(true);
                done();
            });
    });

    /*
     * login as admin
     */
    it('login as admin', function(done) {
        adminRequest
            .post('localhost:8000/api/login')
            .send({
                username: 'sandip.saha@innofied.com',
                password: 'sandip',
                secure: false
            })
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.equal(true);
                done();
            });
    });

    /*
     * add an employee
     */
    it('add an employee', function(done) {
        adminRequest
            .post(baseUrl + 'add')
            .send({
                personalProfile: {
                    password: "827ccb0eea8a706c4c34a16891f84e7b",
                    permanentAddress: {
                        fullAddress: "kolkata",
                        city: "kolkata",
                        state: "WB",
                        country: "India",
                        PIN: 700091
                    },
                    contactNumbers: [
                        "123454545"
                    ]
                },
                companyProfile: {
                    DOJ: new Date("2014-10-15T12:38:12.839Z"),
                    DOB: new Date("2014-10-15T12:38:12.839Z"),
                    gender: "F",
                    email: "suman.das@innofied.com",
                    CTC: 0,
                    empId: "23232",
                    attendanceId: 100,
                    panId: "3424245465",
                    manager: "543e4d479cdb38f970bdad25",
                    role: "543285879266f57cd088671f",
                    designation: "543b733a95a9ec4439b77036",
                    company: "5428eff3ed96f7b31ed9ed59",
                    isActive: true,
                    name: {
                        first: "Suman",
                        last: "Das"
                    }
                }
            })
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.equal(true);
                done();
            });
    });

    /*
     * view all user
     */
    it('recently added employee should be in complete user list', function(done) {
        adminRequest
            .get(baseUrl + 'view_all')
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.equal(true);
                currentlyAddedEmployee = res.body.data.filter(function(user) {
                    return user.companyProfile.email === 'suman.das@innofied.com'
                })[0];
                expect(currentlyAddedEmployee).not.to.be.undefined;
                done();
            });
    });

    /*
     * view recently added user
     */
    it('view recently added user', function(done) {
        adminRequest
            .get(baseUrl + 'view_one')
            .query({
                userId: currentlyAddedEmployee._id
            })
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.equal(true);
                done();
            });
    });

    /*
     * logout admin
     */
    it('logout from admin', function(done) {
        adminRequest
            .post('localhost:8000/api/logout')
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.equal(true);
                done();
            });
    });

    /*
     * login as employee
     */
    it('login from recently added employee\'s account', function(done) {
        userRequest
            .post('localhost:8000/api/login')
            .send({
                username: 'suman.das@innofied.com',
                password: '12345',
                secure: false
            })
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.equal(true);
                done();
            });
    });

    /*
     * view own profile
     */
    it('view own profile', function(done) {
        userRequest
            .get(baseUrl + 'view')
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                expect(res.statusCode).to.equal(200);
                done();
            });
    });

    /*
     * update own profile
     */
    it('update own profile by updating contactNumbers', function(done) {
        userRequest
            .put(baseUrl + 'update_own')
            .send({
                personalProfile: {
                    contactNumbers: ['8420934321']
                }
            })
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.equal(true);
                expect(res.body.data.personalProfile.contactNumbers).to.include('8420934321')
                done();
            });
    });

    /*
     * update password
     */
    it('update password from employee account', function(done) {
        userRequest
            .put(baseUrl + 'change_password')
            .send({
                oldPassword: '12345',
                newPassword: '1234',
                secure: false
            })
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.equal(true);
                done();
            });
    });

    /*
     * logout user
     */
    it('logout from employee account', function(done) {
        userRequest
            .post('localhost:8000/api/logout')
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.equal(true);
                done();
            });
    });


    /*
     * relogin user with new password
     */
    it('login again as employee with new password', function(done) {
        userRequest
            .post('localhost:8000/api/login')
            .send({
                username: 'suman.das@innofied.com',
                password: '1234',
                secure: false
            })
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.equal(true);
                done();
            });
    });

    /*
     * logout user
     */
    it('logout from employee account', function(done) {
        userRequest
            .post('localhost:8000/api/logout')
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.equal(true);
                done();
            });
    });

    /*
     * reset password
     */
    it('reset password of employee account', function(done) {
        userRequest
            .put('localhost:8000/api/reset_password')
            .send({
                email: 'suman.das@innofied.com'
            })
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.equal(true);
                done();
            });
    });
});
/*module.exports = [ {
    desription: 'should response',
    message: 'response',
    body: {},
    path: '/reset_password',
    method: 'PUT',
    statusCode: 200
}, {
    desription: 'should response',
    message: 'response',
    body: {},
    path: '/user/view',
    method: 'GET',
    statusCode: 200
}, {
    desription: 'should response',
    message: 'response',
    body: {},
    path: '/user/view?senderId=54353f7085256eaa4d3c9a14',
    method: 'GET',
    statusCode: 200
},{
    desription: 'should response',
    message: 'response',
    body: {},
    path: '/user/view_all?senderId=542a3a5aed25bb350faef507',
    method: 'GET',
    statusCode: 200
}, {
    desription: 'should response',
    message: 'response',
    body: {},
    path: '/user/view_one?senderId=542a3a5aed25bb350faef507',
    method: 'GET',
    statusCode: 200
}, {
    desription: 'should response',
    message: 'response',
    body: {},
    path: '/user/view_one?senderId=542a3a5aed25bb350faef507' +
        '&userId=54353f7085256eaa4d3c9a14',
    method: 'GET',
    statusCode: 200
}, {
    desription: 'should response',
    message: 'response',
    body: {},
    path: '/user/add?senderId=542a3a5aed25bb350faef507',
    method: 'POST',
    statusCode: 200
}, {
    desription: 'should response',
    message: 'response',
    body: {},
    path: '/user/add?senderId=542a3a5aed25bb350faef507',
    method: 'POST',
    statusCode: 200
}, {
    desription: 'should response',
    message: 'response',
    body: {},
    path: '/user/update_own?senderId=542a3a5aed25bb350faef507',
    method: 'PUT',
    statusCode: 200
}];
*/
