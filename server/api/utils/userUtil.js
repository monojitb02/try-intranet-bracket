'use strict';
var lib = require('../../lib'),
    fs = lib.fsExtra,
    userModel = require('../models/user'),
    companyModel = require('../models/company'),
    loginAttemptModel = require('../models/loginAttempt'),
    leaveModel = require('../models/leave'),
    leaveUtils = require('./leaveUtil'),
    getSubordinates = function(ids) {
        var deferred = lib.q.defer(),
            subordinates = [];
        userModel
            .find({
                'companyProfile.manager': {
                    $in: ids
                }
            })
            .select('_id')
            .exec(function(err, users) {
                if (users && users.length !== 0) {
                    users.forEach(function(user) {
                        subordinates.push(user._id);
                    });
                    getSubordinates(subordinates)
                        .done(function(data) {
                            subordinates = lib._.union(subordinates, data);
                            deferred.resolve(lib._.uniq(subordinates));
                        });
                } else {
                    deferred.resolve(subordinates);
                }
            });
        return deferred.promise;
    },
    getAll = function(company) {
        var deferred = lib.q.defer(),
            userIds = [];
        userModel
            .find({
                'companyProfile.company': company
            })
            .select('_id')
            .exec(function(err, users) {
                if (err) {
                    deferred.reject(err);
                } else {
                    users.forEach(function(user) {
                        userIds.push(user._id);
                    });
                    deferred.resolve(userIds);
                }
            });
        return deferred.promise;
    };
