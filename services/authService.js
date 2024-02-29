const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = "secretKey"
const login = async (username, password) =>{
    try {
        const userFind = await user.findOne({username: username});
        if(!userFind){
            throw new Error('User not found');
        }
        if(userFind.password !== password){
            throw new Error('Password is incorrect');
        }
        return jwt.sign({isAdmin : userFind.isAdmin}, secretKey, {expiresIn: '1h'});
    }
    catch (error){
        console.log(error);
        throw new Error(error);
    }
}

const register = async (username, password) =>{
    try{
        return await user.create({
            username,
            password: password,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isAdmin: false
        });
    }
    catch (error){
        throw new Error(error);
    }
}

module.exports = {
    login,
    register
}