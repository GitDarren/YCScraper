

const express = require("express");
const handlebars = require('express-handlebars');
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const request = require("request");
const axios = require("axios");
const logger = require("morgan");
const path = require("path");

// //Scraping Tools
// const cheerio = require("cheerio");
// const axios = require("axios");

// Require all models
const db = require("./models")
const Note = require("./models/note.js")
const Article = require("./models/article.js")

//Initialize the app
const app = express();


//Setting up the database
const config = require("./config/database.js");
mongoose.Promise = Promise;
mongoose
    .connect(config.database)
    .then( result => {
        console.log(`Connected to the database '${result.connections[0].name}' 
        on ${result.connections[0].host}:${result.connections[0].port}`)
    })
    .catch(err => console.log("There was an error with your connection:" , err));

//Use Morgan for logging requests
app.use(logger('dev'));

//Use body-parser for handling form submissions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//Setting up Handlebars middleware
app.engine('handlebars', handlebars({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Use express.static to serve the public folder as a static directory
app.use(express.static(path.join(__dirname, "public")));
app.use('/articles', express.static(path.join(__dirname, "public")));
app.use("/notes", express.static(path.join(__dirname, "public")));

// //HTML Routes
// require("./routes/htmlroutes.js")(app)

// //API Routes
// require("./routes/apiroutes.js")(app)

//Setting up the Routes
const index = require('./routes/index')
const articles = require('./routes/articles')
const notes = require("./routes/notes")
const scrape = require("./routes/scrape")

app.use("/", index)
app.use("/articles", articles)
app.use("/notes", notes)
app.use("/scrape", scrape)

//Start the server fool! Hope this shit doesn't break!
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`)
});