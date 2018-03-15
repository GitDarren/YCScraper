

var express = require("express");
var handlebars = require("express-handlebars");
var bodyparser = require("body-parser");
var mongoose = require("mongoose")
var request = require("request");
var axios = require("axios");
var logger = require("morgan");

//Scraping Tools
var cheerio = require("cheerio");
var axios = require("axios");

// Require all models
const db = require("./models")
const Note = require("./models/Note.js")
const Headline = require("./models/Headline.js")

const PORT = 3000;

//Initialize Express
const app = express();

//Use Morgan for logging requests
app.use(logger('dev'));
//Use body-parser for handling form submissions
app.use(bodyparser.urlencoded({ extended: false}));
//Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//Set Handlebars
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/scraper'
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {})

//HTML Routes
require("./routes/htmlroutes.js")(app)

app.listen(process.env.PORT || PORT, () => {
    console.log(`App running on port ${PORT}!`)
});