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

// web3 data
let Web3 = require("web3");
let contractJson = require('./ParcelsNetwork.json');
let web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_ENDPOINT));
let contractAddress = process.env.CONTRACT_ADDRESS;
var contract = new web3.eth.Contract(contractJson.abi, contractAddress);



// Load the AWS SDK
var AWS = require('aws-sdk'),
    region = "us-east-1",
    secretName = "arn:aws:secretsmanager:us-east-1:225119226438:secret:kycValidator-ywimWV",
//"kycValidator",
    secret,
    decodedBinarySecret;

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: region
});

var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();


//mysql
var mysql = require('mysql');





const getKycValidatorKeys = () => new Promise(function(resolve, reject){
    console.log("in getKycValidatorKeys")
    client.getSecretValue({SecretId: secretName}, function(err, data) {
        console.log(data);
        if (err) {
            reject(err);
        }
        else {
            // Decrypts secret using the associated KMS CMK.
            // Depending on whether the secret is a string or binary, one of these fields will be populated.
            if ('SecretString' in data) {
                secret = data.SecretString;
                resolve(secret);
            } else {
                let buff = new Buffer(data.SecretBinary, 'base64');
                decodedBinarySecret = buff.toString('ascii');
                resolve(decodedBinarySecret);
            }
        }
    })
});



const isDriverKYC = (dirverAddress) => new Promise(async function(resolve, reject){
    
    let keys = await getKycValidatorKeys();
    let validatorAddress = keys.KYC_VALIDATOR_ADDRESS;
    let validatorPk = keys.KYC_VALIDATOR_PK;
    
    var setKycMethod = contract.methods.isDriverKYC();
    var encodedABI = setKycMethod.encodeABI();
    
    const transactionCount = await web3.eth.getTransactionCount(validatorAddress, 'pending');
    console.log({transactionCount});

    var tx = {
        nonce: transactionCount,
        from: validatorAddress,
        to: contractAddress,
        gas: 2000000,
        data: encodedABI
    };

    const signed = await web3.eth.accounts.signTransaction(tx, validatorPk);
    console.log({signed});
    var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);
    
    tran.on('confirmation', (confirmationNumber, receipt) => {
        console.log('confirmation: ' + confirmationNumber);
        resolve({confirmationNumber, receipt});
    });

    tran.on('transactionHash', hash => {
        console.log('hash');
        console.log(hash);
    });

    tran.on('receipt', receipt => {
        console.log('reciept');
        console.log(receipt);
    });

    tran.on('error', reject);
    
});

const listUsers = () => new Promise(async function(resolve, reject) {
    var params = {
        UserPoolId: process.env.COGNITO_POOL_ID, /* required */
        AttributesToGet: [
            'email',
            'phone_number'
            /* more items */
        ]
    };
    cognitoidentityserviceprovider.listUsers(params, function(err, data) {
        if (err)
            reject(err);
        else 
            resolve(data);
    });
});

const getUser = async (username) => new Promise(async function(resolve, reject) {
    console.log("on getUser for "+username);
    var con = mysql.createConnection({
      host: "deliveryenginedb-cluster.cluster-c00vvjlr7gdp.us-east-1.rds.amazonaws.com",
      user: "sbhack19",
      password: "sbhack19",
      database: "Last Miles Delivery",
      timeout:6000
    });
    var del = con._protocol._delegateError;
    con._protocol._delegateError = function(err, sequence){
      if (err.fatal) {
        console.trace('fatal error: ' + err.message);
      }
      return del.call(this, err, sequence);
    };
    console.log("initiating the query...");
    con.query('SELECT * FROM DriverTable where `username`="'+username+'"', function (error, results) {
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
const updateUserKyc = async (username, isKyc, ethereumAddress, privateKey) => new Promise(async function(resolve, reject) {
    console.log("on getUser for "+username);
    var con = mysql.createConnection({
      host: "deliveryenginedb-cluster.cluster-c00vvjlr7gdp.us-east-1.rds.amazonaws.com",
      user: "sbhack19",
      password: "sbhack19",
      database: "Last Miles Delivery",
      timeout:6000
    });
    var del = con._protocol._delegateError;
    con._protocol._delegateError = function(err, sequence){
      if (err.fatal) {
        console.trace('fatal error: ' + err.message);
      }
      return del.call(this, err, sequence);
    };
    console.log("initiating the query...");
    
    let isKycValue = isKyc ? 1 : 0;
    con.query(`UPDATE DriverTable set IS_KYC = ${isKycValue}, EthereumAddress = "${ethereumAddress}", Private_key="${privateKey}"  where username="${username}"`, function (error, results) {
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

const setDriverKYC = (driverAddress) => new Promise(async function(resolve, reject){
    console.log("on setDriverKYC");
    let validatorAddress = process.env.KYC_VALIDATOR_ADDRESS;
    let validatorPk = process.env.KYC_VALIDATOR_PK;
    
    var setDriverKYCMethod = contract.methods.setDriverKYC(driverAddress);
    var encodedABI = setDriverKYCMethod.encodeABI();
    console.log("getting transactionCount");

    const transactionCount = await web3.eth.getTransactionCount(validatorAddress, 'pending');
    console.log({transactionCount});

    var tx = {
        nonce: transactionCount,
        from: validatorAddress,
        to: contractAddress,
        gas: 2000000,
        data: encodedABI
    };

    console.log("it will be now the connection to the blockchain");

    const signed = await web3.eth.accounts.signTransaction(tx, validatorPk);
    console.log({signed});
    var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);
    
    tran.on('confirmation', (confirmationNumber, receipt) => {
        console.log('confirmation: ' + confirmationNumber);
        resolve({confirmationNumber, receipt});
    });

    tran.on('transactionHash', hash => {
        console.log('hash');
        console.log(hash);
    });

    tran.on('receipt', receipt => {
        console.log('reciept');
        console.log(receipt);
    });

    tran.on('error', reject);
    
});

exports.get = async (event, context, callback) => {
    
 
    let username = event.pathParameters.username;
    
    
    
   
    var response;
    response = createResponse(200, JSON.stringify({username, user}));
    
    
        /*if (err)
            response = createResponse(500, err);
        else
            */
    callback(null, response);
};
   
    
exports.post = async (event, context, callback) => {
    console.log(event);
    /*let keys = await getKycValidatorKeys();
    let validatorAddress = keys.KYC_VALIDATOR_ADDRESS;
    let validatorPk = keys.KYC_VALIDATOR_PK;
    */
    
    let username = event.pathParameters.username;
    let action = event.pathParameters.action;
    
    /*console.log("will call  getUser for "+username);
    let user = await getUser(username);
    console.log(user);
    console.log("Finished get user");
    */
    if(action === "approve") {
        console.log("approve - will create account ");
        let account = web3.eth.accounts.create();
        let address = account.address;
        let privateKey = account.privateKey;
        console.log({address, privateKey});
        console.log("will call smart contract");
        const res = await setDriverKYC(address);
        console.log("SmartContract called...");
        console.log({res});
        
        console.log("updating drivers table");
        await updateUserKyc(username, true, address, privateKey);
        console.log("finished updating drivers table");
    }
    
    const fetch = require('node-fetch');
    const Bluebird = require('bluebird');
 
    fetch.Promise = Bluebird;

    let res = await fetch("http://www.google.com");
    
    console.log(res);
    
    //console.log(account);
    
        var response;

    
    response = createResponse(200, JSON.stringify({}));
        /*if (err)
            response = createResponse(500, err);
        else
            */
            
    context.callbackWaitsForEmptyEventLoop = false;
    callback(null,response);
};



