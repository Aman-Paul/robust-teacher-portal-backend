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
        res.status(StatusCodes.BAD_REQUEST).send(commonHelper.responseHandler(`${missingParams[0]} cannot be empty`, {}, false));
        return true;
       }

       const [userData, userNameData] = await Promise.all([
        Users.findOne({ where: { email: email }}),
        Users.findOne({ where: { name: username }})
    ]);
       if(userData) {
        res.status(StatusCodes.BAD_REQUEST).send(commonHelper.responseHandler(errorMessages.userAlreadyExists, {}, false));
        return true;
       }

       if(userNameData) {
        res.status(StatusCodes.BAD_REQUEST).send(commonHelper.responseHandler(errorMessages.usernameAlreadyExists, {}, false));
        return true;
       }

       const hashedPassword = await argon2.hash(password);

       const newUser = await Users.create({ name: username, password: hashedPassword, email});


       res.status(StatusCodes.CREATED).send(commonHelper.responseHandler(successMessages.userSignedUpSuccessfully, signToken(newUser.dataValues.id, newUser.dataValues.email), true));


    } catch (error) {
        console.error("Error in signUp:", error);
        res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(commonHelper.responseHandler(
            error, 
            errorMessages.internalServerError, 
            false
        ));
    }
}

const signIn = async (req, res, next) => {
    try {
        const { email, password }  = req.body;
        const missingParams = validationParams.signInParams.filter(param => !req.body[param]);
        if(missingParams.length) {
            res.status(StatusCodes.BAD_REQUEST).send(commonHelper.responseHandler(`${missingParams[0]} cannot be empty`, {}, false));
            return true;
        }

        const userData = await Users.findOne({ where: { email }, attributes: ["email", "password"]});

        if(!userData) {
            res.status(StatusCodes.BAD_REQUEST).send(commonHelper.responseHandler(errorMessages.noSuchUserExists, {}, false));
            return true;
        }

        const isPassCorrect = await verifyPassword(userData.password, password);
        if(!isPassCorrect) {
            res.status(StatusCodes.BAD_REQUEST).send(commonHelper.responseHandler(errorMessages.incorrectCredentials, {}, false));
            return true;
        }

        res.status(StatusCodes.ACCEPTED).send(commonHelper.responseHandler(successMessages.userSignedUpSuccessfully, signToken(userData.dataValues.id, userData.dataValues.email), true));
        
    } catch (error) {
        console.error("Error in signIn:", error);
        res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(commonHelper.responseHandler(
            error, 
            errorMessages.internalServerError, 
            false
        ));
    }
}

const verifyPassword = (storedPass, inputPass) => {
    return argon2
            .verify(storedPass, inputPass)
            .then((pwMatches) => {
                if (!pwMatches) {
                    return false;
                }
                return true;
            })
            .catch((error) => {
                return false;
            });
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
    signUp,
    signIn
} 