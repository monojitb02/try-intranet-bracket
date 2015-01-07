'use strict';
var lib = require('../../lib'),
    workingHour = require('../../config').workingHour,
    message = lib.message;
module.exports = {
    /**
     *  validation checking of attendance add and attendance edit
     */
    validateAttendanceData: function(req, res, next) {
        var workflow = lib.workflow(req, res),
            modifiedBy = req.user._id,
            date = req.body.date ? new Date(req.body.date) : req.body.date,
            inTime = req.body.inTime,
            outTime = req.body.outTime,
            user = req.body.user,
            company = req.user.companyProfile.company,
            inTimeArray = [],
            outTimeArray = [],
            workDuration, totalDuration, workDurationMin, workDurationHour,
            attendanceObj,
            overTime,
            inTimeDate, outTimeDate, workingHourDate,
            status = 'Present';

        if (!(date && inTime && outTime && user)) {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        if (date.toString() === 'Invalid Date' || date > new Date()) {
            workflow.outcome.errfor.message = lib.message.INVALID_DATE;
            workflow.emit('response');
            return;
        }
        inTimeArray = inTime.split(':');
        outTimeArray = outTime.split(':');
        for (var i in inTimeArray) {
            if (isNaN(inTimeArray[i]) || inTimeArray.length > 2) {
                workflow.outcome.errfor.message = message.INVALID_IN_TIME;
                workflow.emit('response');
                return;
            }
        }
        for (i in outTimeArray) {
            if (isNaN(outTimeArray[i]) || outTimeArray.length > 2) {
                workflow.outcome.errfor.message = message.INVALID_OUT_TIME;
                workflow.emit('response');
                return;
            }
        }
        if (inTimeArray[0] < 0 || inTimeArray[0] > 23 || inTimeArray[1] < 0 || inTimeArray[1] > 59) {
            workflow.outcome.errfor.message = message.INVALID_IN_TIME;
            workflow.emit('response');
            return;
        }
        if (outTimeArray[0] < 0 || outTimeArray[0] > 23 || outTimeArray[1] < 0 || outTimeArray[1] > 59) {
            workflow.outcome.errfor.message = message.INVALID_OUT_TIME;
            workflow.emit('response');
            return;
        }
        inTimeDate = new Date().setHours(inTimeArray[0], inTimeArray[1], 0, 0);
        outTimeDate = new Date().setHours(outTimeArray[0], outTimeArray[1], 0, 0);
        if (inTimeDate > outTimeDate) {
            workflow.outcome.errfor.message = message.INVALID_IN_OR_OUT_TIME;
            workflow.emit('response');
            return;
        }
        workingHourDate = new Date().setHours(workingHour.hour, workingHour.min, 0, 0);

        totalDuration = ((outTimeDate - inTimeDate) / 60000);
        workDurationMin = totalDuration % 60;
        workDurationHour = (totalDuration - workDurationMin) / 60;
        if (workDurationMin === 0 && workDurationHour === 0) {
            status = 'Absent';
        }
        totalDuration = workDurationHour + ':' + workDurationMin;
        if (workingHourDate > outTimeDate) {
            workDuration = totalDuration;
            overTime = '00:00';
        } else {
            workDuration = ((workingHourDate - inTimeDate) / 60000);
            workDurationMin = workDuration % 60;
            workDurationHour = (workDuration - workDurationMin) / 60;
            workDuration = workDurationHour + ':' + workDurationMin;
            overTime = ((outTimeDate - workingHourDate) / 60000);
            workDurationMin = overTime % 60;
            workDurationHour = (overTime - workDurationMin) / 60;
            overTime = workDurationHour + ':' + workDurationMin;
        }
        date.setHours(0, 0, 0);
        attendanceObj = {
            company: company,
            user: user,
            date: date,
            inTime: inTime,
            outTime: outTime,
            workDuration: workDuration,
            totalDuration: totalDuration,
            overTime: overTime,
            status: status,
            modifiedBy: modifiedBy,
            isManualEntry: true
        };
        req.attendanceObj = attendanceObj;
        next();
    },
    /**
     *  validation checking of view attendance by a user with given month and year
     */
    validateViewAttendance: function(req, res, next) {
        var workflow = lib.workflow(req, res),
            date = req.query.date ? new Date(Number(req.query.date)) : req.query.date,
            month = req.query.month,
            year = req.query.year,
            startDate, endDate, findCriteria;
        if (!date && (month === undefined || year === undefined)) {
            workflow.outcome.errfor.message = lib.message.FIELD_REQUIRED;
            workflow.emit('response');
            return;
        }
        if (date && date.toString() !== 'Invalid Date') {
            date.setHours(0, 0, 0, 0);
            if (date > new Date()) {
                workflow.outcome.errfor.message = lib.message.INVALID_DATE;
                workflow.emit('response');
                return;
            }
            findCriteria = {
                date: date
            };
            req.findCriteria = findCriteria;
            next();
            return;
        }
        if (isNaN(month) || month > 11) {
            workflow.outcome.errfor.message = lib.message.INVALID_MONTH;
            workflow.emit('response');
            return;
        }
        if (isNaN(year) || year > new Date().getFullYear()) {
            workflow.outcome.errfor.message = lib.message.INVALID_YEAR;
            workflow.emit('response');
            return;
        }
        if (year === new Date().getFullYear() && month > new Date().getMonth()) {
            workflow.outcome.errfor.message = lib.message.INVALID_MONTH;
            workflow.emit('response');
            return;
        };
        startDate = new Date(year, month, 1);
        month++;
        endDate = new Date(year, month, 0);
        findCriteria = {
            startDate: startDate,
            endDate: endDate
        };
        req.findCriteria = findCriteria;
        next();
    }
};