module.exports = {
    /**
     * utils
     */
    getSubordinates: getSubordinates,
    getAll: getAll,
    findOne: function(userId) {
        var deferred = lib.q.defer();
        userModel
            .findOne({
                _id: userId
            }, '-personalProfile.password')
            .populate('companyProfile.role' +
                ' companyProfile.designation' +
                ' companyProfile.company')
            .exec(function(err, user) {
                if (err) {
                    deferred.reject(err);
                } else if (user) {
                    userModel
                        .findOne({
                            _id: user.companyProfile.manager
                        })
                        .populate('companyProfile.designation' +
                            ' companyProfile.company')
                        .exec(function(err, manager) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                user = user.toObject();
                                if (manager) {
                                    user.companyProfile.manager = manager.toObject();
                                }
                                deferred.resolve(user);
                            }
                        });
                } else {
                    deferred.reject(lib.message.NO_DATA);
                }
            });
        return deferred.promise;
    },
    updatePassword: function(userId, password) {
        var deferred = lib.q.defer(),
            updatedUser = {};
        updatedUser.$set = {
            'personalProfile.password': password
        };
        userModel
            .findOneAndUpdate({
                _id: userId
            }, updatedUser)
            .exec(function(err, updated) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(updated);
                }
            });
        return deferred.promise;
    },
    hasManagingPower: function(userId) {
        var deferred = lib.q.defer();
        userModel
            .find({
                _id: userId
            })
            .populate('companyProfile.role', 'trueName')
            .exec(function(err, data) {
                if (data) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });
        return deferred.promise;
    },
    updateUser: function(data) {
        var deferred = lib.q.defer(),
            contacts,
            filePath = data.filePath,
            fileName,
            senderId = data._id,
            newPath,
            leaveConfig = data.leaveConfig;
        delete data.leaveConfig;
        if (filePath) {
            fileName = filePath.split('\/')[1];
            newPath = './assets/images/' + fileName;
            if (!data.personalProfile) {
                data.personalProfile = {};
            }
            data.personalProfile.photoUrl = 'profile_pictures/' + fileName;
        }
        if (data._id === undefined) {
            data.personalProfile.password = lib.md5('12345');
            new userModel(data)
                .save(function(err, user) {
                    if (err) {
                        if (filePath) {
                            fs.unlink(filePath);
                        }
                        deferred.reject(err);
                    } else {
                        leaveUtils.upsertLeaveDocument(user._id, user.companyProfile.company, leaveConfig)
                            .then(function(leave) {
                                if (filePath) {
                                    fs.move(filePath, newPath, function(err) {
                                        if (err) {
                                            if (filePath) {
                                                fs.unlink(filePath);
                                            }
                                        }
                                    });
                                }
                                deferred.resolve({
                                    user: user,
                                    leave: leave
                                });
                            }, function(err) {
                                userModel.findOneAndRemove({
                                        _id: user._id
                                    })
                                    .exec(function(errInDeletion, data) {
                                        if (filePath) {
                                            fs.unlink(filePath);
                                        }
                                        deferred.reject(err);
                                    });
                            });
                    }
                });
        } else {
            delete data._id;
            if (data.personalProfile && data.personalProfile.password) {
                delete data.personalProfile.password;
            }
            if (data.personalProfile &&
                data.personalProfile.contactNumbers) {
                contacts = data.personalProfile.contactNumbers;
                delete data.personalProfile.contactNumbers;
            }
            data = lib.flat(data); //same as flat.flatten
            if (contacts) {
                data['personalProfile.contactNumbers'] = contacts;
            }
            userModel
                .findOne({
                    _id: senderId
                }, {
                    'personalProfile.photoUrl': 1
                })
                .exec(function(err, user) {
                    var oldProfilePicture;
                    if (err) {
                        deferred.reject(err);
                    } else if (user) {
                        if (user.personalProfile.photoUrl) {
                            oldProfilePicture = './assets/images/' +
                                user.personalProfile.photoUrl.split('\/')[1];
                        }
                        userModel
                            .findOneAndUpdate({
                                _id: senderId
                            }, {
                                $set: data
                            })
                            .exec(function(err, updated) {
                                if (err) {
                                    deferred.reject(err);
                                } else if (updated) {
                                    if (filePath) {
                                        if (oldProfilePicture) {
                                            fs.unlink(oldProfilePicture);
                                        }
                                        fs.move(filePath, newPath, function(err) {
                                            if (err) {
                                                if (filePath) {
                                                    fs.unlink(filePath);
                                                }
                                            }
                                        });
                                    }
                                    leaveUtils.upsertLeaveDocument(updated._id, updated.companyProfile.company, leaveConfig)
                                        .then(function() {}, function(err) {
                                            deferred.reject(err);
                                        });
                                    updated = updated ? updated.toObject() : updated;
                                    delete updated.personalProfile.password;
                                    deferred.resolve(updated);
                                }
                            });
                    } else {
                        fs.unlink(filePath);
                        deferred.reject('No user to update');
                    }
                });
        }
        return deferred.promise;
    },

    searchUsers: function(reg, companyId, types) {
        var deferred = lib.q.defer();
        userModel
            .find({
                    $and: [{
                        $or: [{
                            'companyProfile.name.first': {
                                $regex: reg,
                                $options: 'i'
                            }
                        }, {
                            'companyProfile.name.middle': {
                                $regex: reg,
                                $options: 'i'
                            }
                        }, {
                            'companyProfile.name.last': {
                                $regex: reg,
                                $options: 'i'
                            }
                        }]
                    }, {
                        'companyProfile.company': companyId
                    }, {
                        'companyProfile.isActive': true
                    }]
                }, 'personalProfile.contactNumbers' +
                ' companyProfile.email' +
                ' companyProfile.role' +
                ' companyProfile.designation' +
                ' companyProfile.company' +
                ' companyProfile.name')
            .populate({
                path: 'companyProfile.role',
                select: 'trueName',
                match: {
                    trueName: {
                        $in: types
                    }
                }
            })
            .populate('companyProfile.designation companyProfile.company')
            .sort('companyProfile.name.first')
            .exec(function(err, users) {
                var searchResult;
                if (err) {
                    deferred.reject(err);
                } else {
                    searchResult = lib._.filter(users, function(user) {
                        return (user.companyProfile.role !== null);
                    });
                    deferred.resolve(searchResult);
                }
            });
        return deferred.promise;
    },
    /*
     * checks if a user is exist or not
     * if exist then blocked or not
     */
    checkUser: function(userId) {
        var deferred = lib.q.defer();
        userModel
            .findOne({
                _id: userId
            })
            .exec(function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else if (data) {
                    if (data.companyProfile.isActive) {
                        deferred.resolve(true);
                    }
                } else {
                    deferred.resolve(false);
                }
            });
        return deferred.promise;
    },
    /*
     * get ip count for abuse filter from loginAttempt
     */
    getIpCount: function(ip) {
        var deferred = lib.q.defer();
        loginAttemptModel
            .count({
                ip: ip
            }, function(err, count) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(count);
                }
            });
        return deferred.promise;
    },
    /*
     * get ip count for abuse filter from loginAttempt
     */
    getIpUserCount: function(ip, username) {
        var deferred = lib.q.defer();
        loginAttemptModel
            .count({
                ip: ip,
                user: username
            })
            .exec(function(err, count) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(count);
                }
            });
        return deferred.promise;
    },
    /*
     * saves a document to loginAttempt
     */
    saveLoginAttempt: function(loginDetails) {
        var deferred = lib.q.defer();
        new loginAttemptModel(loginDetails)
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
     * updates user collection, save ip and time of login
     */
    updateSuccessfulLogin: function(clientip, userId) {
        var deferred = lib.q.defer();
        userModel
            .findOneAndUpdate({
                _id: userId
            }, {
                $set: {
                    'lastLogin.ip': clientip,
                    'lastLogin.date': new Date()
                }
            })
            .exec(function(err, user) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }
};
