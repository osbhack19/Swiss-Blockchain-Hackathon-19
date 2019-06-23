const ParcelsNetwork = artifacts.require("ParcelsNetwork");

module.exports = async function(deployer, network, accounts){
  
    let owner = accounts[0];
    let kycValidator = accounts[1];
    let carrier = accounts[2];
    console.log({owner, kycValidator, carrier});
    
    await Promise.all([
        deployer.deploy(ParcelsNetwork, { from: owner })
    ]);
    
    let instances = await Promise.all([
        ParcelsNetwork.deployed()
    ]);
    let contract = instances[0];
    
    console.log("ParcelsNetwork Smart Contract Address: " + contract.address);
    console.log("  -> Adding KYC Validator ("+kycValidator+")");
    await contract.addKYCValidator(kycValidator);
    console.log("  -> Adding Carrier ("+carrier+")");
    await contract.addAuthorizedCarrier(carrier);
    console.log("  END");
  
};


