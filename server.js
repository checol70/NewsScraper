// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI);

var PORT = process.env.PORT || 3000;
var express = require('express');
var exphbs = require('express-handlebars');


var app = express();

app.use(express.static("public"))
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: "main"
}));
app.set('view engine', '.hbs');

app.listen(PORT, function(){
    console.log(`app listening on localhost:`)
})

app.get("/", function(req, res){
    res.render("home")
})