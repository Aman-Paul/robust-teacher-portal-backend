const { StatusCodes } = require("http-status-codes");
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');

const commonHelper = require("../helpers/common.helper");
const Users = require('../database/models/user.model');
const errorMessages = require("../config/responses/errorMessages.json");
const successMessages = require("../config/responses/successMessages.json");
const validationParams = require("../config/validationParms.json");

const signUp = async (req, res, next) => {
    try {
       const { email, password, username }  = req.body;
       const missingParams = validationParams.signUpParams.filter(param => !req.body[param]);

       if(missingParams.length) {
        res.status(StatusCodes.BAD_REQUEST).send(commonHelper.responseHandler(`${missingParams[0]} cannot be empty`, {}, StatusCodes.BAD_REQUEST));
        return true;
       }

       const [userData, userNameData] = await Promise.all([
        Users.findOne({ where: { email: email }}),
        Users.findOne({ where: { name: username }})
    ]);
       if(userData) {
        res.status(StatusCodes.BAD_REQUEST).send(commonHelper.responseHandler(errorMessages.userAlreadyExists, {}, StatusCodes.BAD_REQUEST));
        return true;
       }

       if(userNameData) {
        res.status(StatusCodes.BAD_REQUEST).send(commonHelper.responseHandler(errorMessages.usernameAlreadyExists, {}, StatusCodes.BAD_REQUEST));
        return true;
       }

       const hashedPassword = await argon2.hash(password);

       const newUser = await Users.create({ name: username, password: hashedPassword, email});


       res.status(StatusCodes.CREATED).send(commonHelper.responseHandler(successMessages.userSignedUpSuccessfully, signToken(newUser.dataValues.id, newUser.dataValues.email), StatusCodes.CREATED));


    } catch (error) {
        console.error("Error in signUp:", error);
        res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(commonHelper.responseHandler(
            error, 
            errorMessages.internalServerError, 
            StatusCodes.INTERNAL_SERVER_ERROR 
        ));
    }
}
const signToken = (userId, email) => {
    const payload = {
        sub: userId,
        email
    };
    
    const jwt_secret = process.env.JWT_SECRET || "testingSecret";
    
    const access_token = jwt.sign({
        data: payload
    }, jwt_secret, { expiresIn: '3d'});

    return {
        access_token
    }
}

module.exports = { 
    signUp 
} 