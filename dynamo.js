const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKry: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_USER = "DevOpsChallenge-Kongpop-User";
const TABLE_PET = "DevOpsChallenge-Kongpop-Pets";

//!USER
const getUsers = async () => {
    const params = {
        TableName: TABLE_USER
    };
    const result = await dynamoClient.scan(params).promise();
    return result;
}
const getUser = async (id, age, fname, lname, username) => {
    const params = {
        TableName: TABLE_USER,
        // FilterExpression: '#name1 = :value and #name2 = :value2 and #fname = :null',
        // ExpressionAttributeValues: { ':value': '1', ':value2': 'Ruscha', ':null': null },
        // ExpressionAttributeNames: { '#name1': 'id', '#name2': 'lname', '#fname': 'fname' }
        FilterExpression: "",
        ExpressionAttributeValues: {},
        // ExpressionAttributeNames: {}
    };
    if (id != undefined) {
        params.FilterExpression += `id = :id`;
        params.ExpressionAttributeValues[`:id`] = `${id}`;
    }
    if (age != undefined) {
        if (params.FilterExpression != "") {
            params.FilterExpression += ` and age = :age`;
        } else {
            params.FilterExpression += `age = :age`;
        }
        params.ExpressionAttributeValues[`:age`] = age;
    }
    if (fname != undefined) {
        if (params.FilterExpression != "") {
            params.FilterExpression += ` and fname = :fname`;
        } else {
            params.FilterExpression += `fname = :fname`;
        }
        params.ExpressionAttributeValues[`:fname`] = `${fname}`;
    }
    if (lname != undefined) {
        if (params.FilterExpression != "") {
            params.FilterExpression += ` and lname = :lname`;
        } else {
            params.FilterExpression += `lname = :lname`;
        }
        params.ExpressionAttributeValues[`:lname`] = `${lname}`;
    }
    if (username != undefined) {
        if (params.FilterExpression != "") {
            params.FilterExpression += ` and username = :username`;
        } else {
            params.FilterExpression += `username = :username`;
        }
        params.ExpressionAttributeValues[`:username`] = `${username}`;
    }
    const result = await dynamoClient.scan(params).promise();
    return result;
}
const createUser = async (age, fname, lname, pet, username) => {
    const dataId = await dynamoClient.scan({ TableName: TABLE_USER }).promise();
    dataId.Items.sort(function (a, b) { return a.id - b.id });
    let newId = parseInt(dataId.Items[dataId.Items.length - 1].id) + 1;
    const params = {
        TableName: TABLE_USER,
        Item: {
            'id': `${newId}`,
            'age': age,
            'fname':  fname.charAt(0).toUpperCase() + fname.slice(1),
            'lname':  lname.charAt(0).toUpperCase() + lname.slice(1),
            'pet': pet,
            'username': username
        }
    };
    const result = { "report": await dynamoClient.put(params).promise(), "id": newId };
    return result;
    // return "Successfully create user";
}
const updateUser = async (id, age, fname, lname, pet, username) => {
    const params = {
        TableName: TABLE_USER,
        Key: {
            id: `${id}`
        },
        UpdateExpression: "set",
        ExpressionAttributeValues: {},
        ReturnValues: "UPDATED_NEW",
    };
    if (age != undefined) {
        params.UpdateExpression += ` age = :age`;
        params.ExpressionAttributeValues[`:age`] = age;
    }
    if (fname != undefined) {
        if (params.UpdateExpression == `set`) {
            params.UpdateExpression += ` fname = :fname`;
        } else {
            params.UpdateExpression += ` , fname = :fname`;
        }
        params.ExpressionAttributeValues[`:fname`] = `${fname}`;
    }
    if (lname != undefined) {
        if (params.UpdateExpression == `set`) {
            params.UpdateExpression += ` lname = :lname`;
        } else {
            params.UpdateExpression += ` , lname = :lname`;
        }
        params.ExpressionAttributeValues[`:lname`] = `${lname}`
    }
    if (pet != undefined) {
        if (params.UpdateExpression == `set`) {
            params.UpdateExpression += ` pet = :pet`;
        } else {
            params.UpdateExpression += ` , pet = :pet`;
        }
        params.ExpressionAttributeValues[`:pet`] = pet;
    }
    if (username != undefined) {
        if (params.UpdateExpression == `set`) {
            params.UpdateExpression += ` username = :username`;
        } else {
            params.UpdateExpression += ` , username = :username`;
        }
        params.ExpressionAttributeValues[`:username`] = `${username}`;
    }
    return await dynamoClient.update(params).promise();
}
const deleteUser = async (id) => {
    const params = {
        TableName: TABLE_USER,
        Key: {
            id: `${id}`
        }
    };
    dynamoClient.delete(params).promise();
    return "Successfully delete user";
}

