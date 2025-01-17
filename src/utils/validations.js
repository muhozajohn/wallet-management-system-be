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



// Schema for account creation
const accountSchema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    type: Joi.string()
        .valid('BANK', 'MOBILE_MONEY', 'CASH', 'CRYPTO', 'OTHER')
        .required(),
    currentBalance: Joi.number().precision(2).default(0.00),
    currency: Joi.string().required().length(3).uppercase()
});

export const validateAccount = (accountData) => {
    return accountSchema.validate(accountData);
};

// Schema for account update
const accountUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(50),
    type: Joi.string()
        .valid('BANK', 'MOBILE_MONEY', 'CASH', 'CRYPTO', 'OTHER'),
    currency: Joi.string().length(3).uppercase()
}).min(1);

export const validateAccountUpdate = (accountData) => {
    return accountUpdateSchema.validate(accountData);
};

// Schema for updating account balance
const accountBalanceSchema = Joi.object({
    currentBalance: Joi.number().precision(2).required()
});

export const validateAccountBalance = (balanceData) => {
    return accountBalanceSchema.validate(balanceData);
};