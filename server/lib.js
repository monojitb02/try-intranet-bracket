'use strict';

module.exports = {
    express: require('express'), //Acquiring express and exporting it as express
    helmet: require('helmet'), //Acquiring helmet and exporting it as helmet
    passport : require('passport'), //Acquiring passport and exporting it as passport
    passportLocal : require('passport-local'), //Acquiring passport-local and exporting it as passportLocal
    mongoose: require('mongoose'), //Acquiring mongoose and exporting it as mongoose
    connectMongo: require('connect-mongo'), // for persistant session store
    _: require('underscore'), //Acquiring underscore and exporting it as _
    md5: require('MD5'), //Acquiring MD5 and exporting it as md5
    q: require('q'), //Acquiring q and exporting it as q
    expressSession: require('express-session'), //Acquiring express-session and exporting it as expressSession
    bodyParser: require('body-parser'), //Acquiring body-parser and exporting it as bodyParser
    cookieParser: require('cookie-parser'), //Acquiring cookie-parser and exporting it as cookieParser
    csvParser: require('csv-parse'), //Acquiring csv-parse and exporting it as csvParse
    nodemailer: require('nodemailer'), //Acquiring nodemailer and exporting it as nodemailer
    nodemailerSmtp: require('nodemailer-smtp-transport'), //Acquiring nodemailer-smtp-transport and exporting it as nodemailerSmtp
    multiparty: require('connect-multiparty'), //Acquiring connect-multiparty and exporting it as multiparty
    fsExtra: require('fs.extra'), //Acquiring fs.extra and exporting it as fsExtra
    flat: require('flat'), //Acquiring flat and exporting it as flat
    puid: require('puid'), //Acquiring puid and exporting it as puid
    mmMagic: require('mmmagic'),
    scheduler: require('node-schedule'),
    workflow: require('./api/responses/workflow'), //Acquiring workflow and exporting it as workflow
    config: require('./config'), //Acquiring config and exporting it as config
    message: require('./api/lang') //Acquiring lang and exporting it as message,
};
