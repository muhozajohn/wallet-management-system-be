import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/category.controller';
import fileUpload from '../utils/multer';


const categoryRoute = express.Router();

categoryRoute.post("/", fileUpload.single('files'), createCategory)
categoryRoute.get("/", getAllCategories)
categoryRoute.get("/:id", getCategoryById)
categoryRoute.post("/:id", fileUpload.single('files'), updateCategory)
categoryRoute.patch("/:id", fileUpload.single('files'), updateCategory)
categoryRoute.delete("/:id", deleteCategory)

export default categoryRoute