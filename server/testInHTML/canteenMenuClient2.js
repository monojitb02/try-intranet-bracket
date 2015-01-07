'use strict';
var baseUrl = 'localhost:8000/api/canteen/';

describe('Canteen Menu test', function() {

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
                    var body;
                    if (err) {
                        throw err;
                    }
                    body = res.body;
                    expect(res.statusCode).to.equal(200);
                    expect(body.success).to.equal(true);
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

        it('sets order for today\'s items', function(done) {
            request
                .put(baseUrl + 'set_order')
                .send({
                    items: [menuItemId]
                })
                .end(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
                    done();
                });
        });
        it('Deduct balance for ' + itemName + ' from user\'s account', function(done) {
            request
                .put(baseUrl + 'deduct_balance')
                .send({
                    menuItemId: menuItemId,
                    totalPrice: 5
                })
                .end(function(res) {
                    var body = res.body;
                    expect(res.statusCode).to.equal(200);
                    expect(body.success).to.equal(true);
                    //expect(body.data).to.equal(true);
                    done();
                });
        });

        it('Deduct balance for ' + itemName + ' again from user\'s account', function(done) {
            request
                .put(baseUrl + 'deduct_balance')
                .send({
                    menuItemId: menuItemId,
                    totalPrice: 10
                })
                .end(function(res) {
                    var body = res.body;
                    expect(res.statusCode).to.equal(200);
                    expect(body.success).to.equal(true);
                    //expect(body.data).to.equal(true);
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
    describe.skip('Manages order of menu item', function() {
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
                    menuItemIds.push(res.body.data._id);
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
                    menuItemIds.push(res.body.data._id);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.success).to.equal(true);
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

        it('Remove items from today\'s menu', function(done) {
            menuItemIds.forEach(function(menuId) {
                request
                    .put(baseUrl + 'delete_item')
                    .send({
                        menuItemId: menuId
                    })
                    .end(function(res) {
                        var body = res.body;
                        expect(res.statusCode).to.equal(200);
                        expect(body.success).to.equal(true);
                        done();
                    });
            });
        });

    });
});
