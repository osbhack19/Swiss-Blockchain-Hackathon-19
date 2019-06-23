'use strict';
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "deliveryenginedb-cluster.cluster-ro-c00vvjlr7gdp.us-east-1.rds.amazonaws.com",
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


const buildJSON = (results) => {
   var array=[];
   var newElement;
   for (var i = 0; i < results.length;i++){
     newElement = generateNewElement(results[i]);
     console.log(newElement);
     array.push(newElement);
   }
   
    return array;
};

const generateNewElement = (object) =>{
return {
      "username": object.username,
      "DriverAddress": object.DriverAddress,
      "Email": object.Email,
      "Phone": object.Phone,
      "DriverLicense": object.DriverLicense,
      "Capacity": object.Capacity,
      "EthereumAddress": object.EthereumAddress,
      "Birthday": object.Birthday,
      "Firstname": object.Firstname,
      "Surname": object.Surname,
      "Rating": object.Rating,
      "IS_KYC" : object.IS_KYC,
    };  
};

exports.get = (event, context, callback) => {

  //prevent timeout from waiting event loop
   var response;
   con.query('SELECT * FROM DriverTable', function (error, results) {
    
    results = buildJSON(results);
    response = createResponse(200, JSON.stringify(results));
    context.callbackWaitsForEmptyEventLoop = false;
    callback(null,response);
    });

};
