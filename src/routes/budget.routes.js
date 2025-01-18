import express from 'express';
import fileUpload from '../utils/multer';
import { createBudget, deleteBudget, getAllBudgets, getBudgetById, updateBudget } from '../controllers/budget.controller';

const budgetRoute = express.Router();

budgetRoute.post("/",fileUpload.single("files"),createBudget);
budgetRoute.get("/",getAllBudgets);
budgetRoute.get("/:id",getBudgetById);
budgetRoute.put("/:id",fileUpload.single("files"),updateBudget);
budgetRoute.patch("/:id",fileUpload.single("files"),updateBudget);
budgetRoute.delete("/:id",deleteBudget)

export default budgetRoute