const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
const mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const PORT = process.env.PORT || 3000;
const express = require('express');
const exphbs = require('express-handlebars');


const app = express();

app.use(express.static("public"))
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: "main"
}));
app.set('view engine', '.hbs');

app.listen(PORT, function(){
    console.log(`app listening on localhost:${PORT}`)
})

app.get("/", function(req, res){
    res.render("home")
})