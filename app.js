const express = require("express");
const app = express();

// Open port
app.listen(3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});


// path of repository
const path = require("path");
// layout for ejs
const expressLayouts = require('express-ejs-layouts');
// use post method
const bodyParser = require('body-parser');

// html rendering engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// app.set("layout", "./layout");
app.use(expressLayouts);

// Use parsing module
app.use(bodyParser.urlencoded({extended:true}));
// path of static files
app.use(express.static(path.join(__dirname, "public")));

// Routing
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

