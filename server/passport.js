'use strict';

var lib = require('./lib');
exports = module.exports = function(app, passport) {
    var LocalStrategy = lib.passportLocal.Strategy,
        userModel = require('./api/models/user.js');

    passport.use(new LocalStrategy(
        function(username, password, done) {
            userModel.findOne({
                    'companyProfile.email': username,
                    'personalProfile.password': password
                }, '-personalProfile.password')
                .populate('companyProfile.role')
                .exec(function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {
                            message: lib.message.AUTHENTICATION_FAILED
                        });
                    }
                    if (!user.companyProfile.isActive) {
                        return done(null, false, {
                            message: lib.message.USER_BLOCKED
                        });
                    }
                    return done(null, user);
                });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        userModel.findOne({
                _id: user._id
            }, '-personalProfile.password')
            .populate('companyProfile.role')
            .populate('companyProfile.company')
            .exec(function(err, user) {
                if (err) {
                    done(err);
                } else {
                    done(err, user);
                }
            });
    });
};
