import express from 'express';
import { createBudgetCategory, deleteBudgetCategory, getAllBudgetCategories, getBudgetCategoryById, updateBudgetCategory } from '../controllers/budgetcategory.controller';
import fileUpload from '../utils/multer';

const budget_categoryRoute = express.Router();
budget_categoryRoute.post("/",fileUpload.single("files"), createBudgetCategory);
budget_categoryRoute.get("/", getAllBudgetCategories);
budget_categoryRoute.get("/:id", getBudgetCategoryById);
budget_categoryRoute.put("/:id",fileUpload.single("files"), updateBudgetCategory);
budget_categoryRoute.patch("/:id",fileUpload.single("files"), updateBudgetCategory);
budget_categoryRoute.delete("/:id",deleteBudgetCategory);

export default budget_categoryRoute