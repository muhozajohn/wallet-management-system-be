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


// Schema for account creation
const categorySchema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    type: Joi.string().valid('EXPENSE', 'INCOME').required()
});

export const validateCategory = (categoryData) => {
    return categorySchema.validate(categoryData);
};
// Schema for transaction creation
const transactionSchema = Joi.object({
    accountId: Joi.number().required(),
    categoryId: Joi.number().required(),
    subCategoryId: Joi.number().optional().allow(null),
    amount: Joi.number().precision(2).required(),
    type: Joi.string().valid('EXPENSE', 'INCOME').required(),
    description: Joi.string().optional().allow(''),
    // transactionDate: Joi.date().required(),
    status: Joi.string().valid('PENDING', 'COMPLETED', 'CANCELLED').default('PENDING')
});

export const validateTransaction = (transactionData) => {
    return transactionSchema.validate(transactionData);
};


const budgetSchema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    amount: Joi.number().precision(2).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required().min(Joi.ref('startDate')),
    currency: Joi.string().required().length(3)
});

export const validateBudget = (budgetData) => {
    return budgetSchema.validate(budgetData);
};



const subCategorySchema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    categoryId: Joi.number().integer().required(),
  });
  
  export const validateSubCategory = (subCategoryData) => {
    return subCategorySchema.validate(subCategoryData);
  };


const budgetCategorySchema = Joi.object({
  budgetId: Joi.number().integer().required(),
  categoryId: Joi.number().integer().required(),
  allocatedAmount: Joi.number().precision(2).min(0).required(),
  spentAmount: Joi.number().precision(2).min(0).required(),
});

export const validateBudgetCategory = (budgetCategoryData) => {
  return budgetCategorySchema.validate(budgetCategoryData);
};
