const { urlencoded, json } = require('express');
const express = require('express');
const app = express();
const dynamo = require('./dynamo');
const { validateAuth } = require("./checkTokenID");
const AwsConfig = require('./AwsConfig');
const cors = require('cors');

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());

//!SignUp
app.post("/signup", async (req, res) => {
    const { username, password, email } = await req.body;
    try {
        AwsConfig.initAWS();
        AwsConfig.setCognitoAttributeList(email);
        AwsConfig.getUserPool().signUp(username, password, AwsConfig.getCognitoAttributeList(), null, function (err, result) {
            if (err) {
                // res.status(422).json({ err: err });
                res.json({ check: false, message: err });
            } else {
                const response = {
                    username: result.user.username,
                    userConfirmed: result.userConfirmed,
                    userAgent: result.user.client.userAgent,
                }
                // res.status(201).json({ res: response });
                res.json({ check: true, message: response });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Something went worng' });
    }
});
//!Verify
app.post("/veritfy", async (req, res) => {
    try {
        AwsConfig.getCognitoUser(req.body.username).confirmRegistration(req.body.code, true, (err, result) => {
            if (err) {
                res.json({ check: false, message: err });
            } else {
                res.json({ check: true, message: result });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Something went worng' });
    }
});
//!SignIn
app.post("/signin", async (req, res) => {
    try {
        AwsConfig.getCognitoUser(req.body.username).authenticateUser(AwsConfig.getAuthDetails(req.body.username, req.body.password), {
            onSuccess: (result) => {
                const token = {
                    accessToken: result.getAccessToken().getJwtToken(),
                    idToken: result.getIdToken().getJwtToken(),
                    refreshToken: result.getRefreshToken().getToken(),
                }
                // resolve({ statusCode: 200, response: AwsConfig.decodeJWTToken(token) });
                res.json({ check: true, message: AwsConfig.decodeJWTToken(token) });
            },
            onFailure: (err) => {
                // resolve({ statusCode: 400, response: err.message || JSON.stringify(err) });
                // res.status(400).json({ err: err.message });
                res.json({ check: false, message: err.message });
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Something went worng' });
    }
});
//!USER
//?Get all user
app.put('/users',
    validateAuth,
    async (req, res) => {
        try {
            const result = await dynamo.getUsers();
            res.json(result);
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: 'Something went worng' });
        }
    }
);
//?Find one user
app.post('/user',
    validateAuth,
    async (req, res) => {
        try {
            const result = await dynamo.getUser(
                req.body.id,
                req.body.age,
                req.body.fname,
                req.body.lname,
                req.body.username
            );
            res.json(result);
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: 'Something went worng' });
        }
    });
//?Create user
app.post('/create/user',
    validateAuth,
    async (req, res) => {
        try {
            if (req.body.age != undefined && req.body.fname != undefined && req.body.lname != undefined && req.body.pet != undefined && req.body.username != undefined) {
                const result = await dynamo.createUser(
                    req.body.age,
                    req.body.fname,
                    req.body.lname,
                    req.body.pet,
                    req.body.username
                );
                res.json(result);
            } else {
                res.json(false);
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: 'Somthing went worng' });
        }
    });
//?Update user
app.post('/update/user',
    validateAuth,
    async (req, res) => {
        try {
            const result = await dynamo.updateUser(
                req.body.id,
                req.body.age,
                req.body.fname,
                req.body.lname,
                req.body.pet,
                req.body.username
            );
            res.json(result);
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: 'Somthing went worng' });
        }
    });
//?Delete user
app.put('/delete/user',
    validateAuth,
    async (req, res) => {
        try {
            const result = await dynamo.deleteUser(req.body.id);
            res.json(result);
        } catch (err) {
            console.log(err);
            res.status().json({ err: 'Something went worng' });
        }
    });

//!PET
//?Get all pet
app.put('/pets',
    validateAuth,
    async (req, res) => {
        try {
            const result = await dynamo.getPets();
            res.json(result);
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: 'Somethingwent worng' })
        };
    })
//?Find one pet
app.post('/pet',
    validateAuth,
    async (req, res) => {
        try {
            const result = await dynamo.getPet(
                req.body.id,
                req.body.pname,
                req.body.pspecies
            );
            res.json(result);
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: 'Something went worng' });
        }
    });
//?Create pet
app.post('/create/pet',
    validateAuth,
    async (req, res) => {
        try {
            console.log(req.body.pname)
            const result = await dynamo.createPet(
                req.body.pname,
                req.body.species
            );
            res.send(result);
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: 'Something went worng' });
        }
    })
//?Update pet
app.post('/update/pet',
    validateAuth,
    async (req, res) => {
        try {
            const result = await dynamo.updatePet(
                req.body.id,
                req.body.pname,
                req.body.species
            )
            res.send(result);
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: 'Somthing went worng' });
        }
    })
//?Delete pet
app.put('/delete/pet',
    validateAuth,
    async (req, res) => {
        try {
            const result = await dynamo.deletePet(req.body.id);
            res.json(result);
        } catch (err) {
            console.log(err);
            res.status().json({ err: 'Something went worng' });
        }
    });

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port : ${port}`);
});