import { validateCategory } from "../utils/validations";
import * as CategoryService from "../services/category.service";

// Create category controller
export const createCategory = async (req, res) => {
    const { error, value } = validateCategory(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const userId = req.user.id;
        const categoryResponse = await CategoryService.createCategory(userId, value);

        if (categoryResponse.success) {
            return res.status(201).json({
                status: "201",
                message: categoryResponse.message,
                data: categoryResponse.data,
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: categoryResponse.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to Create Category",
            error: error.message,
        });
    }
};

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await CategoryService.getCategories(userId);

        if (result.success && result.data.length > 0) {
            return res.status(200).json({
                status: "200",
                message: "Categories retrieved successfully",
                data: result.data,
            });
        } else if (result.success && result.data.length === 0) {
            return res.status(404).json({
                status: "404",
                message: "No categories found",
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
            message: "Failed to retrieve categories",
            error: error.message,
        });
    }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const result = await CategoryService.getCategoryById(id, userId);

        if (result.success && result.data) {
            return res.status(200).json({
                status: "200",
                message: "Category retrieved successfully",
                data: result.data,
            });
        } else if (result.success && !result.data) {
            return res.status(404).json({
                status: "404",
                message: result.message,
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
            message: "Failed to retrieve category",
            error: error.message,
        });
    }
};

// Update category
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { error, value } = validateCategory(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const userId = req.user.id;
        const categoryResponse = await CategoryService.updateCategory(id, userId, value);

        if (categoryResponse.success) {
            return res.status(200).json({
                status: "200",
                message: categoryResponse.message,
                data: categoryResponse.data,
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: categoryResponse.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to update category",
            error: error.message,
        });
    }
};

// Delete category
export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const result = await CategoryService.deleteCategory(id, userId);

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
            message: "Failed to delete category",
            error: error.message,
        });
    }
};