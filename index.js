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
app.get(BASE_PATH + '/proceedings/:idProceeding', function(req, res) {
    var idProceeding = req.params.idProceeding;
    if (!idProceeding) {
        console.log("WARNING: New GET request to /proceedings/:idProceeding without idProceeding, sending 400...");
        res.sendStatus(400);
    }
    else {
        console.log("INFO: New GET request to /proceedings/" + idProceeding);
        db.findOne({ "idProceeding": idProceeding }, (err, proceeding) => {
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
                    console.log("WARNING: There is not any proceeding with idProceeding " + idProceeding);
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
        if (!new_proceeding.title || !new_proceeding.editor || !new_proceeding.year) {
            console.log("WARNING: The proceeding " + JSON.stringify(new_proceeding, 2, null) + " is not well-formed, sending 422...");
            res.sendStatus(422); // unprocessable entity
        }
        else {
            var idProceeding = generateId(req.body.isbn, req.body.title, req.body.editor, req.body.year);
            new_proceeding.idProceeding = idProceeding;
            db.findOne({ "idProceeding": idProceeding }, function(err, proceeding) {
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
app.put(BASE_PATH + '/proceedings/:idProceeding', function(req, res) {
    var new_proceeding = req.body;
    var idProceeding = req.params.idProceeding;
    if (!new_proceeding) {
        console.log("WARNING: New PUT request to /proceedings/ without proceeding, sending 400...");
        res.sendStatus(400); // bad request
    }
    else {
        db.findOne({ "idProceeding": idProceeding }, function(err, proceeding) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                res.sendStatus(500);
            }
            else {
                if (!proceeding) {
                    console.log("WARNING: There is not any proceeding with idProceeding " + idProceeding);
                    res.sendStatus(404);
                }
                else {
                    db.updateOne({ "idProceeding": idProceeding }, { $set: new_proceeding }, (err, result) => {
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
    db.deleteMany({}, (err, proceedings) => {

        if (err) {
            console.error('WARNING: Error removing data from DB');
            res.sendStatus(500);
        }
        else {
            if (proceedings.result.n > 0) {
                console.log("INFO: All the proceedings (" + proceedings.result.n + ") have been succesfully deleted, sending 204...");
                res.sendStatus(204); // no content
            }
            else {
                console.log("WARNING: There are no proceedings to delete");
                res.sendStatus(404);
            }
        }
    });
});

//DELETE over a single resource
app.delete(BASE_PATH + '/proceedings/:idProceeding', function(req, res) {
    var idProceeding = req.params.idProceeding;
    if (!idProceeding) {
        console.log("WARNING: New DELETE request to /proceedings/:idProceeding without idProceeding, sending 400...");
        res.sendStatus(400);
    }
    else {
        console.log("INFO: New DELETE request to /proceedings/" + idProceeding);
        db.deleteOne({ "idProceeding": idProceeding }, (err, proceeding) => {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                res.sendStatus(500); // internal server error
            }
            else {
                if (proceeding.result.n > 0) {
                    console.log("INFO: The proceeding with idProceeding " + idProceeding + " has been succesfully deleted, sending 204...");
                    res.sendStatus(204); // no content
                }
                else {
                    console.log("WARNING: There are no proceedings to delete");
                    res.sendStatus(404);
                }
            }
        });
    }
});


// NOT ALLOWED OPERATIONS

// POST a specific dissertaiton
app.post(BASE_PATH + "/proceedings/:idProceeding", function(req, res) {
    var idProceeding = req.params.idProceeding;
    console.log("WARNING: New POST request to /proceedings/" + idProceeding + ", sending 405...");
    res.sendStatus(405); // method not allowed
});

// PUT over a collection
app.put(BASE_PATH + "/proceedings", function(req, res) {
    console.log("WARNING: New PUT request to /proceedings, sending 405...");
    res.sendStatus(405); // method not allowed
});



/*********************************U T I L**************************************/
function generateId(isbn, title, editor, year){
    if(isbn) {
        return getCleanedString(isbn);
    } else {
        return getCleanedString(title).substr(0,5) + 
            getCleanedString(editor).substr(0,5) + year;
    }
}

//https://www.relaxate.com/tutorial-javascript-limpiar-cadena-acentos-tildes-extranos
function getCleanedString(cadena){
   // Definimos los caracteres que queremos eliminar
   var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

   // Los eliminamos todos
   for (var i = 0; i < specialChars.length; i++) {
       cadena= cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
   }   

   // Lo queremos devolver limpio en minusculas
   cadena = cadena.toLowerCase();

   // Quitamos espacios y los sustituimos por nada porque nos gusta mas asi
   cadena = cadena.replace(/ /g,"");

   // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
   cadena = cadena.replace(/[àáä]/gi,"a");
   cadena = cadena.replace(/[èéë]/gi,"e");
   cadena = cadena.replace(/[ìíï]/gi,"i");
   cadena = cadena.replace(/[òóö]/gi,"o");
   cadena = cadena.replace(/[ùúü]/gi,"u");
   cadena = cadena.replace(/ñ/gi,"n");
   return cadena;
}