import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createBudgetCategory = async (data) => {
    try {
        // Convert string amounts to numbers if needed
        const allocatedAmount = typeof data.allocatedAmount === 'string' 
            ? parseFloat(data.allocatedAmount) 
            : data.allocatedAmount;
        
        const spentAmount = typeof data.spentAmount === 'string'
            ? parseFloat(data.spentAmount)
            : data.spentAmount;

        const newBudgetCategory = await prisma.budgetCategory.create({
            data: {
                ...data,
                allocatedAmount,
                spentAmount: spentAmount || 0,
            },
            include: {
                category: true,
                budget: true
            }
        });
        
        return { success: true, message: "Budget category created successfully", data: newBudgetCategory };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const getBudgetCategories = async () => {
    try {
        const budgetCategories = await prisma.budgetCategory.findMany({
            include: {
                category: true,
                budget: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: budgetCategories };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const getBudgetCategoryById = async (id) => {
    try {
        const budgetCategory = await prisma.budgetCategory.findFirst({
            where: {
                id: parseInt(id),
            },
            include: {
                category: true,
                budget: true
            }
        });

        if (!budgetCategory) {
            return { success: false, message: "Budget category not found" };
        }

        return { success: true, data: budgetCategory };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const updateBudgetCategory = async (id, updateData) => {
    try {
        // Check if budget category exists
        const existingBudgetCategory = await prisma.budgetCategory.findFirst({
            where: {
                id: parseInt(id)
            }
        });

        if (!existingBudgetCategory) {
            return { success: false, message: "Budget category not found or unauthorized" };
        }

        // Convert amounts to numbers if they're strings
        const allocatedAmount = updateData.allocatedAmount 
            ? (typeof updateData.allocatedAmount === 'string' ? parseFloat(updateData.allocatedAmount) : updateData.allocatedAmount)
            : undefined;
        
        const spentAmount = updateData.spentAmount
            ? (typeof updateData.spentAmount === 'string' ? parseFloat(updateData.spentAmount) : updateData.spentAmount)
            : undefined;

        const updatedBudgetCategory = await prisma.budgetCategory.update({
            where: { id: parseInt(id) },
            data: {
                ...updateData,
                allocatedAmount,
                spentAmount,
            },
            include: {
                category: true,
                budget: true
            }
        });

        return { success: true, message: "Budget category updated successfully", data: updatedBudgetCategory };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const deleteBudgetCategory = async (id) => {
    try {
        // Check if budget category exists
        const existingBudgetCategory = await prisma.budgetCategory.findFirst({
            where: {
                id: parseInt(id)
            }
        });

        if (!existingBudgetCategory) {
            return { success: false, message: "Budget category not found or unauthorized" };
        }

        await prisma.budgetCategory.delete({
            where: { id: parseInt(id) }
        });

        return { success: true, message: "Budget category deleted successfully" };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};