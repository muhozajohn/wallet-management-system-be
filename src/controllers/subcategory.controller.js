import { validateSubCategory } from "../utils/validations";
import * as SubCategoryService from "../services/subcategory.service";

// Create subcategory controller
export const createSubCategory = async (req, res) => {
    const { error, value } = validateSubCategory(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
      
        const subCategoryResponse = await SubCategoryService.createSubCategory( value);

        if (subCategoryResponse.success) {
            return res.status(201).json({
                status: "201",
                message: subCategoryResponse.message,
                data: subCategoryResponse.data,
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: subCategoryResponse.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to Create SubCategory",
            error: error.message,
        });
    }
};

// Get all subcategories for a category
export const getAllSubCategories = async (req, res) => {
    try {
   
        const result = await SubCategoryService.getSubCategories();

        if (result.success && result.data.length > 0) {
            return res.status(200).json({
                status: "200",
                message: "SubCategories retrieved successfully",
                data: result.data,
            });
        } else if (result.success && result.data.length === 0) {
            return res.status(404).json({
                status: "404",
                message: "No subcategories found",
            });
        } else {
            return res.status(500).json({
                status: "500",
                message: result.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to retrieve subcategories",
            error: error.message,
        });
    }
};

// Get subcategory by ID
export const getSubCategoryById = async (req, res) => {
    const { id} = req.params;

    try {
        const result = await SubCategoryService.getSubCategoryById(id);

        if (result.success && result.data) {
            return res.status(200).json({
                status: "200",
                message: "SubCategory retrieved successfully",
                data: result.data,
            });
        } else {
            return res.status(404).json({
                status: "404",
                message: result.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to retrieve subcategory",
            error: error.message,
        });
    }
};

// Update subcategory
export const updateSubCategory = async (req, res) => {
    const { id} = req.params;
    const { error, value } = validateSubCategory(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const subCategoryResponse = await SubCategoryService.updateSubCategory(id, value);

        if (subCategoryResponse.success) {
            return res.status(200).json({
                status: "200",
                message: subCategoryResponse.message,
                data: subCategoryResponse.data,
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: subCategoryResponse.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to update subcategory",
            error: error.message,
        });
    }
};

// Delete subcategory
export const deleteSubCategory = async (req, res) => {
    const { id} = req.params;

    try {
        const result = await SubCategoryService.deleteSubCategory(id);

        if (result.success) {
            return res.status(200).json({
                status: "200",
                message: result.message,
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: result.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to delete subcategory",
            error: error.message,
        });
    }
};