import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createBudget = async (userId, budgetData) => {
    try {
        const id = parseInt(userId);
        
        if (isNaN(id)) {
            return { success: false, message: "Invalid user ID format" };
        }

        // Convert amount to number if it's a string
        const amount = typeof budgetData.amount === 'string' ? parseFloat(budgetData.amount) : budgetData.amount;

        const newBudget = await prisma.budget.create({
            data: {
                ...budgetData,
                userId: id,
                amount,
                startDate: new Date(budgetData.startDate),
                endDate: new Date(budgetData.endDate)
            },
            include: {
                budgetCategories: true,
            }
        });
        
        return { success: true, message: "Budget created successfully", data: newBudget };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const getBudgets = async (userId) => {
    try {
        const budgets = await prisma.budget.findMany({
            where: { userId: parseInt(userId) },
            include: { 
                budgetCategories: true
            },
            orderBy: { startDate: 'desc' }
        });
        return { success: true, data: budgets };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const getBudgetById = async (budgetId, userId) => {
    try {
        const budget = await prisma.budget.findFirst({
            where: {
                id: parseInt(budgetId),
                userId: parseInt(userId)
            },
            include: { 
                budgetCategories: true
            }
        });

        if (!budget) {
            return { success: false, message: "Budget not found" };
        }

        return { success: true, data: budget };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const updateBudget = async (budgetId, userId, updateData) => {
    try {
        // Check if budget exists and belongs to user
        const existingBudget = await prisma.budget.findFirst({
            where: {
                id: parseInt(budgetId),
                userId: parseInt(userId)
            }
        });

        if (!existingBudget) {
            return { success: false, message: "Budget not found or unauthorized" };
        }

        // Convert amount to number if it's present and a string
        const amount = updateData.amount ? (typeof updateData.amount === 'string' ? parseFloat(updateData.amount) : updateData.amount) : undefined;

        const updatedBudget = await prisma.budget.update({
            where: { id: parseInt(budgetId) },
            data: {
                ...updateData,
                amount,
                startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
                endDate: updateData.endDate ? new Date(updateData.endDate) : undefined
            },
            include: {
                budgetCategories: true
            }
        });

        return { success: true, message: "Budget updated successfully", data: updatedBudget };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const deleteBudget = async (budgetId, userId) => {
    try {
        // Check if budget exists and belongs to user
        const existingBudget = await prisma.budget.findFirst({
            where: {
                id: parseInt(budgetId),
                userId: parseInt(userId)
            }
        });

        if (!existingBudget) {
            return { success: false, message: "Budget not found or unauthorized" };
        }

        await prisma.budget.delete({
            where: { id: parseInt(budgetId) }
        });

        return { success: true, message: "Budget deleted successfully" };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};