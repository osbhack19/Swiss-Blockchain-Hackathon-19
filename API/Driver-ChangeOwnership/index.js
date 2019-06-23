'use strict';
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "deliveryenginedb-cluster.cluster-c00vvjlr7gdp.us-east-1.rds.amazonaws.com",
  user: "sbhack19",
  password: "sbhack19",
  database: "Last Miles Delivery",
  timeout:6000
});



console.log('Loading function');

const createResponse = (statusCode, body) => {
    return {
        "statusCode": statusCode,
        "headers": {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
            },
        "body": body || ""
    };
};

exports.post = (event, context, callback) => {
    event = JSON.parse(event.body);
    console.log(event);
    //prevent timeout from waiting event loop
    var PackageStatusUpdate = event.PackageStatusUpdate;
    var PackageId = event.PackageId;
    
	con.query('UPDATE PackageTable SET PackageStatus = ? WHERE PackageId = ?',[PackageStatusUpdate, PackageId] ,function(error, response) { 
    if (error) throw error;

    response = createResponse(200, JSON.stringify(event));
    context.callbackWaitsForEmptyEventLoop = false;
    callback(null,response);
    });
};

