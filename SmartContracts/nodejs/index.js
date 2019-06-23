'use strict';

console.log("hello...")
let Web3 = require("web3");
let contractJson = require('../build/contracts/ParcelsNetwork.json');

let web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.slock.it/goerli"));
let contractAddress = "0x648BA0E30a449b10E1B3352e318ba413d1EB88Fe";
var contract = new web3.eth.Contract(contractJson.abi, contractAddress);
var setKycMethod = contract.methods.setDriverKYC("0x09D8018F04de089a535A5a148CDfc28A72e5d439");
var encodedABI = setKycMethod.encodeABI();
let kycValidator = "0x09D8018F04de089a535A5a148CDfc28A72e5d439";
let kycValidatorPk = "7656CED238DFCD23014BD10D9F14156167C85679B46FBD9FF353A0C0C1D44EA8";

const setKyc = async() => {
    const transactionCount = await web3.eth.getTransactionCount(kycValidator, 'pending');
    console.log({transactionCount});
   // const nonce = web3.toHex(transactionCount);

    var tx = {
        nonce: transactionCount,
        from: kycValidator,
        to: contractAddress,
        gas: 2000000,
        data: encodedABI
    };

    const signed = await web3.eth.accounts.signTransaction(tx, kycValidatorPk);
    console.log({signed});
    var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);


    return new Promise(function(resolve, reject){
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
    })
};

setKyc();
