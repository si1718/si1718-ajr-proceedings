var express = require("express");
var router = express.Router();
var helmet = require("helmet");
var bodyParser = require("body-parser");

router.use(bodyParser.json()); //configura dentro de express el middleware bodyparser json
router.use(helmet()); //improve security

var Recommendation = require("./Recommendation");


/*********************************A P I***************************************/
// GET a collection
router.get('/', function(req, res) {
    Recommendation.find({}, (err, recommendation) => {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            res.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: New GET request to /recommendation");
            res.send(recommendation);
        }
    });
});

// GET a single resource
router.get('/:idProceeding', function(req, res) {
    var idProceeding = req.params.idProceeding;
    if (!idProceeding) {
        console.log("WARNING: New GET request to /recommendations/:idProceeding without idProceeding, sending 400...");
        res.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New GET request to /recommendations/" + idProceeding);
        Recommendation.findOne({ "idProceeding": idProceeding }, (err, recommendation) => {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                res.sendStatus(500); // internal server error
            }
            else {
                if (recommendation) {
                    console.log("INFO: Sending recommendation: " + JSON.stringify(recommendation, 2, null));
                    res.send(recommendation);
                }
                else {
                    console.log("WARNING: There is not any recommendation with idProceeding " + idProceeding);
                    res.sendStatus(404); // not found
                }
            }
        });
    }
});

module.exports = router;