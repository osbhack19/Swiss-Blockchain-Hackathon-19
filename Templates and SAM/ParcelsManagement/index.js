'use strict';

console.log('Loading function');

const createResponse = (statusCode, body) => {
    return {
        "headers": {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
        },
        "statusCode": statusCode,
        "body": body || ""
    }
};

const uuidv4 = require('uuid/v4');


//mysql
var mysql = require('mysql');
/*
id
PackageId
PackageFormat
PickupTimestamp
WarehouseAddress
DeliveryAddress
PackageStatus
Rewards
ConfirmationDate
EthereumAddress
PackagePosition
PackageLevel
*/


/*
insert PackageTable (id, PackageId, PackageFormat, PickupTimestamp, WarehouseAddress, DeliveryAddress, PackageStatus, Rewards, ConfirmationDate, EthereumAddress, PackagePosition, PackageLevel)
value (1,1,'10x19x6','23-06-2019 10:10:10','Zurich, Kreis 1','8002 Kilchberg','Moving','4.3','','10.10.11.11','ONBOARD','SAFE')
*/

const addParcel = async (uid, fromAddress, toAddress, parcelFormat, price ) => new Promise(async function(resolve, reject) {
    
    var con = mysql.createConnection({
      host: process.env.MYSQL_ENDPOINT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      timeout: process.env.MYSQL_TIMEOUT
    });
    var del = con._protocol._delegateError;
    con._protocol._delegateError = function(err, sequence){
      if (err.fatal) {
        console.trace('fatal error: ' + err.message);
      }
      return del.call(this, err, sequence);
    };
    console.log("initiating the query...");
    let query = `INSERT PackageTable (id, PackageId, PackageFormat, WarehouseAddress, DeliveryAddress, Rewards, PackageStatus) value ('${uid}','${uid}','${parcelFormat}','${fromAddress}','${toAddress}', '${price}', 'STORED')`;
    console.log(query);
    con.query(query, function (error, results) {
        console.log({error,results});
        if(error) {
            reject(error);
        }
        else {
            console.log(results);
            resolve(results);
        }
    });
})


exports.addParcel = async (event, context, callback) => {
    console.log(event);
    let body = JSON.parse(event.body);
    
    let {fromAddress, toAddress, parcelFormat, price} = body;

    let uid = uuidv4();

    await addParcel(uid, fromAddress, toAddress, parcelFormat, price);

    let response = createResponse(200, JSON.stringify({uid, fromAddress, toAddress, parcelFormat, price}));
            
    context.callbackWaitsForEmptyEventLoop = false;
    callback(null,response);
};
