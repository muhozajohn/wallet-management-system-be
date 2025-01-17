import { AccountType, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createAccount = async (userId, accountData) => {
    try {
        const id = parseInt(userId);
        
        if (isNaN(id)) {
            return { success: false, message: "Invalid user ID format" };
        }

    
       // Check if the user already has an account
       const existingAccount = await prisma.account.findFirst({
        where: { userId: id },
    });
        
        let acc;

        if (existingAccount) {
            // If an account exists, reuse its accountNumber
            acc = existingAccount.accountNumber;
        } else {
            // Generate a new account number if no account exists
            acc = Math.floor(10000 + Math.random() * 90000);
        }
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
            where: { id: parseInt(accountId) }
        });

        return { success: true, message: "Account deleted successfully" };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};