import { AccountType, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createAccount = async (userId, accountData) => {
    try {
        const id = parseInt(userId);
        
        if (isNaN(id)) {
            return { success: false, message: "Invalid user ID format" };
        }

        // Generate a new account number
        const acc = Math.floor(10000 + Math.random() * 90000);
        
        const newAccount = await prisma.account.create({
            data: {
                ...accountData,
                userId: id,
                type: accountData.type || AccountType.BANK,
                accountNumber: acc
            }
        });
        return { success: true, message: "Account created successfully", data: newAccount };
        
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

// Get total balance by account type for a specific user
export const getUserAccountTypeBalances = async (userId) => {
    try {
        const id = parseInt(userId);
        if (isNaN(id)) {
            return { success: false, message: "Invalid user ID format" };
        }

        const balances = await prisma.account.groupBy({
            by: ['type'],
            where: {
                userId: id
            },
            _sum: {
                currentBalance: true
            }
        });

        // Transform the result into a more readable format with proper numeric handling
        const formattedBalances = balances.reduce((acc, balance) => {
            // Convert to number to ensure proper numeric handling
            const numericBalance = Number(balance._sum.currentBalance) || 0;
            
            acc[balance.type] = {
                totalBalance: numericBalance,
                formattedBalance: numericBalance.toFixed(2)
            };
            return acc;
        }, {});

        // Ensure all account types are represented
        Object.values(AccountType).forEach(type => {
            if (!formattedBalances[type]) {
                formattedBalances[type] = {
                    totalBalance: 0,
                    formattedBalance: "0.00"
                };
            }
        });

        // Calculate total balance using proper numeric addition
        const totalBalance = Object.values(formattedBalances)
            .reduce((sum, { totalBalance }) => sum + Number(totalBalance), 0);

        return { 
            success: true, 
            data: {
                balances: formattedBalances,
                summary: {
                    totalAccounts: await prisma.account.count({ where: { userId: id } }),
                    totalBalance: totalBalance,
                    formattedTotalBalance: totalBalance.toFixed(2)
                }
            }
        };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

// Get accounts of specific type for a user
export const getAccountsByType = async (userId, accountType) => {
    try {
        const accounts = await prisma.account.findMany({
            where: { 
                userId: parseInt(userId),
                type: accountType
            },
            include: { transactions: true },
            orderBy: { createdAt: 'desc' }
        });
        
        const totalBalance = accounts.reduce(
            (sum, account) => sum + Number(account.currentBalance), 
            0
        );

        return { 
            success: true, 
            data: {
                accounts,
                totalBalance,
                formattedTotalBalance: totalBalance.toFixed(2)
            }
        };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const getAccounts = async (userId) => {
    try {
        const accounts = await prisma.account.findMany({
            where: { userId: parseInt(userId) },
            include: { transactions: true },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: accounts };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const getAccountById = async (accountId, userId) => {
    try {
        const account = await prisma.account.findFirst({
            where: {
                id: parseInt(accountId),
                userId: parseInt(userId)
            },
            include: { transactions: true }
        });

        if (!account) {
            return { success: false, message: "Account not found" };
        }

        return { success: true, data: account };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const updateAccount = async (accountId, userId, updateData) => {
    try {
        // Check if account exists and belongs to user
        const existingAccount = await prisma.account.findFirst({
            where: {
                id: parseInt(accountId),
                userId: parseInt(userId)
            }
        });

        if (!existingAccount) {
            return { success: false, message: "Account not found or unauthorized" };
        }

        const updatedAccount = await prisma.account.update({
            where: { id: parseInt(accountId) },
            data: updateData
        });

        return { success: true, message: "Account updated successfully", data: updatedAccount };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const deleteAccount = async (accountId, userId) => {
    try {
        // Check if account exists and belongs to user
        const existingAccount = await prisma.account.findFirst({
            where: {
                id: parseInt(accountId),
                userId: parseInt(userId)
            }
        });

        if (!existingAccount) {
            return { success: false, message: "Account not found or unauthorized" };
        }

        await prisma.account.delete({
            where: { id: parseInt(accountId) },
            include:{transactions: true}
        });

        return { success: true, message: "Account deleted successfully" };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};