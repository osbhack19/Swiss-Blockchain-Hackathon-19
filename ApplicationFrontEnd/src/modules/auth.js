// useful https://serverless-stack.com/chapters/signup-with-aws-cognito.html
import Amplify, { Auth } from 'aws-amplify';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: 'us-east-1',
    userPoolId: 'us-east-1_gGTsz6eva',
    identityPoolId: 'us-east-1:21670a28-ba40-4907-bbaa-195fe8360656',
    userPoolWebClientId: '2ls7hqamvt11h1dhe2tk9dqc6s'
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