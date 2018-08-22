var db = require("../models")

module.exports = function (app) {
    app.get("/", function (req, res) {
        //need to put in pulling from the database here.

        db.Article.find({}).populate("note")
            .then(function (dbArticle) {

                console.log(dbArticle);
                res.render("home", dbArticle);

            })
            .catch(function(err){
                console.log(err);
            })
    })
}