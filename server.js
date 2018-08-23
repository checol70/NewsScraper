const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
const mongoose = require("mongoose");

var bodyParser = require("body-parser");
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const PORT = process.env.PORT || 3000;
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: "main"
}));
app.set('view engine', '.hbs');

var apiRoutes = require("./routes/api-routes");
var htmlRoutes = require("./routes/html-routes");

apiRoutes(app);
htmlRoutes(app);

app.listen(PORT, function () {
    console.log(`app listening on localhost:${PORT}`);
})