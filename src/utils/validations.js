import Joi from "joi";

// Schema for user creation
const userSchema = Joi.object({
    username: Joi.string().required().min(3).max(30), 
    fullName: Joi.string().required().min(3).max(50), 
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4).max(50),
    avatar: Joi.string().uri().optional(), 
});

export const validateUser = (userData) => {
    return userSchema.validate(userData);
};

// Schema for user login by email
const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4).max(50),
});

export const validateUserLogin = (userData) => {
    return userLoginSchema.validate(userData);
};

// Schema for user login by username
const userLoginByUsernameSchema = Joi.object({
    username: Joi.string().required().min(3).max(30),
    password: Joi.string().required().min(4).max(50),
});

export const validateUserLoginByUsername = (userData) => {
    return userLoginByUsernameSchema.validate(userData);
};
