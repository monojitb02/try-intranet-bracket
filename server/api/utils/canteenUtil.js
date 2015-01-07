'use strict';

var Q = require('../../lib').q,
    menuitemModel = require('../models/menuitem'),
    transactionModel = require('../models/transaction'),
    updateItem = function(queryObj, updateObj) {
        var deferred = Q.defer();
        menuitemModel
            .findOneAndUpdate(queryObj, updateObj)
            .exec(function(err, updated) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(updated);
                }
            });
        return deferred.promise;
    },
    findByDate = function(model, queryObj) {
        var deferred = Q.defer();
        model
            .find(queryObj)
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    },
    addTransaction = function(transaction) {
        var deferred = Q.defer();
        if (transaction.menuitem) {
            transactionModel
                .findOneAndUpdate({
                    user: transaction.user,
                    menuitem: transaction.menuitem
                }, transaction)
                .exec(function(err, updatedTransaction) {
                    if (err) {
                        deferred.reject(err);
                    } else if (updatedTransaction) {
                        deferred.resolve(updatedTransaction);
                    } else {
                        new transactionModel(transaction)
                            .save(function(err, data) {
                                if (err) {
                                    deferred.reject(err);
                                } else {
                                    deferred.resolve(data);
                                }
                            });
                    }
                });
        } else {
            new transactionModel(transaction)
                .save(function(err, data) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(data);
                    }
                });
        }
        return deferred.promise;
    };

