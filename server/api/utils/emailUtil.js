'use strict';
var lib = require('../../lib'),
    mailCredential = lib.config.mailCredential,
    q = lib.q,
    nodemailer = lib.nodemailer,
    tranport = lib.nodemailerSmtp;
module.exports = {
    sendMail: function(mailOptions) {
        var deferred = q.defer(),
            /*mailOptions = {
                from: from, // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                //text: content, // plaintext body
                html: content // html body

            },*/
            transporter = nodemailer.createTransport(tranport(mailCredential));
        mailOptions.from = mailCredential.auth.user;
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                deferred.reject(error);
            } else {
                deferred.resolve(info.response);
            }
        });
        return deferred.promise;
    }
};
