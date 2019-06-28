// useful https://serverless-stack.com/chapters/signup-with-aws-cognito.html
import Amplify, { Auth } from 'aws-amplify';
import axios from 'axios';
import Web3 from 'web3';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: 'us-west-2',
    userPoolId: 'us-west-2_qBh8z8Epc',
    identityPoolId: 'arn:aws:cognito-idp:us-west-2:343544725688:userpool',
    userPoolWebClientId: '5k6mnh7ecqv3hirdto8qu2uhga'
  }
});

export const login = async (email, password) => {
  try {
    const response = await Auth.signIn(email, password);
    return response;
  } catch (e) {
    throw e;
  }
};

export const signUp = async (email, password) => {
  try {
    const newUser = await Auth.signUp({
      username: email,
      attributes: {
        email
      },
      password
    });
    return newUser;
  } catch (e) {
    throw e;
  }
};

export const verifyEmailAddress = async (email, verificationCode) => {
  try {
    await Auth.confirmSignUp(email, verificationCode);
  } catch (e) {
    throw e;
  }
};

export const currentAuthenticatedUser = async () => {
  try {
    return await Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
  } catch (e) {
    throw e;
  } 
};

export const currentAuthenticatedUserEthereumAddress = async () => {
  try {
    
    let user = await currentAuthenticatedUser();
    let username = user.username
    
    const drivers = await axios('https://r61qa9p3h5.execute-api.us-west-2.amazonaws.com/Prod/getDrivers');
    let ethereumAddress = ''
    
    for(let i = 0; i <drivers.data.length; i++ ) {
      let entry = drivers.data[i];
      console.log(entry);
      if(entry.username === username) {
        ethereumAddress = entry.EthereumAddress;
        console.log({ethereumAddress})
        return ethereumAddress;
      }
    }
    
    
  } catch (e) {
    throw e;
  } 
};

export const currentAuthenticatedIsKyc = async () => {
  try {
    
    let user = await currentAuthenticatedUser();
    let username = user.username
    
    const drivers = await axios('https://r61qa9p3h5.execute-api.us-west-2.amazonaws.com/Prod/getDrivers');

    for(let i = 0; i <drivers.data.length; i++ ) {
      let entry = drivers.data[i];
      console.log(entry);
      if(entry.username === username) {
        console.log({entry});
        
        return entry.IS_KYC === 1;
      }
    }
  } catch (e) {
    throw e;
  } 
};


export const currentAuthenticatedBalance = async () => {
  try {
    
    let user = await currentAuthenticatedUser();
    let username = user.username
    
    const drivers = await axios('https://r61qa9p3h5.execute-api.us-west-2.amazonaws.com/Prod/getDrivers');

    for(let i = 0; i <drivers.data.length; i++ ) {
      let entry = drivers.data[i];
      console.log(entry);
     if(entry.username === username) {
        let ethereumAddress = entry.EthereumAddress;
        if(ethereumAddress !== '') {
          console.log({ethereumAddress})
          const web3 = new Web3('https://rpc.slock.it/goerli');
          
          let balance = await web3.eth.getBalance(ethereumAddress);
          debugger;
          return balance;
        }
      }
      return 0;
    }
  } catch (e) {
    throw e;
  } 
};




