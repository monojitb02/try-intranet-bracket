'use strict';

var expect = require('chai').expect,
    baseUrl = 'localhost:8000/api/canteen/',
    request = require('superagent').agent();

describe('Canteen Menu test', function() {
    /*
     * login user
     */
    it('login as admin', function(done) {
        request
            .post('localhost:8000/api/login')
            .send({
                username: 'sandip.saha@innofied.com',
                password: '2cb6f36ec7f3b88d5574c78a31ccecd5',
                secure: true
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
     *CRUDE operations on menu
     */
    describe('CRUDE operations on menu', function() {
        var itemName = 'CHICKEN ROLL',
            menuItemId;
        this.timeout(15000);

        it('set today\'s item - ' + itemName, function(done) {
            request
                .post(baseUrl + 'set_item')
                .send({
                    item: itemName
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

        it('Get item list in menu and check ' + itemName + ' exists in the list or not', function(done) {
            request
                .get(baseUrl + 'menu_list')
                .end(function(res) {
                    var body = res.body;
                    expect(res.statusCode).to.equal(200);
                    expect(body.success).to.equal(true);
                    expect(body.data).to.include(itemName);
                    done();
                });
        });

        it('Get today\'s menu and check ' + itemName + ' exists in the list or not', function(done) {
            request
                .get(baseUrl + 'current_menu')
                .end(function(res) {
                    var body = res.body,
                        menuItem;
                    expect(res.statusCode).to.equal(200);
                    expect(body.success).to.equal(true);
                    menuItem = body.data.filter(function(menu) {
                        return menu.itemName === 'CHICKEN ROLL';
                    })[0];
                    if (menuItem) {
                        menuItemId = menuItem._id;
                    }
                    expect(menuItem).to.have.deep.property('itemName', 'CHICKEN ROLL');
                    done();
                });
        });

        it('Lock ' + itemName + ' from today\'s menu', function(done) {
            request
                .put(baseUrl + 'lock_item')
                .send({
                    menuItemId: menuItemId,
                    lock: true
                })
                .end(function(res) {
                    var body = res.body;
                    expect(res.statusCode).to.equal(200);
                    expect(body.success).to.equal(true);
                    expect(body.data.lock).to.equal(true);
                    done();
                });
        });

        it('Remove lock ' + itemName + ' from today\'s menu', function(done) {
            request
                .put(baseUrl + 'lock_item')
                .send({
                    menuItemId: menuItemId,
                    lock: false
                })
                .end(function(res) {
                    var body = res.body;
                    expect(res.statusCode).to.equal(200);
                    expect(body.success).to.equal(true);
                    expect(body.data.lock).to.equal(false);
                    done();
                });
        });

        it('Remove ' + itemName + ' from today\'s menu', function(done) {
            request
                .put(baseUrl + 'delete_item')
                .send({
                    menuItemId: menuItemId
                })
                .end(function(res) {
                    var body = res.body;
                    expect(res.statusCode).to.equal(200);
                    expect(body.success).to.equal(true);
                    done();
                });
        });

    });

    /*
     * Manages order of menu item
     */
    describe('Manages order of menu item', function() {
        var menuItemIds = [];
        this.timeout(15000);

        it('set today\'s item - ' + 'MAGGIE', function(done) {
            request
                .post(baseUrl + 'set_item')
                .send({
                    item: 'MAGGIE'
                })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    // menuItemIds.push(res.body.data._id);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('set today\'s item - ' + 'BUTTER MAGGIE', function(done) {
            request
                .post(baseUrl + 'set_item')
                .send({
                    item: 'BUTTER MAGGIE'
                })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    // menuItemIds.push(res.body.data._id);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('Get today\'s menu', function(done) {
            request
                .get(baseUrl + 'current_menu')
                .end(function(res) {
                    var body = res.body,
                        menuItem;
                    expect(res.statusCode).to.equal(200);
                    expect(body.success).to.equal(true);
                    menuItemIds = body.data.map(function(menu) {
                        return menu._id;
                    })
                    done();
                });
        });


        it('sets order for today\'s items', function(done) {
            request
                .put(baseUrl + 'set_order')
                .send({
                    items: menuItemIds
                })
                .end(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('views order history for current user for particular date', function(done) {
            request
                .get(baseUrl + 'view_order')
                .query({
                    date: new Date().setHours(0, 0, 0, 0)
                })
                .end(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('views order history for current user for particular month', function(done) {
            request
                .get(baseUrl + 'view_order')
                .query({
                    year: new Date().getFullYear(),
                    month: new Date().getMonth()
                })
                .end(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('views order history for all user for particular date', function(done) {
            request
                .get(baseUrl + 'view_order_everyone')
                .query({
                    date: new Date().setHours(0, 0, 0, 0)
                })
                .end(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('views order history for all user for particular month', function(done) {
            request
                .get(baseUrl + 'view_order_everyone')
                .query({
                    year: new Date().getFullYear(),
                    month: new Date().getMonth()
                })
                .end(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('cancel order for a particular item', function(done) {
            request
                .put(baseUrl + 'cancel_order')
                .send({
                    item: menuItemIds[0]
                })
                .end(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('Deduct balance for item from user\'s account', function(done) {
            request
                .put(baseUrl + 'deduct_balance')
                .send({
                    menuItemId: menuItemIds[1],
                    totalPrice: 50
                })
                .end(function(res) {
                    var body = res.body;
                    expect(res.statusCode).to.equal(200);
                    expect(body.success).to.equal(true);
                    done();
                });
        });

        it('Remove lock from today\'s menu', function(done) {
            request
                .put(baseUrl + 'lock_item')
                .send({
                    menuItemId: menuItemIds[1],
                    lock: false
                })
                .end(function(res) {
                    var body = res.body;
                    expect(res.statusCode).to.equal(200);
                    expect(body.success).to.equal(true);
                    done();
                });
        });

        it('Remove items from today\'s menu', function(done) {
            var finished = false,
                count = 0;
            menuItemIds.forEach(function(menuId) {
                request
                    .put(baseUrl + 'delete_item')
                    .send({
                        menuItemId: menuId
                    })
                    .end(function(res) {
                        count++;
                        var body = res.body;
                        expect(res.statusCode).to.equal(200);
                        expect(body.success).to.equal(true);
                        if (!finished && count === menuItemIds.length) {
                            finished = true;
                            done();
                        }
                    });
            });
        });

    });

    /*
     * Manages transactions
     */
    describe('Manages transactions', function() {
        var paymentId;
        this.timeout(15000);

        it('take a payment of a particular user', function(done) {
            request
                .post(baseUrl + 'make_payment')
                .send({
                    user: '542a3a5aed25bb350faef507',
                    amount: 100
                })
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    paymentId = res.body.data._id;
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('views transaction history for current user for particular date', function(done) {
            request
                .get(baseUrl + 'view_payment')
                .query({
                    date: new Date().setHours(0, 0, 0, 0)
                })
                .end(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('views transaction history for current user for particular month', function(done) {
            request
                .get(baseUrl + 'view_payment')
                .query({
                    year: new Date().getFullYear(),
                    month: new Date().getMonth()
                })
                .end(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('views transaction history for all user for particular date', function(done) {
            request
                .get(baseUrl + 'view_payment_everyone')
                .query({
                    date: new Date().setHours(0, 0, 0, 0)
                })
                .end(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('views transaction history for all user for particular month', function(done) {
            request
                .get(baseUrl + 'view_payment_everyone')
                .query({
                    year: new Date().getFullYear(),
                    month: new Date().getMonth()
                })
                .end(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('edit a particular payment', function(done) {
            request
                .put(baseUrl + 'edit_payment')
                .send({
                    paymentId: paymentId,
                    user: '542a3a5aed25bb350faef507',
                    amount: 50
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

        it('shows current balance of logged in user', function(done) {
            request
                .get(baseUrl + 'show_current_balance')
                .end(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });

        it('shows current balance of all user', function(done) {
            request
                .get(baseUrl + 'show_current_balance_everyone')
                .end(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });
    });

    // /*
    //  * logout user
    //  */
    // it('logout the admin', function(done) {
    //     request
    //         .post('localhost:8000/api/logout')
    //         .end(function(err, res) {
    //             if (err) {
    //                 throw err;
    //             }
    //             expect(res.statusCode).to.equal(200);
    //             expect(res.body.success).to.equal(true);
    //             done();
    //         });
    // });
});
