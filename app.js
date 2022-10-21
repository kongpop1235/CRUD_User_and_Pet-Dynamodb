const { urlencoded, json } = require('express');
const express = require('express');
const app = express();
const dynamo = require('./dynamo');

app.use(json());
app.use(urlencoded({ extended: false }));

//!USER
//?Get all user
app.get('/users', async (req, res) => {
    try {
        const result = await dynamo.getUsers();
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Something went worng' });
    }
});
//?Find one user
app.post('/user', async (req, res) => {
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
app.post('/create/user', async (req, res) => {
    try {
        const result = await dynamo.createUser(
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
//?Update user
app.post('/update/user', async (req, res) => {
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
app.delete('/delete/user', async (req, res) => {
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
app.get('/pets', async (req, res) => {
    try {
        const result = await dynamo.getPets();
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Somethingwent worng' })
    };
})
//?Find one pet
app.post('/pet', async (req, res) => {
    try {
        const result = await dynamo.getPet(
            req.body.name,
            req.body.type
        );
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Something went worng' });
    }
});
//?Create pet
app.post('/create/pet', async (req, res) => {
    try {
        const result = await dynamo.createPet(
            req.body.name,
            req.body.type
        );
        res.send(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Something went worng' });
    }
})
//?Update pet
app.post('/update/pet', async (req, res) => {
    try {
        const result = await dynamo.updatePet(
            req.body.id,
            req.body.name,
            req.body.type
        )
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Somthing went worng' });
    }
})
//?Delete pet
app.delete('/delete/pet', async (req, res) => {
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