//!PET
const getPets = async () => {
    const params = {
        TableName: TABLE_PET
    };
    const result = await dynamoClient.scan(params).promise();
    return result;
}
const getPet = async (id, pname, species) => {
    const params = {
        TableName: TABLE_PET,
        FilterExpression: ``,
        ExpressionAttributeValues: {}
    };
    if (id != undefined) {
        params.FilterExpression += `id = :id`;
        params.ExpressionAttributeValues[`:id`] = `${id}`;
    }
    if (species != undefined) {
        if (params.FilterExpression != "") {
            params.FilterExpression += ` and pname = :pname`;
        } else {
            params.FilterExpression += `pname = :pname`;
        }
        params.ExpressionAttributeValues[`:pname`] = `${pname}`;
    }
    if (species != undefined) {
        if (params.FilterExpression != "") {
            params.FilterExpression += ` and species = :species`;
        } else {
            params.FilterExpression += `species = :species`;
        }
        params.ExpressionAttributeValues[`:species`] = `${species}`;
    }
    const result = await dynamoClient.scan(params).promise();
    return result;
}
const createPet = async (pname, species) => {
    const dataId = await dynamoClient.scan({ TableName: TABLE_PET }).promise();
    dataId.Items.sort(function (a, b) { return a.id - b.id });
    let newId = parseInt(dataId.Items[dataId.Items.length - 1].id) + 1;
    let params = {
        TableName: TABLE_PET,
        Item: {
            'id': `${newId}`,
            'pname': pname.charAt(0).toUpperCase() + pname.slice(1),
            'species': species.charAt(0).toUpperCase() + species.slice(1)
        }
    };
    const result = {"report" : await dynamoClient.put(params).promise(), "id" : newId};
    return result;
}
const updatePet = async (id, pname, species) => {
    const params = {
        TableName: TABLE_PET,
        Key: {
            id: `${id}`
        },
        UpdateExpression: "set",
        ExpressionAttributeValues: {},
        ReturnValues: "UPDATED_NEW",
    };
    if (pname != undefined) {
        if (params.UpdateExpression == `set`) {
            params.UpdateExpression += ` pname = :pname`;
        } else {
            params.UpdateExpression += ` , pname = :pname`;
        }
        params.ExpressionAttributeValues[`:pname`] = `${pname.charAt(0).toUpperCase() + pname.slice(1)}`;
    }
    if (species != undefined) {
        if (params.UpdateExpression == `set`) {
            params.UpdateExpression += ` species = :species`;
        } else {
            params.UpdateExpression += ` , species = :species`;
        }
        params.ExpressionAttributeValues[`:species`] = `${species.charAt(0).toUpperCase() + species.slice(1)}`;
    }
    const result = dynamoClient.update(params).promise();
    return result;
}
const deletePet = async (id) => {
    const params = {
        TableName: TABLE_PET,
        Key: {
            id: `${id}`
        }
    };
    const result = dynamoClient.delete(params).promise();
    return result;
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    createUser,
    deleteUser,
    getPets,
    getPet,
    createPet,
    updatePet,
    deletePet
};