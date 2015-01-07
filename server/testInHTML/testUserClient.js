'use strict';

describe.skip('User test', function() {
    var baseUrl = 'http://localhost:8000/api/user/',
        currentlyAddedEmployee;
    this.timeout(15000);

    /*
     * app details
     */
    it('get app details', function(done) {

        $.ajax({
            url: 'http://localhost:8000/api/app_details',
            method: 'GET',
            data: {
                companyId: '5428eff3ed96f7b31ed9ed59'
            },
            success: function(result) {
                expect(result.success).to.equal(true);
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    /*
     * login user
     */
    it('login as admin', function(done) {
        $.ajax({
            url: 'http://localhost:8000/api/login',
            method: 'POST',
            data: {
                username: 'sandip.saha@innofied.com',
                password: 'sandip',
                secure: false
            },
            success: function(result) {
                expect(result.success).to.equal(true);
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    /*
     * add an employee
     */
    it('add an employee', function(done) {
        $.ajax({
            url: baseUrl + 'add',
            method: 'POST',
            data: {
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
            },
            success: function(result) {
                expect(result.success).to.equal(true);
                //result.data.user._id
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    /*
     * view all user
     */
    it('recently added employee should be in complete user list', function(done) {
        $.ajax({
            url: baseUrl + 'view_all',
            method: 'GET',
            success: function(result) {
                expect(result.success).to.equal(true);
                currentlyAddedEmployee = result.data.filter(function(user) {
                    return user.companyProfile.email === 'suman.das@innofied.com'
                })[0];
                expect(currentlyAddedEmployee).not.to.be.undefined;
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    /*
     * view recently added user
     */
    it('view recently added user', function(done) {
        $.ajax({
            url: baseUrl + 'view_one',
            method: 'GET',
            data: {
                userId: currentlyAddedEmployee._id
            },
            success: function(result) {
                expect(result.success).to.equal(true);
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    /*
     * logout admin
     */
    it('logout from admin', function(done) {
        $.ajax({
            url: 'http://localhost:8000/api/logout',
            method: 'POST',
            success: function(result) {
                expect(result.success).to.equal(true);
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    /*
     * login user
     */
    it('login as employee', function(done) {
        $.ajax({
            url: 'http://localhost:8000/api/login',
            method: 'POST',
            data: {
                username: 'suman.das@innofied.com',
                password: '12345',
                secure: false
            },
            success: function(result) {
                expect(result.success).to.equal(true);
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    /*
     * view own profile
     */
    it('view own profile', function(done) {
        $.ajax({
            url: baseUrl + 'view',
            method: 'GET',
            success: function(result) {
                expect(result.success).to.equal(true);
                expect(result.data.companyProfile.name.first).to.equal('Suman')
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    /*
     * update own profile
     */
    it('update own profile by updating contactNumbers', function(done) {
        $.ajax({
            url: baseUrl + 'update_own',
            method: 'PUT',
            data: {
                personalProfile: {
                    contactNumbers: ['8420934321']
                }
            },
            success: function(result) {
                expect(result.success).to.equal(true);
                expect(result.data.personalProfile.contactNumbers).to.include('8420934321');
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    /*
     * update password
     */
    it('update password from employee account', function(done) {
        $.ajax({
            url: baseUrl + 'change_password',
            method: 'PUT',
            data: {
                oldPassword: '12345',
                newPassword: '1234',
                secure: false
            },
            success: function(result) {
                expect(result.success).to.equal(true);
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    /*
     * logout user
     */
    it('logout from employee account', function(done) {
        $.ajax({
            url: 'http://localhost:8000/api/logout',
            method: 'POST',
            success: function(result) {
                expect(result.success).to.equal(true);
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    /*
     * relogin user with new password
     */
    it('login again as employee with new password', function(done) {
        $.ajax({
            url: 'http://localhost:8000/api/login',
            method: 'POST',
            data: {
                username: 'suman.das@innofied.com',
                password: '1234',
                secure: false
            },
            success: function(result) {
                expect(result.success).to.equal(true);
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    /*
     * logout user
     */
    it('logout from employee account', function(done) {
        $.ajax({
            url: 'http://localhost:8000/api/logout',
            method: 'POST',
            success: function(result) {
                expect(result.success).to.equal(true);
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });
    /*
     * reset password
     */
    it('reset password of employee account', function(done) {
        $.ajax({
            url: 'http://localhost:8000/api/reset_password',
            method: 'PUT',
            data: {
                email: 'suman.das@innofied.com'
            },
            success: function(result) {
                expect(result.success).to.equal(true);
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

});
