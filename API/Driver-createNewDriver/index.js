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
    //console.log(JSON.stringify(JSON.parse(event.body)));
    event = JSON.parse(event.body);
 let username = event.username;
 let DriverAddress = event.DriverAddress;
 let Email = event.Email;
 let Phone = event.Phone;
 let DriverLicense = event.DriverLicense;
 let Capacity = event.Capacity;
 let Private_key = null;
 let Staking_amount = 0;
 let Rating = 3;
 let EthereumAddress = null;
 let Birthday = event.Birthday;
 let IS_KYC = false;
 let Firstname = event.Firstname;
 let Surname = event.Surname;
  //prevent timeout from waiting event loop
	var values =[username, DriverAddress, Email, Phone, DriverLicense, Capacity, Private_key, Staking_amount, Rating, EthereumAddress, Birthday, IS_KYC, Firstname,Surname];
	con.query('INSERT INTO DriverTable (username, DriverAddress, Email, Phone, DriverLicense, Capacity, Private_key, Staking_amount, Rating, EthereumAddress, Birthday, IS_KYC, Firstname,Surname) VALUE (?)',
	[values],function(error, response) { 

    response = createResponse(200, JSON.stringify(response));
    context.callbackWaitsForEmptyEventLoop = false;
    callback(null,response);
    });

};
