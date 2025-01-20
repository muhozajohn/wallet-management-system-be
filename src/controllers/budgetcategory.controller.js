import { validateBudgetCategory } from "../utils/validations";
import * as budgetCategoryService from "../services/budgetcategory.service";

// Create budget category controller
export const createBudgetCategory = async (req, res) => {
    const { error, value } = validateBudgetCategory(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const budgetCategoryResponse = await budgetCategoryService.createBudgetCategory(value);

        if (budgetCategoryResponse.success) {
            return res.status(201).json({
                status: "201",
                message: budgetCategoryResponse.message,
                data: budgetCategoryResponse.data,
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: budgetCategoryResponse.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to Create Budget Category",
            error: error.message,
        });
    }
};

// Get all budget categories
export const getAllBudgetCategories = async (req, res) => {
    try {
        const result = await budgetCategoryService.getBudgetCategories();

        if (result.success && result.data.length > 0) {
            return res.status(200).json({
                status: "200",
                message: "Budget Categories retrieved successfully",
                data: result.data,
            });
        } else if (result.success && result.data.length === 0) {
            return res.status(404).json({
                status: "404",
                message: "No budget categories found",
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
            message: "Failed to retrieve budget categories",
            error: error.message,
        });
    }
};

// Get budget category by ID
export const getBudgetCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await budgetCategoryService.getBudgetCategoryById(id);

        if (result.success && result.data) {
            return res.status(200).json({
                status: "200",
                message: "Budget Category retrieved successfully",
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
            message: "Failed to retrieve budget category",
            error: error.message,
        });
    }
};

// Update budget category
export const updateBudgetCategory = async (req, res) => {
    const { id } = req.params;
    const { error, value } = validateBudgetCategory(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const budgetCategoryResponse = await budgetCategoryService.updateBudgetCategory(id, value);

        if (budgetCategoryResponse.success) {
            return res.status(200).json({
                status: "200",
                message: budgetCategoryResponse.message,
                data: budgetCategoryResponse.data,
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: budgetCategoryResponse.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to update budget category",
            error: error.message,
        });
    }
};

// Delete budget category
export const deleteBudgetCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await budgetCategoryService.deleteBudgetCategory(id);

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
            message: "Failed to delete budget category",
            error: error.message,
        });
    }
};