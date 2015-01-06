'use strict';

var baseUrl = '/api';
module.exports = {
    login: baseUrl + '/login',
    logout: baseUrl + '/logout',

    //temp participant
    searchTempParticipant: baseUrl + '/temp_participant/search',
    findTempParticipant: baseUrl + '/temp_participant/find',

    //participant
    add: baseUrl + '/participant/add',
    clubs: baseUrl + '/participant/clubs',
    participantList: baseUrl + '/participant/list',
    findParticipant: baseUrl + '/participant/find',
    deleteParticipant: baseUrl + '/participant/delete',
    editParticipant: baseUrl + '/participant/update',

    //shedules
    sheduleSatus: baseUrl + '/shedule/status',
    sheduleEvent: baseUrl + '/shedule/sheduleEvent',
    getAllShedule: baseUrl + '/shedule/get_all_shedules',
    getEventList: baseUrl + '/shedule/get_event_list',
    getEventShedule: baseUrl + '/shedule/get_event_shedules',


    //matches
    addMatch: baseUrl + '/match/add',
    getMatchList: baseUrl + '/match/list',
    getMatch: baseUrl + '/match/find'
};
