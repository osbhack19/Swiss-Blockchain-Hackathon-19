require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');



var privateKeys = [
  process.env.PK_OWNER,
  process.env.PK_KYC_VALIDATOR,
  process.env.PK_CARRIER
];
console.log(privateKeys);
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    goerli: {
          provider: function() {
                return new HDWalletProvider(
               privateKeys,
               process.env.RPC_ENDPOINT,
               0, 
               privateKeys.length)
          },
          network_id: 5,
          gas:  8000000,
          gasPrice: 1000000000
    }
  }
};
