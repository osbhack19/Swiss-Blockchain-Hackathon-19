'use strict';

console.log('Loading function');

let AWS = require("aws-sdk");

exports.handler = function(event, context, callback) {
    console.log(JSON.stringify(event, null, 2));
    var sns = new AWS.SNS();
    event.Records.forEach(function(record) {
        if (record.dynamodb.NewImage.EnableProcess.BOOL==true) {
            console.log('SENDING package for processing: ' + record.dynamodb.NewImage.PackageId.S);
            var params = {
                Message: JSON.stringify(record.dynamodb.NewImage), 
                Subject: "New Package" + record.dynamodb.NewImage.PackageId.S,
                TopicArn: "arn:aws:sns:us-east-1:225119226438:IncomingPackages"
            };
            sns.publish(params, context.done);
        } else {
            console.log('SKIP package processing: ' + record.dynamodb.NewImage.PackageId.S);
        }
    });
    callback(null, "DONE"); 
};
