var express = require("express");
var db = require("./db");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require("path");
var cors = require('cors');

var app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security

var BASE_PATH = "/api/v1";
var ProceedingController = require("./proceeding/ProceedingController");
app.use(BASE_PATH + "/proceedings", ProceedingController);


module.exports = app;