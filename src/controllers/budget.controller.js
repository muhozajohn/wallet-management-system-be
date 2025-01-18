import { validateBudget} from "../utils/validations";
import * as BudgetService from "../services/budget.service";

// Create budget controller
export const createBudget = async (req, res) => {
    const { error, value } = validateBudget(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const userId = req.user.id;
        const budgetResponse = await BudgetService.createBudget(userId, value);

        if (budgetResponse.success) {
            return res.status(201).json({
                status: "201",
                message: budgetResponse.message,
                data: budgetResponse.data,
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: budgetResponse.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to Create Budget",
            error: error.message,
        });
    }
};

// Get all budgets
export const getAllBudgets = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await BudgetService.getBudgets(userId);

        if (result.success && result.data.length > 0) {
            return res.status(200).json({
                status: "200",
                message: "Budgets retrieved successfully",
                data: result.data,
            });
        } else if (result.success && result.data.length === 0) {
            return res.status(404).json({
                status: "404",
                message: "No budgets found",
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
            message: "Failed to retrieve budgets",
            error: error.message,
        });
    }
};

// Get budget by ID
export const getBudgetById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const result = await BudgetService.getBudgetById(id, userId);

        if (result.success && result.data) {
            return res.status(200).json({
                status: "200",
                message: "Budget retrieved successfully",
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
            message: "Failed to retrieve budget",
            error: error.message,
        });
    }
};

// Update budget
export const updateBudget = async (req, res) => {
    const { id } = req.params;
    const { error, value } = validateBudget(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const userId = req.user.id;
        const budgetResponse = await BudgetService.updateBudget(id, userId, value);

        if (budgetResponse.success) {
            return res.status(200).json({
                status: "200",
                message: budgetResponse.message,
                data: budgetResponse.data,
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: budgetResponse.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to update budget",
            error: error.message,
        });
    }
};

// Delete budget
export const deleteBudget = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const result = await BudgetService.deleteBudget(id, userId);

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
            message: "Failed to delete budget",
            error: error.message,
        });
    }
};