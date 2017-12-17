var mongoose = require("mongoose");

var TweetSchema = new mongoose.Schema({
    key: { type: String, required: true },
    date: { type: String, required: true },
    statistic: { type: Number, required: true }
});

mongoose.model("Tweet", TweetSchema);

module.exports = mongoose.model("Tweet");