// useful https://serverless-stack.com/chapters/signup-with-aws-cognito.html
import Amplify, { Auth } from 'aws-amplify';

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