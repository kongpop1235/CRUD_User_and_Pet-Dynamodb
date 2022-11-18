const CognitoExpress = require("cognito-express");

const cognitoExpress = new CognitoExpress({
    region: process.env.AWS_DEFAULT_REGION,
    cognitoUserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    tokenUse: "access",
    tokenExpiration: 360000,
});

exports.validateAuth = (req, res, next) => {
    if (
        req.body.accessToken
    ) {
        const token = req.body.accessToken;
        cognitoExpress.validate(token , function (err, response) {
            if (err) {
                res.status(401).send(err);
            } else {
                next();
            }
        });
    } else {
        res.status(401).send("No token provided.");
    }
};