/**
 * canteenController
 *
 */
'use strict';
var lib = require('../../lib'),
    utils = require('../utils'),
    userUtil = require('../utils/userUtil'),
    canteenUtil = require('../utils/canteenUtil'),
    message = lib.message,
    Q = lib.q,
    minBalance = require('../../config').minBalanceToOrder,
    //TO_DO: need to minify from two different function to only one
    viewOrder = function(req, res) {
        var workflow = lib.workflow(req, res);
        if (req.findCriteria.startDate) {
            canteenUtil.findOrderMonth(req.findCriteria)
                .then(function(data) {
                    if (data.length > 0) {
                        workflow.outcome.data = data;
                    } else {
                        workflow.outcome.errfor.message = message.NO_ORDER_MONTH;
                    }
                    workflow.emit('response');
                }, function(err) {
                    workflow.emit('exception', err);
                });
        } else {
            canteenUtil.findOrderDay(req.findCriteria)
                .then(function(data) {
                    if (data.length) {
                        workflow.outcome.data = data;
                    } else {
                        workflow.outcome.errfor.message = message.NO_ORDER_DAY;
                    }
                    workflow.emit('response');
                }, function(err) {
                    workflow.emit('exception', err);
                });
        }

    },
    viewTransaction = function(req, res) {
        var workflow = lib.workflow(req, res);
        if (req.findCriteria.startDate) {
            canteenUtil.findTransactionMonth(req.findCriteria)
                .then(function(data) {
                    if (data.length) {
                        data = data.filter(function(transaction) {
                            return transaction.menuitem === undefined;
                        });
                        workflow.outcome.data = data;
                    } else {
                        workflow.outcome.errfor.message = message.NO_TRANSACTION_MONTH;
                    }
                    workflow.emit('response');
                }, function(err) {
                    console.log('false return', err);
                    workflow.emit('exception', err);
                });
        } else {
            canteenUtil.findTransactionDay(req.findCriteria)
                .then(function(data) {
                    if (data.length) {
                        workflow.outcome.data = data;
                    } else {
                        workflow.outcome.errfor.message = message.NO_TRANSACTION_DAY;
                    }
                    workflow.emit('response');
                }, function(err) {
                    workflow.emit('exception', err);
                });
        }

    };

