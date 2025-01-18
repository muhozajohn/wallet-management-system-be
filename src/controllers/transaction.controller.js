import { validateTransaction } from "../utils/validations";
import * as TransactionService from "../services/transaction.service";

// Create transaction controller
export const createTransaction = async (req, res) => {
    const { error, value } = validateTransaction(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const userId = req.user.id;
        const transactionResponse = await TransactionService.createTransaction(userId, value);

        if (transactionResponse.success) {
            return res.status(201).json({
                status: "201",
                message: transactionResponse.message,
                data: transactionResponse.data,
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: transactionResponse.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to Create Transaction",
            error: error.message,
        });
    }
};

// Get all transactions
export const getAllTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const filters = {
            accountId: req.query.accountId,
            categoryId: req.query.categoryId,
            type: req.query.type,
            status: req.query.status,
            startDate: req.query.startDate,
            endDate: req.query.endDate
        };

        const result = await TransactionService.getTransactions(userId, filters);

        if (result.success && result.data.length > 0) {
            return res.status(200).json({
                status: "200",
                message: "Transactions retrieved successfully",
                data: result.data,
            });
        } else if (result.success && result.data.length === 0) {
            return res.status(404).json({
                status: "404",
                message: "No transactions found",
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
            message: "Failed to retrieve transactions",
            error: error.message,
        });
    }
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const result = await TransactionService.getTransactionById(id, userId);

        if (result.success && result.data) {
            return res.status(200).json({
                status: "200",
                message: "Transaction retrieved successfully",
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
            message: "Failed to retrieve transaction",
            error: error.message,
        });
    }
};

// Update transaction
export const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { error, value } = validateTransaction(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const userId = req.user.id;
        const transactionResponse = await TransactionService.updateTransaction(id, userId, value);

        if (transactionResponse.success) {
            return res.status(200).json({
                status: "200",
                message: transactionResponse.message,
                data: transactionResponse.data,
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: transactionResponse.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to update transaction",
            error: error.message,
        });
    }
};

// Delete transaction
export const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const result = await TransactionService.deleteTransaction(id, userId);

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
            message: "Failed to delete transaction",
            error: error.message,
        });
    }
};