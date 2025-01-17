import express from 'express';
import userRoute from './users.routes.js';
import categoryRoute from './category.routes.js';
import transactionRoute from './transaction.routes.js';
import accountRoute from './account.routes.js';
import sub_categoryRoute from './sub.category.routes.js';
import budgetRoute from './budget.routes.js';
import budget_categoryRoute from './budgetcategory.routes.js';
import authMiddleware from '../middlewares/auth.js';


const routes = express.Router();

routes.use("/users",userRoute);
routes.use("/category",categoryRoute);
routes.use("/subcategory",sub_categoryRoute);
routes.use("/transaction",transactionRoute);
routes.use("/account",authMiddleware,accountRoute);
routes.use("/budget",budgetRoute);
routes.use("/budget/category",budget_categoryRoute);

export default routes