module.exports = {

    /*
     * add the user id to the order list
     */
    enlistUser: function(menuId, senderId) {
        return updateItem({
            _id: menuId
        }, {
            $addToSet: {
                users: senderId
            }
        });
    },

    /*
     * remove the user id from the order list
     */
    dischargeUser: function(menuId, senderId) {
        return updateItem({
            _id: menuId

        }, {
            $pull: {
                users: senderId
            }
        });
    },

    /*
     * checks current balance with given user id of a user
     */
    checkCurrentBalance: function(senderId) {
        var deferred = Q.defer(),
            mapObject = {
                map: function() {
                    emit(this.user, this.amount);
                },
                reduce: function(key, values) {
                    return Array.sum(values);
                }
            };
        if (senderId) {
            mapObject.query = {
                user: senderId
            }
        }
        transactionModel.mapReduce(mapObject,
            function(err, result) { //TO_DO : know the format returned
                if (err) {
                    deferred.reject(err);
                } else {
                    if (result.length === 0) {
                        deferred.resolve(0);
                    } else {
                        deferred.resolve(result);
                    }
                }
            });
        return deferred.promise;
    },

    /*
     * checks if menu item is locked or not
     */
    checkItemStatus: function(menuId) {
        var deferred = Q.defer();
        menuitemModel
            .findOne({
                _id: menuId
            })
            .exec(function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else if (data) {
                    deferred.resolve(data.lock);
                } else {
                    deferred.resolve();
                }
            });
        return deferred.promise;
    },

    /*
     * add new payment to transaction collection
     */
    saveTransaction: addTransaction,

    /*
     * edit a payment in transaction collection
     */
    editTransaction: function(payment) {
        var deferred = Q.defer();

        transactionModel.findOneAndUpdate({
                _id: payment.paymentId

            }, {
                $set: {
                    user: payment.user,
                    amount: payment.amount
                }
            })
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    },
    /*
     * finds order month wise for single/multiple user
     */
    findOrderMonth: function(findCriteria) {
        var findQuery = {
            date: {
                $gte: findCriteria.startDate,
                $lte: findCriteria.endDate
            }
        };
        if (findCriteria.senderId) {
            findQuery.users = findCriteria.senderId;
        }
        return findByDate(menuitemModel, findQuery);
    },

    /*
     * finds order date wise for single/multiple user
     */
    findOrderDay: function(findCriteria) {
        var findQuery = {
            date: findCriteria.date
        };
        if (findCriteria.senderId) {
            findQuery.users = findCriteria.senderId;
        };
        return findByDate(menuitemModel, findQuery);
    },

    /*
     * finds transaction month wise for singlr/multiple user
     */
    findTransactionMonth: function(findCriteria) {
        var findQuery = {
            date: {
                $gte: findCriteria.startDate,
                $lte: findCriteria.endDate
            }
        };
        if (findCriteria.senderId) {
            findQuery.user = findCriteria.senderId;
        }
        return findByDate(transactionModel, findQuery);
    },

    /*
     * finds own transaction date wise for singlr/multiple user
     */
    findTransactionDay: function(findCriteria) {
        var findQuery = {
            date: findCriteria.date
        };
        if (findCriteria.senderId) {
            findQuery.user = findCriteria.senderId;
        };
        return findByDate(transactionModel, findQuery);
    },

    /*
     * Checks if there any balance deduction for specefic day (yesterday/today)
     * value of dateSelector represents yesterday if -ve or today if +ve
     */

    // FIX_ME: not ok;
    isAccountBlanced: function() {
        var deferred = Q.defer(),
            today = new Date(new Date().setHours(0, 0, 0, 0));

        // get date from menu history then verify transaction history for that date
        menuitemModel
            .findOne({
                date: {
                    $lte: today
                },
                lock: true
            })
            .sort('-date')
            .exec(function(err, menu) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (menu) {
                        transactionModel
                            .find({
                                menuitem: menu._id
                            })
                            .exec(function(err, transactions) {
                                if (err) {
                                    deferred.reject(err);
                                } else if (transactions.length) {
                                    deferred.resolve(true);
                                } else {
                                    deferred.resolve(false);
                                }
                            });
                    } else {
                        deferred.resolve(true);
                    }
                }
            });
        return deferred.promise;
    },

    /*
     * add item to today's menu
     */
    addItemToMenu: function(menuItem, unitPrice) {
        var deferred = Q.defer();

        if (typeof(menuItem) === 'string') {
            menuItem = menuItem.trim().toUpperCase();
        }
        new menuitemModel({
                date: new Date(new Date().setHours(0, 0, 0, 0)),
                itemName: menuItem,
                unitPrice: unitPrice || 0
            })
            .save(function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(data);
                }
            });
        return deferred.promise;
    },

    /*
     * get Today's menu items
     */
    showMenu: function(date) {
        var deferred = Q.defer();
        menuitemModel
            .find({
                date: new Date(date.setHours(0, 0, 0, 0))
            })
            .exec(function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(data);
                }
            });
        return deferred.promise;
    },

    /*
     * get details of menu item
     */
    getMenuItem: function(menuItemId) {
        var deferred = Q.defer();
        menuitemModel
            .find({
                _id: menuItemId
            })
            .exec(function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(data);
                }
            });
        return deferred.promise;
    },

    /*
     * remove item from today's menu
     */
    deleteItemFromMenu: function(menuItemId) {
        var deferred = Q.defer();
        menuitemModel
            .findOneAndRemove({
                _id: menuItemId
            })
            .exec(function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(data);
                }
            });
        return deferred.promise;
    },

    /*
     * get available item names
     */
    getListOfItems: function() {
        var deferred = Q.defer();
        menuitemModel
            .distinct('itemName')
            .exec(function(err, itemNames) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(itemNames);
                }
            });
        return deferred.promise;
    },

    /**
     *  Set unit price of an item
     */
    setUnitPriceOfItem: function(menuItemId, unitPrice) {
        return updateItem({
            _id: menuItemId,
        }, {
            $set: {
                unitPrice: unitPrice
            }
        });
    },

    /**
     *   Lock or unlock an item
     */
    lockItem: function(menuItemId, lock) {
        return updateItem({
            _id: menuItemId,
        }, {
            $set: {
                lock: lock
            }
        });
    },
    deductBalance: function(menuItem, unitPrice) {
        var deferred = Q.defer();

        // Set unit price of an item
        updateItem({
            _id: menuItem._id,
        }, {
            $set: {
                unitPrice: unitPrice
            }
        }).then(function() {
            var successfulTransactions = [],
                errors = [],
                finished = false;

            if (menuItem.users.length) {
                menuItem.users.forEach(function(userId) {
                    addTransaction({
                            user: userId,
                            date: new Date(new Date().setHours(0, 0, 0, 0)),
                            amount: (0 - unitPrice),
                            menuitem: menuItem._id
                        })
                        .then(function(transactionData) {
                            successfulTransactions.push(transactionData);
                        }, function(err) {
                            errors.push(err);
                        })
                        .done(function() {
                            if (!finished) {
                                finished = true;
                                if (menuItem.users.length === errors.length) {
                                    deferred.reject(errors);
                                } else {
                                    deferred.resolve(successfulTransactions);
                                }

                            }
                        });
                });
            } else {
                deferred.resolve(successfulTransactions);
            }
        }, function(err) {
            deferred.reject(err);
        });

        /*                if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(itemNames);
                        }*/
        return deferred.promise;
    }

};
