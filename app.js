require('dotenv').config();


const express = require("express");
const session = require('express-session');
const app = express();

// Open port
// app.listen('3000', '0.0.0.0', () => {
//     console.log("Server started (http://localhost:3000/) !");
// });

var server      = require('http').createServer(app);
var io          = require('socket.io')(server);

server.listen(3000, () => {
  console.log('listening on *:3000');
});


// path of repository
const path = require("path");
// layout for ejs
const expressLayouts = require('express-ejs-layouts');
// use post method
const bodyParser = require('body-parser');


// html rendering engine and layout
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// express session middleware setup
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
// path of static files
app.use(express.static(path.join(__dirname, "public")));

const initAuthMiddleware = require('./features/login/init-auth-middleware');
initAuthMiddleware(app);


// Middleware used for setting error and success messages as available in _ejs_ templates
app.use((req, res, next) => {
    if (req.session) {
      res.locals.messages = req.session.messages;
      res.locals.userInfo = req.session.userInfo;
      req.session.messages = {};
    }
    next();
  });
  
// Routing
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
    res.status(404).render('pages/404');
});




io.on('connection', (socket) => {
  console.log('a user connected');

});

const mqtt_client = require("./features/mqtt/controller");

var event = require('./features/refresh/event').eventBus;

event.on("refresh", function () {
    console.log('it worked');
    io.emit('events', "refresh");
});