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
    const newId = await (await dynamoClient.scan({ TableName: TABLE_USER }).promise()).Count + 1;
    const params = {
        TableName: TABLE_USER,
        Item: {
            'id': `${newId}`,
            'age': age,
            'fname': fname,
            'lname': lname,
            'pet': pet,
            'username': username
        }
    };
    await dynamoClient.put(params).promise();
    return "Successfully create user";
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
    console.log(params.UpdateExpression);
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
    return dynamoClient.update(params).promise();
}
const deleteUser = async (id) => {
    const params = {
        TableName: TABLE_USER,
        Key: {
            id: `${id}`
        }
    };
    return await dynamoClient.delete(params).promise();
    // return "Successfully delete user";
}

//!PET
const getPets = async () => {
    const params = {
        TableName: TABLE_PET
    };
    const result = await dynamoClient.scan(params).promise();
    return result;
}
const getPet = async (id, name, type) => {
    const params = {
        TableName: TABLE_PET,
        FilterExpression: ``,
        ExpressionAttributeValues: {}
    };
    if (id != undefined) {
        params.FilterExpression += `id = :id`;
        params.ExpressionAttributeValues[`:id`] = `${id}`;
    }
    if (name != undefined) {
        params.FilterExpression += `name = :name`;
        params.ExpressionAttributeValues[`:name`] = `${name}`;
    }
    if (type != undefined) {
        params.FilterExpression += `type = :type`;
        params.ExpressionAttributeValues[`:type`] = `${type}`;
    }
    const result = await dynamoClient.scan(params).promise();
    return result;
}
const createPet = async (name, type) => {
    const newId = await (await dynamoClient.scan({ TableName: TABLE_PET }).promise()).Count + 1;
    const params = {
        TableName: TABLE_PET,
        Item: {
            'id': `${newId}`,
            'name': name,
            'type': type
        }
    };
    await dynamoClient.put(params).promise();
    return "Successfully create user"
}
const updatePet = async (id, name, type) => {
    const params = {
        TableName: TABLE_PET,
        Key: {
            id: `${id}`
        },
        UpdateExpression: "set",
        ExpressionAttributeValues: {},
        ReturnValues: "UPDATED_NEW"
    };
    if (name != undefined) {
        params.UpdateExpression += ` name = :name`;
        params.ExpressionAttributeValues[`:name`] = `${name}`;
    };
    if (type != undefined) {
        if (params.UpdateExpression == `set`) {
            params.UpdateExpression += ` type = :type`;
        } else {
            params.UpdateExpression += ` and type = :type`;
        }
        params.ExpressionAttributeValues[`:type`] = `${type}`;
    };
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