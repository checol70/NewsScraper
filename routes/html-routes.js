var db = require("../models")

module.exports = function (app) {
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
}