require('dotenv').config();


const express = require("express");
const session = require('express-session');
const app = express();


// Open port
app.listen(3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});


// path of repository
const path = require("path");
// layout for ejs
const expressLayouts = require('express-ejs-layouts');


// html rendering engine and layout
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// express session middleware setup
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
// path of static files
app.use(express.static(path.join(__dirname, "public")));

const initAuthMiddleware = require('./features/login/init-auth-middleware');
initAuthMiddleware(app);

// Routing
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
    res.status(404).render('pages/404');
});
