var mongoose = require("mongoose");

var RecommendationSchema = new mongoose.Schema({
    idProceeding: { type: String, required: true },
    proceedings: { type: [String], required: true }
});

mongoose.model("Recommendation", RecommendationSchema);

module.exports = mongoose.model("Recommendation");