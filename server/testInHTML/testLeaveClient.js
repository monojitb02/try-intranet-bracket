'use strict';

describe('Leave test', function() {
    var baseUrl = 'http://localhost:8000/api/leave/',
        leaveId, userId;
    this.timeout(15000);

    /*
     * login as employee
     */
    it('login as employee', function(done) {
        $.ajax({
            url: 'http://localhost:8000/api/login',
            method: 'POST',
            data: {
                username: 'asis.datta@innofied.com',
                password: 'asis',
                secure: false
            },
            success: function(result) {
                expect(result.success).to.equal(true);
                userId = result.data._id;
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    it('apply for a leave', function(done) {
        $.ajax({
            url: baseUrl + 'apply',
            method: 'POST',
            data: {
                startDate: new Date(),
                endDate: new Date(),
                leaveType: 1,
                reason: 'driving test'
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

    it('view leave account and applied leave', function(done) {
        $.ajax({
            url: baseUrl + 'details',
            method: 'GET',
            success: function(result) {
                expect(result.success).to.equal(true);
                var length = result.data.appliedLeave.length;
                leaveId = result.data.appliedLeave[length - 1]._id;
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    it('cancel applied leave', function(done) {
        $.ajax({
            url: baseUrl + 'cancel',
            method: 'PUT',
            data: {
                leaveId: leaveId
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

    it('apply for a leave', function(done) {
        $.ajax({
            url: baseUrl + 'apply',
            method: 'POST',
            data: {
                startDate: new Date(),
                endDate: new Date(),
                leaveType: 1,
                reason: 'driving test'
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
     * logout employee
     */
    it('logout the employee', function(done) {
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
     * login as admin
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

    it('view all leave account', function(done) {
        $.ajax({
            url: baseUrl + 'view_all_account',
            method: 'GET',
            success: function(result) {
                expect(result.success).to.equal(true);
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    it('view applied leave applications', function(done) {
        $.ajax({
            url: baseUrl + 'view_all',
            method: 'GET',
            success: function(result) {
                expect(result.success).to.equal(true);
                leaveId = result.data.appliedLeave[0]._id;
                done();
            },
            error: function(err) {
                throw new Error('Error in connection');
            }
        });
    });

    it('manage leave request (approve)', function(done) {
        $.ajax({
            url: baseUrl + 'manage',
            method: 'PUT',
            data: {
                leaveId: leaveId,
                approved: 1
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

    it('manage leave request (reject)', function(done) {
        $.ajax({
            url: baseUrl + 'manage',
            method: 'PUT',
            data: {
                leaveId: leaveId,
                approved: 0
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

    it('update leave account (add CL/LWP)', function(done) {
        $.ajax({
            url: baseUrl + 'edit',
            method: 'PUT',
            data: {
                user: userId,
                date: new Date(),
                leaveType: 3
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
    it('logout the admin', function(done) {
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
});
