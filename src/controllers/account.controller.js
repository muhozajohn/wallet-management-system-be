import { validateAccount } from "../utils/validations";
import * as AccountService from "../services/account.service";

// Create account controller
export const createAccount = async (req, res) => {
    const { error, value } = validateAccount(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const userId = req.user.id
        const accountResponse = await AccountService.createAccount(userId, value);

        if (accountResponse.success) {
            return res.status(201).json({
                status: "201",
                message: accountResponse.message,
                data: accountResponse.data,
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: accountResponse.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to Create Account",
            error: error.message,
        });
    }
};

// Get all accounts
export const getAllAccounts = async (req, res) => {
    try {
        const userId = req.user.id
        const result = await AccountService.getAccounts(userId);

        if (result.success && result.data.length > 0) {
            return res.status(200).json({
                status: "200",
                message: "Accounts retrieved successfully",
                data: result.data,
            });
        } else if (result.success && result.data.length === 0) {
            return res.status(404).json({
                status: "404",
                message: "No accounts found",
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
            message: "Failed to retrieve accounts",
            error: error.message,
        });
    }
};

// Get account by ID
export const getAccountById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id

    try {
        const result = await AccountService.getAccountById(id, userId);

        if (result.success && result.data) {
            return res.status(200).json({
                status: "200",
                message: "Account retrieved successfully",
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
            message: "Failed to retrieve account",
            error: error.message,
        });
    }
};

// Update account
export const updateAccount = async (req, res) => {
    const { id } = req.params;
    const { error, value } = validateAccount(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const userId = req.user.id
        const accountResponse = await AccountService.updateAccount(id, userId, value);

        if (accountResponse.success) {
            return res.status(200).json({
                status: "200",
                message: accountResponse.message,
                data: accountResponse.data,
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: accountResponse.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to update account",
            error: error.message,
        });
    }
};

// Delete account
export const deleteAccount = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id


    try {
        const result = await AccountService.deleteAccount(id, userId);

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
            message: "Failed to delete account",
            error: error.message,
        });
    }
};



// Get total balances for all account types
export const getAccountTypeBalances = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await AccountService.getUserAccountTypeBalances(userId);

        if (result.success) {
            return res.status(200).json({
                status: "200",
                message: "Account balances retrieved successfully",
                data: result.data
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: result.message
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to retrieve account balances",
            error: error.message
        });
    }
};

// Get accounts and total balance for specific type
export const getAccountsByType = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type } = req.params;

        // Validate account type
        if (!Object.values(AccountService.AccountType).includes(type)) {
            return res.status(400).json({
                status: "400",
                message: "Invalid account type"
            });
        }

        const result = await AccountService.getAccountsByType(userId, type);

        if (result.success) {
            if (result.data.accounts.length === 0) {
                return res.status(404).json({
                    status: "404",
                    message: `No accounts found for type: ${type}`
                });
            }

            return res.status(200).json({
                status: "200",
                message: `${type} accounts retrieved successfully`,
                data: result.data
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: result.message
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to retrieve accounts by type",
            error: error.message
        });
    }
};