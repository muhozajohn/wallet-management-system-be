import express from 'express';
import { createSubCategory, deleteSubCategory, getAllSubCategories, getSubCategoryById, updateSubCategory } from '../controllers/subcategory.controller';
import fileUpload from '../utils/multer';

const sub_categoryRoute = express.Router();
sub_categoryRoute.post("/", fileUpload.single("files"), createSubCategory);
sub_categoryRoute.get("/", getAllSubCategories);
sub_categoryRoute.get("/:id", getSubCategoryById);
sub_categoryRoute.put("/id", fileUpload.single("files"), updateSubCategory);
sub_categoryRoute.patch("/id", fileUpload.single("files"), updateSubCategory);
sub_categoryRoute.delete("/:id",deleteSubCategory)

export default sub_categoryRoute