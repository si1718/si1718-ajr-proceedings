var mongoose = require("mongoose");

var mdbURL = "mongodb://andjimrio:andjimrio@ds257245.mlab.com:57245/si1718-ajr-proceedings";

mongoose.connect(mdbURL, { useMongoClient: true }, (error) => {
    
    if(error) {
        console.error("ERROR: Cannot connect to database: " + error);
    } else {
        console.info("INFO: Database connection succesfully.");
    }

});