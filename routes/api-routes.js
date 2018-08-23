var axios = require("axios");

var db = require("../models")
var cheerio = require("cheerio");

module.exports = function (app) {
    app.post("/notes/:artId", function (req, res) {
        //this is where we will save notes, and associate them with an article.
        console.log("post hit")
        console.log(req.body)
        db.Note.create(req.body)
            .then(function (dbNote) {
                console.log(dbNote)
                return db.Article.findOneAndUpdate({ _id: req.params.artId }, { $push: { note: dbNote._id } }, { new: true });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    })

    app.put("/notes/delete/:id", function (req, res) {
        //this is where we will delete notes.
        console.log(`deleting ${req.params.id}`)
        db.Note.findByIdAndRemove(req.params.id, (err, resu) => {
            if (err) console.log(err);
            console.log(resu)
            db.Article.findOneAndUpdate({ note: req.params.id }, { $pull: { note: resu._id } }, (err, resul) => {
                if (err) {
                    console.log(err)
                }
                console.log(resul);

                res.end();
            })
        });
    })
    app.get("/scrape", function (req, res) {
        //first we clear our db.
        console.log("emptying db")
        db.Article.remove({}, function (err) {
            if (err) res.send(err)
        }).then(() => {
            db.Note.remove({}, function (err) {
                if (err) res.send(err);
            }).then(() => {


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
                        if (result.link.startsWith("/")) {
                            result.link = `http://www.echojs.com/${result.link}`
                        }
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
        })

    })


}
