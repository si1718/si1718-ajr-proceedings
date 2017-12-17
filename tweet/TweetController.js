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
router.get('/stats/day', function(req, res) {
    Tweet.find({}, (err, tweets) => {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            res.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: New GET request to /tweets/stats/day");
            
            var days = [];
            var data = [];
            var aux = [];
            
            for(var i=0; i<tweets.length; i++) {
                var day = tweets[i].date;
                if(days.indexOf(day) == -1) {
                    days.push(day);
                }
            }
            days.sort();
            
            for(i=0; i<tweets.length; i++) {
                var size = aux.indexOf(tweets[i].key);
                var index = days.indexOf(tweets[i].date);
                if(size > -1) {
                    data[size].data[index] = tweets[i].statistic;
                } else {
                    aux.push(tweets[i].key);
                    var tweet_data = new Array(days.length);
                    tweet_data[index] = tweets[i].statistic;
                    data.push({"name":tweets[i].key, "data":tweet_data});
                }
            }
            
            res.send({'days':days, 'data':data});
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
            
            var months = [];
            var data = [];
            var aux = [];
            
            for(var i=0; i<tweets.length; i++) {
                var day = tweets[i].date.split('/');
                var mm = day[1]+"/"+day[2];
                if(months.indexOf(mm) == -1) {
                    months.push(mm);
                }
            }
            months.sort();
            
            for(i=0; i<tweets.length; i++) {
                var size = aux.indexOf(tweets[i].key);
                var day = tweets[i].date.split('/');
                var index = months.indexOf(day[1]+"/"+day[2]);
                if(size > -1) {
                    data[size].data[index] = tweets[i].statistic;
                } else {
                    aux.push(tweets[i].key);
                    var tweet_data = new Array(months.length);
                    tweet_data[index] = tweets[i].statistic;
                    data.push({"name":tweets[i].key, "data":tweet_data});
                }
            }
            
            res.send({'months':months, 'data':data});
        }
    });
});

module.exports = router;