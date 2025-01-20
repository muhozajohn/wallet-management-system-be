import express from 'express';
import userRoute from './users.routes';
import categoryRoute from './category.routes';
import transactionRoute from './transaction.routes';
import accountRoute from './account.routes';
import sub_categoryRoute from './sub.category.routes';
import budgetRoute from './budget.routes';
import budget_categoryRoute from './budgetcategory.routes';
import authMiddleware from '../middlewares/auth';


const routes = express.Router();

routes.use("/users",userRoute);
routes.use("/category",authMiddleware,categoryRoute);
routes.use("/subcategory",sub_categoryRoute);
routes.use("/transaction",authMiddleware,transactionRoute);
routes.use("/account",authMiddleware,accountRoute);
routes.use("/budget",authMiddleware,budgetRoute);
routes.use("/budgetcategory",budget_categoryRoute);

export default routes