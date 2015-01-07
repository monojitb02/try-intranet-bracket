'use strict';
var lib = require('./lib'),
    router = require('./router'),
    jobScheduler = require('./api/cronjob'),
    // cors = require('cors'),
    server = lib.config.server,
    app = lib.express(),
    bodyParser = lib.bodyParser,
    expressSession = lib.expressSession,
    MongoStore = lib.connectMongo(expressSession),
    cookieParser = lib.cookieParser,
    passport = lib.passport,
    helmet = lib.helmet;

/*app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
        res.status(200).end();
    } else {
        next();
    }
});
*/
//app.use(cors());
lib.mongoose.connect(lib.config.db);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser('mYsEcReTkEy'));

app.use(expressSession({
    secret: 'mYsEcReTkEy',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    store: new MongoStore({
        mongooseConnection: lib.mongoose.connection
            // url: lib.config.db
    })
}));

app.use(passport.initialize());
app.use(passport.session());

helmet(app);


app.use('/profile_pictures', lib.express.static('./assets/images'));
app.use('/test', lib.express.static('./testInHTML'));
app.use('/', lib.express.static('./public'));


//connect to mongodb
// lib.mongoose.connect(lib.config.db);

//setup passport
require('./passport')(app, passport);

//setup route
router(app, passport);

//start the server
app.listen(server.port, function() {
    console.log('Listening on: ' + server.host + ':' + server.port);
});
