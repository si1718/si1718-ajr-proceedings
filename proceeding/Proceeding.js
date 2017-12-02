/** 
 * Reference: http://mongoosejs.com/docs/guide.html
 */
var mongoose = require("mongoose");

var ProceedingSchema = new mongoose.Schema({
    editor: { type: String, required: true },
    coeditors: { type: [String], required: false },
    title: { type: String, required: true },
    year: { type: Number, required: true },
    isbn: { type: String, required: false },
    publisher: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    idProceeding: { type: String, required: true, unique: true },
    keywords: { type: [String], required: false }
});

mongoose.model("Proceeding", ProceedingSchema);

module.exports = mongoose.model("Proceeding");