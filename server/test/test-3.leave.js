'use strict';

describe('Leave module test', function() {
    var expect = require('chai').expect,
        baseUrl = 'localhost:8000/api/leave/',
        requestAdmin = require('superagent').agent(),
        requestEmployee = require('superagent').agent(),
        leaveId, userId;

    /*
     * login as employee
     */
    it('login as employee', function(done) {
        requestEmployee
            .post('localhost:8000/api/login')
            .send({
                username: 'asis.datta@innofied.com',
                password: 'asis',
                secure: false
            })
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.equal(true);
                userId = res.body.data._id;
                done();
            });
    });
    /*
     * login as admin
     */
    it('login as admin', function(done) {
        requestAdmin
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
     * leave management
     */
    describe('leave management', function() {
        this.timeout(15000);

        it('apply for a leave', function(done) {
            requestEmployee
                .post(baseUrl + 'apply')
                .send({
                    startDate: new Date(),
                    endDate: new Date(),
                    leaveType: 1,
                    reason: 'driving test'
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

        it('view leave account and applied leave', function(done) {
            requestEmployee
                .get(baseUrl + 'details')
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    var length = res.body.data.appliedLeave.length;
                    leaveId = res.body.data.appliedLeave[length - 1]._id;
                    done();
                });
        });

        it('cancel applied leave', function(done) {
            requestEmployee
                .put(baseUrl + 'cancel')
                .send({
                    leaveId: leaveId
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

        it('apply for a leave', function(done) {
            requestEmployee
                .post(baseUrl + 'apply')
                .send({
                    startDate: new Date(),
                    endDate: new Date(),
                    leaveType: 1,
                    reason: 'driving test'
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

        it('view all leave account', function(done) {
            requestAdmin
                .get(baseUrl + 'view_all_account')
                .end(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('view applied leave applications', function(done) {
            requestAdmin
                .get(baseUrl + 'view_all')
                .end(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    leaveId = res.body.data.appliedLeave[0]._id;
                    done();
                });
        });

        it('manage leave request (approve)', function(done) {
            requestAdmin
                .put(baseUrl + 'manage')
                .send({
                    leaveId: leaveId,
                    approved: 1
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

        it('manage leave request (reject)', function(done) {
            requestAdmin
                .put(baseUrl + 'manage')
                .send({
                    leaveId: leaveId,
                    approved: 0
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

        it('update leave account (add CL/LWP)', function(done) {
            requestAdmin
                .put(baseUrl + 'edit')
                .send({
                    user: userId,
                    date: new Date(),
                    leaveType: 3
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
        it('logout the admin', function(done) {
            requestAdmin
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
         * logout employee
         */
        it('logout the employee', function(done) {
            requestEmployee
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

    });

});
