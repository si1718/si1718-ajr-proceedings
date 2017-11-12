var express = require('express');
var bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;
var helmet = require("helmet");
var path = require('path');

var port = (process.env.PORT || 10000);

// DATABASE
var db;
var mdbURL = "mongodb://andjimrio:andjimrio@ds257245.mlab.com:57245/si1718-ajr-proceedings";

MongoClient.connect(mdbURL, { native_parser: true }, function(err, database) {
    if (err) {
        console.log("CAN NOT CONNECT TO DB: " + err);
        process.exit(1);
    }

    db = database.collection("proceedings");

    app.listen(port, () => {
        console.log("Magic is happening on port " + port);
    });
});


// Global strings
var BASE_PATH = "/api/v1";

var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security

/*********************************A P I***************************************/
// GET a collection
app.get(BASE_PATH + '/proceedings', function(req, res) {
    db.find({}).toArray((err, proceedings) => {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            res.sendStatus(500);
        }
        else {
            res.send(proceedings);
        }
    });
});

// GET a single resource
app.get(BASE_PATH + '/proceedings/:id', function(req, res) {
    var id = req.params.id;
    if (!id) {
        console.log("WARNING: New GET request to /proceedings/:id without id, sending 400...");
        res.sendStatus(400);
    }
    else {
        console.log("INFO: New GET request to /proceedings/" + id);
        db.findOne({ "id": id }, (err, proceeding) => {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                res.sendStatus(500);
            }
            else {
                if (proceeding) {
                    console.log("INFO: Sending proceeding: " + JSON.stringify(proceeding, 2, null));
                    res.send(proceeding);
                }
                else {
                    console.log("WARNING: There is not any proceeding with id " + id);
                    res.sendStatus(404);
                }
            }
        });
    }
});

// POST over a collection
app.post(BASE_PATH + '/proceedings', function(req, res) {
    var new_proceeding = req.body;
    if (!new_proceeding) {
        console.log("WARNING: New POST request to /proceedings/ without proceeding, sending 400...");
        res.sendStatus(400);
    }
    else {
        console.log("INFO: New POST request to /proceedings with body: " + JSON.stringify(new_proceeding, 2, null));
        if (!new_proceeding.title || !new_proceeding.editor || !new_proceeding.year || !new_proceeding.isbn) {
            console.log("WARNING: The proceeding " + JSON.stringify(new_proceeding, 2, null) + " is not well-formed, sending 422...");
            res.sendStatus(422); // unprocessable entity
        }
        else {
            var id = (req.body.editor + "").toLowerCase().substr(0,5) + "_" + (req.body.title + "").toLowerCase().substr(0,5) + "_" + req.body.year;
            new_proceeding.id = id;
            db.findOne({ "id": id }, function(err, proceeding) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    res.sendStatus(500);
                }
                else {
                    if (proceeding) {
                        console.log("WARNING: The proceeding " + JSON.stringify(new_proceeding, 2, null) + " already extis, sending 409...");
                        res.sendStatus(409); // conflict
                    }
                    else {
                        db.insertOne(req.body, (err, result) => {
                            if (err) {
                                console.error('WARNING: Error inserting data in DB');
                                res.sendStatus(500);
                            }
                            else {
                                console.log("INFO: Adding proceeding " + JSON.stringify(new_proceeding, 2, null));
                                res.sendStatus(201);
                            }
                        });
                    }
                }
            });
        }
    }
});

//PUT over a single resource
app.put(BASE_PATH + '/proceedings/:id', function(req, res) {
    var new_proceeding = req.body;
    var id = req.params.id;
    if (!new_proceeding) {
        console.log("WARNING: New PUT request to /proceedings/ without proceeding, sending 400...");
        res.sendStatus(400); // bad request
    }
    else {
        db.findOne({ "id": id }, function(err, proceeding) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                res.sendStatus(500);
            }
            else {
                if (!proceeding) {
                    console.log("WARNING: There is not any proceeding with id " + id);
                    res.sendStatus(404);
                }
                else {
                    db.updateOne({ "id": id }, { $set: new_proceeding }, (err, result) => {
                        if (err) {
                            console.error('WARNING: Error inserting data in DB');
                            res.sendStatus(500);
                        }
                        else {
                            res.send(result);
                        }
                    });
                }
            }
        });
    }
});

//DELETE over a collection
app.delete(BASE_PATH + '/proceedings', function(req, res) {
    db.deleteMany({}, (err, output) => {

        if (err) {
            console.error('WARNING: Error removing data from DB');
            res.sendStatus(500);
        }
        else {
            if (output.result.n > 0) {
                console.log("INFO: All the proceedings (" + output.result.n + ") have been succesfully deleted, sending 204...");
                res.sendStatus(204); // no content
            }
            else {
                console.log("WARNING: There are no proceedings to delete");
                res.sendStatus(404)
            }
        }
    });
});

//DELETE over a single resource
app.delete(BASE_PATH + '/proceedings/:id', function(req, res) {
    var id = req.params.id;
    if (!id) {
        console.log("WARNING: New DELETE request to /proceedings/:id without id, sending 400...");
        res.sendStatus(400);
    }
    else {
        console.log("INFO: New DELETE request to /proceedings/" + id);
        db.deleteOne({ "id": id }, (err, output) => {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                res.sendStatus(500); // internal server error
            }
            else {
                if (output.result.n > 0) {
                    console.log("INFO: The proceeding with id " + id + " has been succesfully deleted, sending 204...");
                    res.sendStatus(204); // no content
                }
                else {
                    console.log("WARNING: There are no proceedings to delete");
                    res.sendStatus(404)
                }
            }
        });
    }
});


// NOT ALLOWED OPERATIONS

// POST a specific dissertaiton
app.post(BASE_PATH + "/proceedings/:id", function(req, res) {
    var id = req.params.id;
    console.log("WARNING: New POST request to /proceedings/" + id + ", sending 405...");
    res.sendStatus(405);
});

// PUT over a collection
app.put(BASE_PATH + "/proceedings", function(req, res) {
    console.log("WARNING: New PUT request to /proceedings, sending 405...");
    res.sendStatus(405);
});