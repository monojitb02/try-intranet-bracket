'use strict';
var roleModel = require('../models/role'),
    lib = require('../../lib');
module.exports = {
    isNewRole: function(nameOfRole, companyId) {
        var deferred = lib.q.defer();
        roleModel
            .findOne({
                name: nameOfRole,
                company: companyId
            })
            .exec(function(err, role) {
                if (!role) {
                    deferred.resolve(false);
                }
            })
        return deferred.promise;
    }
};
