import { TransactionStatus, TransactionType, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createTransaction = async (userId, transactionData) => {
    try {
        const id = parseInt(userId);
        
        if (isNaN(id)) {
            return { success: false, message: "Invalid user ID format" };
        }

        // Verify account belongs to user
        const account = await prisma.account.findFirst({
            where: {
                id: parseInt(transactionData.accountId),
                userId: id
            }
        });

        if (!account) {
            return { success: false, message: "Account not found or unauthorized" };
        }

        // Verify category belongs to user
        const category = await prisma.category.findFirst({
            where: {
                id: parseInt(transactionData.categoryId),
                userId: id
            }
        });

        if (!category) {
            return { success: false, message: "Category not found or unauthorized" };
        }

        // Convert amount to number if it's a string
        const amount = typeof transactionData.amount === 'string' 
            ? parseFloat(transactionData.amount) 
            : transactionData.amount;

        // Calculate new balance based on transaction type
        let newBalance = Number(account.currentBalance);
        const transactionType = transactionData.type || TransactionType.EXPENSE;

        if (transactionType === TransactionType.INCOME) {
            newBalance += amount;
        } else if (transactionType === TransactionType.EXPENSE) {
            // Check if there's enough balance for expense
            if (newBalance < amount) {
                return { 
                    success: false, 
                    message: "Insufficient balance for this transaction" 
                };
            }
            newBalance -= amount;
        }

        // Use transaction to ensure both operations succeed or fail together
        const result = await prisma.$transaction(async (prisma) => {
            // Create the transaction
            const newTransaction = await prisma.transaction.create({
                data: {
                    ...transactionData,
                    userId: id,
                    status: transactionData.status || TransactionStatus.COMPLETED,
                    type: transactionType,
                    amount: amount
                },
                include: {
                    account: true,
                    category: true,
                    subCategory: true
                }
            });

            // Update account balance
            const updatedAccount = await prisma.account.update({
                where: { id: parseInt(transactionData.accountId) },
                data: { 
                    currentBalance: newBalance,
                    updatedAt: new Date()
                }
            });

            return { 
                transaction: newTransaction, 
                account: updatedAccount 
            };
        });

        return { 
            success: true, 
            message: "Transaction created successfully", 
            data: {
                ...result.transaction,
                account: result.account
            }
        };

    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const getTransactions = async (userId, filters = {}) => {
    try {
        const where = {
            userId: parseInt(userId),
            ...(filters.accountId && { accountId: parseInt(filters.accountId) }),
            ...(filters.categoryId && { categoryId: parseInt(filters.categoryId) }),
            ...(filters.type && { type: filters.type }),
            ...(filters.status && { status: filters.status }),
            ...(filters.startDate && filters.endDate && {
                transactionDate: {
                    gte: new Date(filters.startDate),
                    lte: new Date(filters.endDate)
                }
            })
        };

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                account: true,
                category: true,
                subCategory: true
            },
            orderBy: { transactionDate: 'desc' }
        });

        return { success: true, data: transactions };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const getTransactionById = async (transactionId, userId) => {
    try {
        const transaction = await prisma.transaction.findFirst({
            where: {
                id: parseInt(transactionId),
                userId: parseInt(userId)
            },
            include: {
                account: true,
                category: true,
                subCategory: true
            }
        });

        if (!transaction) {
            return { success: false, message: "Transaction not found" };
        }

        return { success: true, data: transaction };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const updateTransaction = async (transactionId, userId, updateData) => {
    try {
        // Check if transaction exists and belongs to user
        const existingTransaction = await prisma.transaction.findFirst({
            where: {
                id: parseInt(transactionId),
                userId: parseInt(userId)
            }
        });

        if (!existingTransaction) {
            return { success: false, message: "Transaction not found or unauthorized" };
        }

        // If account is being updated, verify it belongs to user
        if (updateData.accountId) {
            const account = await prisma.account.findFirst({
                where: {
                    id: parseInt(updateData.accountId),
                    userId: parseInt(userId)
                }
            });

            if (!account) {
                return { success: false, message: "Account not found or unauthorized" };
            }
        }

        // If category is being updated, verify it belongs to user
        if (updateData.categoryId) {
            const category = await prisma.category.findFirst({
                where: {
                    id: parseInt(updateData.categoryId),
                    userId: parseInt(userId)
                }
            });

            if (!category) {
                return { success: false, message: "Category not found or unauthorized" };
            }
        }

        const updatedTransaction = await prisma.transaction.update({
            where: { id: parseInt(transactionId) },
            data: {
                ...updateData,
                amount: updateData.amount ?  (typeof updateData.amount === 'string' ? parseFloat(updateData.amount) : updateData.amount) : undefined
            },
            include: {
                account: true,
                category: true,
                subCategory: true
            }
        });

        return { success: true, message: "Transaction updated successfully", data: updatedTransaction };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const deleteTransaction = async (transactionId, userId) => {
    try {
        // Check if transaction exists and belongs to user
        const existingTransaction = await prisma.transaction.findFirst({
            where: {
                id: parseInt(transactionId),
                userId: parseInt(userId)
            }
        });

        if (!existingTransaction) {
            return { success: false, message: "Transaction not found or unauthorized" };
        }

        await prisma.transaction.delete({
            where: { id: parseInt(transactionId) }
        });

        return { success: true, message: "Transaction deleted successfully" };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};