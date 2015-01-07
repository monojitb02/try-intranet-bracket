'use strict';


describe.skip('Canteen Menu test', function() {
    var baseUrl = 'http://localhost:8000/api/canteen/';

    it('login as admin', function(done) {
        this.timeout(5000);
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
     *CRUDE operations on menu
     */
    describe.skip('CRUDE operations on menu', function() {
        var itemName = 'CHICKEN ROLL',
            menuItemId;
        this.timeout(15000);

        it('set today\'s item - ' + itemName, function(done) {
            $.ajax({
                url: baseUrl + 'set_item',
                method: 'POST',
                data: {
                    item: itemName
                },
                success: function(result) {
                    expect(result.success).to.equal(true);
                    //expect(result.message).to.equal('Menu set successfully.');
                    done();
                },
                error: function(err) {
                    throw new Error('Error in connection');
                }
            });
        });

        it('Get item list in menu and check ' + itemName + ' exists in the list or not', function(done) {
            $.ajax({
                url: baseUrl + 'menu_list',
                method: 'GET',
                success: function(result) {
                    expect(result.success).to.equal(true);
                    expect(result.data).to.include(itemName);
                    done();
                },
                error: function(err) {
                    throw new Error('Error in connection');
                }
            });
        });

        it('Get today\'s menu and check ' + itemName + ' exists in the list or not', function(done) {
            $.ajax({
                url: baseUrl + 'current_menu',
                method: 'GET',
                success: function(result) {
                    var menuItem;
                    expect(result.success).to.equal(true);
                    menuItem = result.data.filter(function(menu) {
                        return menu.itemName === itemName;
                    })[0];
                    if (menuItem) {
                        menuItemId = menuItem._id;
                    }
                    expect(menuItem).to.have.deep.property('itemName', itemName);
                    done();
                },
                error: function(err) {
                    throw new Error('Error in connection');
                }
            });
        });

        it('Lock ' + itemName + ' from today\'s menu', function(done) {
            $.ajax({
                url: baseUrl + 'lock_item',
                method: 'PUT',
                data: {
                    menuItemId: menuItemId,
                    lock: true
                },
                success: function(result) {
                    var menuItem;
                    expect(result.success).to.equal(true);
                    expect(result.data.lock).to.equal(true);
                    done();
                },
                error: function(err) {
                    throw new Error('Error in connection');
                }
            });
        });

        it('Remove lock ' + itemName + ' from today\'s menu', function(done) {
            $.ajax({
                url: baseUrl + 'lock_item',
                method: 'PUT',
                data: {
                    menuItemId: menuItemId,
                    lock: false
                },
                success: function(result) {
                    var menuItem;
                    expect(result.success).to.equal(true);
                    expect(result.data.lock).to.equal(false);
                    done();
                },
                error: function(err) {
                    throw new Error('Error in connection');
                }
            });
        });

        it('Remove ' + itemName + ' from today\'s menu', function(done) {
            $.ajax({
                url: baseUrl + 'delete_item',
                method: 'PUT',
                data: {
                    menuItemId: menuItemId
                },
                success: function(result) {
                    expect(result.success).to.equal(true);
                    // expect(result.message).to.equal('Menu deleted successfully.');
                    done();
                },
                error: function(err) {
                    throw new Error('Error in connection');
                }
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
            $.ajax({
                url: baseUrl + 'set_item',
                method: 'POST',
                data: {
                    item: 'MAGGIE'
                },
                success: function(result) {
                    expect(result.success).to.equal(true);
                    // menuItemIds.push(result.data._id);
                    //expect(result.message).to.equal('Menu set successfully.');
                    done();
                },
                error: function(err) {
                    throw new Error('Error in connection');
                }
            });
        });

        it('set today\'s item - ' + 'BUTTER MAGGIE', function(done) {
            $.ajax({
                url: baseUrl + 'set_item',
                method: 'POST',
                data: {
                    item: 'BUTTER MAGGIE'
                },
                success: function(result) {
                    expect(result.success).to.equal(true);
                    // menuItemIds.push(result.data._id);
                    //expect(result.message).to.equal('Menu set successfully.');
                    done();
                },
                error: function(err) {
                    throw new Error('Error in connection');
                }
            });
        });


        it('Get today\'s menu', function(done) {
            $.ajax({
                url: baseUrl + 'current_menu',
                method: 'GET',
                success: function(result) {
                    var menuItem;
                    expect(result.success).to.equal(true);
                    menuItemIds = result.data.map(function(menu) {
                        return menu._id;
                    })
                    done();
                },
                error: function(err) {
                    throw new Error('Error in connection');
                }
            });
        });


        it('sets order for today\'s items', function(done) {
            $.ajax({
                url: baseUrl + 'set_order',
                method: 'PUT',
                data: {
                    items: menuItemIds
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

        it('views order history for current user for particular date', function(done) {
            $.ajax({
                url: baseUrl + 'view_order',
                method: 'GET',
                data: {
                    date: new Date().setHours(0, 0, 0, 0)
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

        it('views order history for current user for particular month', function(done) {
            $.ajax({
                url: baseUrl + 'view_order',
                method: 'GET',
                data: {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth()
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

        it('views order history for all user for particular date', function(done) {
            $.ajax({
                url: baseUrl + 'view_order_everyone',
                method: 'GET',
                data: {
                    date: new Date().setHours(0, 0, 0, 0)
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

        it('views order history for all user for particular month', function(done) {
            $.ajax({
                url: baseUrl + 'view_order_everyone',
                method: 'GET',
                data: {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth()
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

        it('cancel order for a particular item', function(done) {
            $.ajax({
                url: baseUrl + 'cancel_order',
                method: 'PUT',
                data: {
                    item: menuItemIds[0]
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

        it('Deduct balance for item from user\'s account', function(done) {
            $.ajax({
                url: baseUrl + 'deduct_balance',
                method: 'PUT',
                data: {
                    menuItemId: menuItemIds[1],
                    totalPrice: 50
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

        it('Remove lock from today\'s menu', function(done) {
            $.ajax({
                url: baseUrl + 'lock_item',
                method: 'PUT',
                data: {
                    menuItemId: menuItemIds[1],
                    lock: false
                },
                success: function(result) {
                    expect(result.success).to.equal(true);
                    expect(result.data.lock).to.equal(false);
                    done();
                },
                error: function(err) {
                    throw new Error('Error in connection');
                }
            });
        });

        it('Remove items from today\'s menu', function(done) {
            var finished = false,
                count = 0;
            menuItemIds.forEach(function(menuId) {
                $.ajax({
                    url: baseUrl + 'delete_item',
                    method: 'PUT',
                    data: {
                        menuItemId: menuId
                    },
                    success: function(result) {
                        count++;
                        expect(result.success).to.equal(true);
                        if (!finished && count === menuItemIds.length) {
                            finished = true;
                            done();
                        }
                    },
                    error: function(err) {
                        throw new Error('Error in connection');
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
            $.ajax({
                url: baseUrl + 'make_payment',
                method: 'POST',
                data: {
                    user: '542a3a5aed25bb350faef507',
                    amount: 100
                },
                success: function(result) {
                    paymentId = result.data._id;
                    expect(result.success).to.equal(true);
                    done();
                },
                error: function(err) {
                    throw new Error('Error in connection');
                }
            });
        });

        it('views transaction history for current user for particular date', function(done) {
            $.ajax({
                url: baseUrl + 'view_payment',
                method: 'GET',
                data: {
                    date: new Date().setHours(0, 0, 0, 0)
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

        it('views transaction history for current user for particular month', function(done) {
            $.ajax({
                url: baseUrl + 'view_payment',
                method: 'GET',
                data: {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth()
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

        it('views transaction history for all user for particular date', function(done) {
            $.ajax({
                url: baseUrl + 'view_payment_everyone',
                method: 'GET',
                data: {
                    date: new Date().setHours(0, 0, 0, 0)
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

        it('views transaction history for all user for particular month', function(done) {
            $.ajax({
                url: baseUrl + 'view_payment_everyone',
                method: 'GET',
                data: {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth()
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

        it('edit a particular payment', function(done) {
            $.ajax({
                url: baseUrl + 'edit_payment',
                method: 'PUT',
                data: {
                    paymentId: paymentId,
                    user: '542a3a5aed25bb350faef507',
                    amount: 50
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

        it('shows current balance of logged in user', function(done) {
            $.ajax({
                url: baseUrl + 'show_current_balance',
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

        it('shows current balance of all user', function(done) {
            $.ajax({
                url: baseUrl + 'show_current_balance_everyone',
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
    });
});
