var express = require("express");
var router = express.Router();
var helmet = require("helmet");
var bodyParser = require("body-parser");

router.use(bodyParser.json()); //configura dentro de express el middleware bodyparser json
router.use(helmet()); //improve security

var Tweet = require("./Tweet");


/*********************************A P I***************************************/
/**
 * Reference: https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
 */
// GET a collection
router.get('/', function(req, res) {
    Tweet.find(req.query, (err, tweets) => {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            res.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: New GET request to /tweets");
            res.send(tweets);
        }
    });
});


// GET a stats for bar
router.get('/stats/month', function(req, res) {
    Tweet.find({}, (err, tweets) => {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            res.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: New GET request to /tweets/stats/month");
            
            var years = [];
            var counter = {};
            
            for(var i=0; i<tweets.length; i++) {
                var year = tweets[i].year;
                if(year) {
                    years.push(year);
                }
            }
            years.sort();
            
            for(i=0; i<years.length; i++) {
                counter[years[i]] = 1 + (counter[years[i]] || 0);
            }
            
            var data = [];
            years = years.filter( function( item, index, inputArray ) {
                return inputArray.indexOf(item) == index;
            });
            
            for (var num in counter) {
                data.push(counter[num]);
            }
            
            res.send({'years':years, 'data':data});
        }
    });
});

module.exports = router;