module.exports = {

    /**
     *   set today's menu
     */
    addToMenu: function(req, res) {
        var workflow = lib.workflow(req, res);
        if (!req.body.item) {
            workflow.outcome.errfor.message = message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        canteenUtil.isAccountBlanced()
            .then(function(responseFlag) {
                if (responseFlag) {
                    canteenUtil.addItemToMenu(req.body.item, req.body.unitPrice)
                        .then(function(addedItem) {
                            workflow.outcome.data = addedItem;
                            workflow.outcome.message = message.MENU_SET_SUCCESSFUL;
                            workflow.emit('response');
                        }, function(err) {
                            utils.errorNotifier(err, workflow);
                        });
                } else {
                    workflow.outcome.errfor.message = message.SET_PENDING_EXPENDITURE_FIRST;
                    workflow.emit('response');
                }
            }, function(err) {
                workflow.emit('exception', err);
            });

    },

    /**
     * set price for today's menu item and deduct balance from
     *   the accounts of users enlisted for that item
     */
    deductBalance: function(req, res) {
        var workflow = lib.workflow(req, res);
        if (!req.body.menuItemId || !req.body.totalPrice) {
            workflow.outcome.errfor.message = message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        canteenUtil
            .lockItem(req.body.menuItemId, true)
            .then(function(menuItem) {
                var unitPrice;
                if (!menuItem) {
                    workflow.outcome.errfor.message = message.ITEM_NOT_FOUND;
                    workflow.emit('response');
                    return;
                }
                if (menuItem.users.length === 0) {
                    workflow.outcome.message = message.NO_ORDER_FOR_THIS_ITEM;
                    workflow.emit('response');
                    return;
                }
                unitPrice = req.body.totalPrice / menuItem.users.length;
                canteenUtil.deductBalance(menuItem, unitPrice)
                    .then(function(successfulTransactions) {
                            if (successfulTransactions.length !== menuItem.users.length) {
                                workflow.outcome.message = message.BALANCE_PARTIALLY_DEDUCTED;
                            }
                            workflow.outcome.data = successfulTransactions;
                            workflow.emit('response');
                        },
                        function(err) {
                            workflow.emit('exception', err);
                        });
            }, function(err) {
                workflow.emit('exception', err);
            });

    },

    /**
     *   get today's menu
     */
    getMenu: function(req, res) {
        var workflow = lib.workflow(req, res);
        if (req.query.date) {
            if (new Date(req.query.date) === 'Invalid Date') {
                workflow.outcome.errfor.message = message.INVALID_DATE;
                workflow.emit('response');
                return;
            }
        } else {
            req.query.date = new Date();
        }
        canteenUtil.showMenu(req.query.date)
            .then(function(menu) {
                if (!menu.length) {
                    workflow.outcome.errfor.message = message.NO_DATA;
                } else {
                    workflow.outcome.data = menu;
                }
                workflow.emit('response');
            }, function(err) {
                workflow.emit('exception', err);
            });
    },

    /**
     *   delete today's menu
     */
    deleteFromMenu: function(req, res) {
        var workflow = lib.workflow(req, res),
            menuItemId = req.body.menuItemId;
        if (!menuItemId) {
            workflow.outcome.errfor.message = message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        canteenUtil.checkItemStatus(menuItemId)
            .then(function(responseFlag) {
                if (responseFlag) {
                    workflow.outcome.errfor.message = message.CANNT_DETELE_LOCKED_ITEM;
                    workflow.emit('response');
                    return;
                }
                canteenUtil.deleteItemFromMenu(menuItemId)
                    .then(function(deletedItem) {
                        if (deletedItem) {
                            workflow.outcome.data = deletedItem;
                            workflow.outcome.message = message.MENU_DELETED_SUCCESSFUL;
                        } else {
                            workflow.outcome.errfor.message = message.MENU_DELETE_FAILED;
                        }
                        workflow.emit('response');
                    }, function(err) {
                        workflow.emit('exception', err);
                    });
            }, function(err) {
                workflow.emit('exception', err);
            });
    },

    /*
     * get available item names
     */
    availableItemList: function(req, res) {
        var workflow = lib.workflow(req, res);

        canteenUtil.getListOfItems()
            .then(function(itemList) {
                workflow.outcome.data = itemList;
                workflow.emit('response');
            }, function(err) {
                workflow.emit('exception', err);
            });
    },

    /**
     *   lock menu item
     */
    lockItem: function(req, res) {
        var workflow = lib.workflow(req, res);
        if (!req.body.menuItemId) {
            workflow.outcome.errfor.message = message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        req.body.lock = (req.body.lock === undefined) ? true : req.body.lock;
        canteenUtil.lockItem(req.body.menuItemId, req.body.lock)
            .then(function(item) {
                if (item) {
                    workflow.outcome.data = item;
                    workflow.outcome.message = message.ITEM_LOCK_SUCCESSFUL;
                } else {
                    workflow.outcome.errfor.message = message.ITEM_NOT_FOUND;
                }
                workflow.emit('response');
            }, function(err) {
                workflow.emit('exception', err);
            });
    },

    /**
     *  order an item by a user
     */
    orderItem: function(req, res) {
        var workflow = lib.workflow(req, res),
            successCount = 0,
            errCount = 0,
            resultArray = [],
            responceSent = false;


        canteenUtil.checkCurrentBalance(req.user._id)
            .then(function(balanceObj) {

                //checking current balance with minimum 
                if (balanceObj[0].value <= minBalance) {
                    workflow.outcome.errfor.message = message.ORDER_SET_RULE;
                    workflow.emit('response');
                    return;
                }
                req.body.items.forEach(function(item) {

                    //check menu item is locked or not
                    canteenUtil.checkItemStatus(item)
                        .then(function(itemStatus) {
                            if (!itemStatus) {
                                return canteenUtil.enlistUser(item, req.user._id)
                            } else {
                                var deferred = Q.defer();
                                deferred.resolve();
                                return deferred.promise;
                            }
                        }, function() {
                            var deferred = Q.defer();
                            deferred.reject();
                            return deferred.promise;
                        })
                        .then(function(data) {
                                resultArray.push(data);
                                successCount++;
                            },
                            function() {
                                errCount++;
                            })
                        .done(function() {
                            if ((successCount + errCount) === req.body.items.length) {
                                if (!responceSent) {
                                    responceSent = true;
                                    if (errCount && successCount > 0) {
                                        workflow.outcome.data = resultArray;
                                        workflow.outcome.message = message.ORDER_PARTIAL_SUCCESSFUL;
                                    } else if (successCount) {
                                        workflow.outcome.data = resultArray;
                                        workflow.outcome.message = message.ORDER_SUCCESSFUL;
                                    } else {
                                        workflow.outcome.errfor.message = message.ORDER_FAILED;
                                    }
                                    workflow.emit('response');
                                }
                            }
                        });
                });
            }, function(err) {
                workflow.emit('exception', err);

            });

    },

    /**
     *  view order history by a user day basis and month basis
     */
    viewOrderHistory: function(req, res) {
        req.findCriteria.senderId = req.user._id;
        viewOrder(req, res);
    },

    /**
     *  view order history of all user day basis and month basis
     */
    viewOrderHistoryEveryone: function(req, res) {
        viewOrder(req, res);
    },

    /**
     *  cancel order of an user
     */
    cancelOrder: function(req, res) {
        var workflow = lib.workflow(req, res);

        //check menu item is locked or not
        canteenUtil.checkItemStatus(req.body.item)
            .then(function(itemStatus) {
                if (!itemStatus) {
                    return canteenUtil.dischargeUser(req.body.item, req.user._id)
                } else {
                    workflow.outcome.errfor.message = message.ORDER_CANCEL_RULE;
                    var deferred = Q.defer();
                    deferred.reject();
                    return deferred.promise;
                }
            }, function(err) {
                var deferred = Q.defer();
                deferred.reject(err);
                return deferred.promise;
            })
            .then(function(data) {
                    if (data) {
                        workflow.outcome.data = data;
                        workflow.outcome.message = message.ORDER_CANCEL_SUCCESSFUL;
                    } else {
                        workflow.outcome.errfor.message = message.NO_DATA;
                    }
                    workflow.emit('response');
                },
                function(err) {
                    workflow.emit(exception, err);
                });

    },

    /**
     *  make payment of an user by admin/manager
     */
    makePayment: function(req, res) {
        var workflow = lib.workflow(req, res);

        userUtil.checkUser(req.payment.user)
            .then(function(user) {
                if (user) {
                    return canteenUtil.saveTransaction(req.payment);
                } else {
                    var deferred = Q.defer();
                    deferred.resolve();
                    return deferred.promise;
                }
            }, function(err) {
                var deferred = Q.defer();
                deferred.reject(err);
                return deferred.promise;
            })
            .then(function(payment) {
                if (payment) {
                    workflow.outcome.data = payment;
                    workflow.outcome.message = message.PAYMENT_SUCCESSFUL;
                } else {
                    workflow.outcome.errfor.message = message.USER_NOT_EXIST;
                }
                workflow.emit('response');
            }, function(err) {
                workflow.emit('exception', err);
            });
    },

    /**
     *  edit payment of an user by admin/manager
     */
    editPayment: function(req, res) {
        var workflow = lib.workflow(req, res);

        userUtil.checkUser(req.payment.user)
            .then(function(user) {
                if (user) {
                    return canteenUtil.editTransaction(req.payment)
                } else {
                    var deferred = Q.defer();
                    deferred.resolve();
                    return deferred.promise;
                }
            }, function(err) {
                var deferred = Q.defer();
                deferred.reject(err);
                return deferred.promise;
            })
            .then(function(payment) {
                if (payment) {
                    workflow.outcome.data = payment;
                    workflow.outcome.message = message.PAYMENT_EDIT_SUCCESSFUL;
                } else {
                    workflow.outcome.errfor.message = message.USER_NOT_EXIST;
                }
                workflow.emit('response');
            }, function(err) {
                workflow.emit(exception, err);
            });
    },

    /**
     *  view transaction history by a user day basis and month basis
     */
    viewTransactionHistory: function(req, res) {
        req.findCriteria.senderId = req.user._id;
        viewTransaction(req, res);
    },

    /**
     *  view transaction history of all user day basis and month basis
     */
    viewTransactionHistoryEveryone: function(req, res) {
        viewTransaction(req, res);
    },

    /**
     *  show current balance of a user
     */
    showCurrentBalance: function(req, res) {
        var workflow = lib.workflow(req, res);

        canteenUtil.checkCurrentBalance(req.user._id)
            .then(function(balanceObjArray) {
                if (balanceObjArray) {
                    workflow.outcome.data = balanceObjArray[0];
                } else {
                    workflow.outcome.errfor.message = message.NO_TRANSACTION;
                }
                workflow.emit('response');
            }, function(err) {
                workflow.emit('exception', err);
            });
    },

    /**
     *  show current balance of every user
     */
    showCurrentBalanceEveryone: function(req, res) {
        var workflow = lib.workflow(req, res);

        canteenUtil.checkCurrentBalance()
            .then(function(balanceObjArray) {
                if (balanceObjArray.length) {
                    workflow.outcome.data = balanceObjArray;
                } else {
                    workflow.outcome.errfor.message = message.NO_TRANSACTION;
                }
                workflow.emit('response');
            }, function(err) {
                workflow.emit('exception', err);
            });
    }
};
