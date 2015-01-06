'use strict';

var Service = angular.module('app.service', [])
    .factory('exchangeParticipant',
        function() {
            var participant,
                exchangeParticipant = {
                    setParticipant: function(obj) {
                        participant = obj;
                    },
                    getParticipant: function() {
                        return participant;
                    }
                };
            return exchangeParticipant;
        }
    );

module.exports = Service;
