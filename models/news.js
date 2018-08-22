const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var NewsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true,
    },
    // summary:{
    //     type: String,
    //     required: true
    // },
    note:[{
        type: Schema.Types.ObjectId,
        ref:"Note"
    }]
})

var Article = mongoose.model("Article", NewsSchema);

module.exports= Article;