var express = require("express");
var router = express.Router();
var helmet = require("helmet");
var bodyParser = require("body-parser");

router.use(bodyParser.json()); //configura dentro de express el middleware bodyparser json
router.use(helmet()); //improve security

var Proceeding = require("./Proceeding");


/*********************************A P I***************************************/
/**
 * Reference: https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 */
// GET a collection
router.get('/', function(req, res) {
    Proceeding.find(req.query, (err, proceedings) => {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            res.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: New GET request to /proceedings");
            res.send(proceedings);
        }
    });
});

// GET a single resource
router.get('/:idProceeding', function(req, res) {
    var idProceeding = req.params.idProceeding;
    if (!idProceeding) {
        console.log("WARNING: New GET request to /proceedings/:idProceeding without idProceeding, sending 400...");
        res.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New GET request to /proceedings/" + idProceeding);
        Proceeding.findOne({ "idProceeding": idProceeding }, (err, proceeding) => {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                res.sendStatus(500); // internal server error
            }
            else {
                if (proceeding) {
                    console.log("INFO: Sending proceeding: " + JSON.stringify(proceeding, 2, null));
                    res.send(proceeding);
                }
                else {
                    console.log("WARNING: There is not any proceeding with idProceeding " + idProceeding);
                    res.sendStatus(404); // not found
                }
            }
        });
    }
});

// POST over a collection
router.post('/', function(req, res) {
    var new_proceeding = req.body;
    if (!new_proceeding) {
        console.log("WARNING: New POST request to /proceedings/ without proceeding, sending 400...");
        res.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New POST request to /proceedings with body: " + JSON.stringify(new_proceeding, 2, null));
        if (!new_proceeding.title || !new_proceeding.editor || !new_proceeding.year) {
            console.log("WARNING: The proceeding " + JSON.stringify(new_proceeding, 2, null) + " is not well-formed (it's necesary title, editor and year), sending 422...");
            res.sendStatus(422); // unprocessable entity
        }
        else {
            var idProceeding = generateId(req.body.isbn, req.body.title, req.body.editor, req.body.year);
            
            Proceeding.create({
                editor: new_proceeding.editor,
                coeditors: new_proceeding.coeditors,
                title: new_proceeding.title,
                year: new_proceeding.year,
                isbn: new_proceeding.isbn,
                publisher: new_proceeding.publisher,
                city: new_proceeding.city,
                country: new_proceeding.country,
                idProceeding: idProceeding
            }, (err, proceeding) => {
                if (err) {
                    //Mongoose Errors: http://thecodebarbarian.com/mongoose-error-handling
                    if (err.name == "ValidationError") {
                        console.log("WARNING: The proceeding " + JSON.stringify(new_proceeding, 2, null) + " is not well-formed, sending 422...");
                        res.sendStatus(422); // unprocessable entity
                    }
                    else if (err.name == "MongoError") {
                        console.log("WARNING: The proceeding " + JSON.stringify(new_proceeding, 2, null) + " already extis, sending 409...");
                        res.sendStatus(409); // conflict
                    }
                    else {
                        console.error('WARNING: Error inserting data in DB ' + err.name);
                        res.sendStatus(500); // internal server error
                    }
                }
                else {
                    console.log("INFO: Adding proceeding " + JSON.stringify(new_proceeding, 2, null));
                    res.sendStatus(201); // created
                }
            });
            
        }
    }
});

//PUT over a single resource
router.put('/:idProceeding', function(req, res) {
    var new_proceeding = req.body;
    var idProceeding = req.params.idProceeding;
    if (!new_proceeding) {
        console.log("WARNING: New PUT request to /proceedings/ without proceeding, sending 400...");
        res.sendStatus(400); // bad request
    }
    else {
        if (new_proceeding.idProceeding && new_proceeding.idProceeding != idProceeding) {
            res.sendStatus(400); // bad request
        }
        else {
            console.log("INFO: New PUT request to /proceedings with body: " + JSON.stringify(new_proceeding, 2, null));
            Proceeding.findOneAndUpdate({ "idProceeding": idProceeding }, { $set: new_proceeding }, { new: true }, (err, result) => {
                if (err) {
                    console.error('WARNING: Error inserting data from DB');
                    res.sendStatus(500); // internal server error
                }
                else {
                    res.send(result);
                }
            });
        }
    }
});

//DELETE over a collection
router.delete('/', function(req, res) {
    Proceeding.remove({}, (err, proceedings) => {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            res.sendStatus(500); // internal server error
        }
        else {
            if (proceedings.result.n > 0) {
                console.log("INFO: All the proceedings (" + proceedings.result.n + ") have been succesfully deleted, sending 204...");
                res.sendStatus(204); // no content
            }
            else {
                console.log("WARNING: There are no proceedings to delete");
                res.sendStatus(404); // not found
            }
        }
    });
});

//DELETE over a single resource
router.delete('/:idProceeding', function(req, res) {
    var idProceeding = req.params.idProceeding;
    if (!idProceeding) {
        console.log("WARNING: New DELETE request to /proceedings/:idProceeding without idProceeding, sending 400...");
        res.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New DELETE request to /proceedings/" + idProceeding);
        Proceeding.deleteOne({ "idProceeding": idProceeding }, (err, proceeding) => {
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
                    res.sendStatus(404); // not found
                }
            }
        });
    }
});


// NOT ALLOWED OPERATIONS

// POST a specific proceeding
router.post("/:idProceeding", function(req, res) {
    var idProceeding = req.params.idProceeding;
    console.log("WARNING: New POST request to /proceedings/" + idProceeding + ", sending 405...");
    res.sendStatus(405); // method not allowed
});

// PUT over a collection
router.put("/", function(req, res) {
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

module.exports = router;