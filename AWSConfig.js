const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
let cognitoAttributeList = [];

const poolData = { 
    UserPoolId : process.env.AWS_COGNITO_USER_POOL_ID,
    ClientId : process.env.AWS_COGNITO_CLIENT_ID
};

const attributes = (key, value) => { 
  return {
    Name : key,
    Value : value
  }
};

function setCognitoAttributeList(email, agent) {
  let attributeList = [];
  attributeList.push(attributes('email',email));
  attributeList.forEach(element => {
    cognitoAttributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(element));
  });
}

function getCognitoAttributeList() {
  return cognitoAttributeList;
}

function getCognitoUser(username) {
  const userData = {
    Username: username,
    Pool: getUserPool()
  };
  return new AmazonCognitoIdentity.CognitoUser(userData);
}

function getUserPool(){
  return new AmazonCognitoIdentity.CognitoUserPool(poolData);
}

function getAuthDetails(username, password) {
  var authenticationData = {
    Username: username,
    Password: password,
   };
  return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
}

function initAWS (region = process.env.AWS_COGNITO_REGION, identityPoolId = process.env.AWS_COGNITO_IDENTITY_POOL_ID) {
  AWS.config.region = region; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId,
  });
}

function decodeJWTToken(token) {
  const {  username, exp, auth_time , token_use, sub} = jwt_decode(token.idToken);
  return {  token, username, exp, uid: sub, auth_time, token_use };
}

module.exports = {
  initAWS,
  getCognitoAttributeList,
  getUserPool,
  getCognitoUser,
  setCognitoAttributeList,
  getAuthDetails,
  decodeJWTToken,
}