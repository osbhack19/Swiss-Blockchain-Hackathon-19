'use strict';

console.log('Loading function');

let AWS = require("aws-sdk");

let mysql = require('mysql');

let con = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  database: "Last Miles Delivery"
});


exports.handler = function(event, context, callback) {
    console.log("Processing packages");

    // Create an SQS service object
    var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    var queueURL = "https://sqs.us-east-1.amazonaws.com/225119226438/IncomingPackages";

    var params = {
        AttributeNames: [
            "SentTimestamp"
        ],
        MaxNumberOfMessages: 10,
        MessageAttributeNames: [
            "All"
        ],
        QueueUrl: queueURL,
        VisibilityTimeout: 0,
        WaitTimeSeconds: 0
    };
    
    sqs.receiveMessage(params, function(err, data) {
        if (err) {
            console.log("Receive Error", err);
        } else if (data.Messages) {
            
            console.log("Classifying packages using the ML model : MOCKED INTELLIGENCE");
            
            
            data.Messages.forEach(function(message) {
                console.log("Reading message: " + JSON.stringify(message));
                
                var data = JSON.parse(message.Body);
                
                // TODO CALL TO THE ML MODEL IN PRODUCTION TO EVALUATE AND CLASSIFY PACKAGES
                ml(data);
                
                var deleteParams = {
                    QueueUrl: queueURL,
                    ReceiptHandle: message.ReceiptHandle
                };
            
                sqs.deleteMessage(deleteParams, function(err, data) {
                    if (err) {
                        console.log("Delete Error", err);
                    } else {
                        console.log("Message Deleted", data);
                    }
                });
            });
            
        }
    });
    
    context.callbackWaitsForEmptyEventLoop = false;
    callback(null, "message");
    
};

function ml(packageMsg, callback) {
    
    // TODO
    /*var sql = "INSERT INTO PackageTable (id, PackageId) VALUES (?)";
    
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        callback();
    });*/

};