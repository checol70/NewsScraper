const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
const mongoose = require("mongoose");

var bodyParser = require("body-parser");
var axios = require("axios");
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const PORT = process.env.PORT || 3000;
const express = require('express');
const exphbs = require('express-handlebars');

var db = require("./models")
const app = express();
var cheerio = require("cheerio");

//var apiRoutes = require("./routes/api-routes");
//var htmlRoutes = require("./routes/html-routes");

//apiRoutes(app);
//htmlRoutes(app);



app.use(express.static("public"));
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: "main"
}));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, function () {
    console.log(`app listening on localhost:${PORT}`);
})




app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.echojs.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("scrape complete")
    })
        

});



app.get("/", function (req, res) {
    //need to put in pulling from the database here.

    db.Article.find({}).populate("note")
        .then(function (dbArticle) {

            var hbsObject ={
                Article: dbArticle
            }
            
            res.render("home", hbsObject);

        })
        .catch(function (err) {
            console.log(err);
        })
})

app.post("/notes/:artId", function(req, res){
    //this is where we will save notes, and associate them with an article.
    db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.artId }, {$push: { note: dbNote._id} }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
})

app.put("/notes/delete/:id", function(req, res){
    //this is where we will delete notes.
    console.log(`deleting ${req.params.id}`)
    db.Note.findByIdAndRemove(req.params.id,(err, resu)=>{
        if(err) console.log(err);
        console.log(resu)
        //Favorite.update( {cn: req.params.name}, { $pullAll: {uid: [req.params.deleteUid] } } )
        db.Article.findOneAndUpdate({note: req.params.id},{$pull:{note:resu._id}},(err, resul)=>{
            if(err){
                console.log(err)
            }
            console.log(resul);

            res.end();
        })
    });
})