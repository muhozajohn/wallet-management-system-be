import { CategoryType, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createCategory = async (userId, categoryData) => {
    try {
        const id = parseInt(userId);
        
        if (isNaN(id)) {
            return { success: false, message: "Invalid user ID format" };
        }

        const newCategory = await prisma.category.create({
            data: {
                ...categoryData,
                userId: id,
                type: categoryData.type || CategoryType.EXPENSE // Default type
            }
        });
        
        return { success: true, message: "Category created successfully", data: newCategory };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const getCategories = async (userId) => {
    try {
        const categories = await prisma.category.findMany({
            where: { userId: parseInt(userId) },
            include: { 
                subCategories: true,
                transactions: true,
                budgetCategories: true 
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: categories };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const getCategoryById = async (categoryId, userId) => {
    try {
        const category = await prisma.category.findFirst({
            where: {
                id: parseInt(categoryId),
                userId: parseInt(userId)
            },
            include: { 
                subCategories: true,
                transactions: true,
                budgetCategories: true 
            }
        });

        if (!category) {
            return { success: false, message: "Category not found" };
        }

        return { success: true, data: category };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const updateCategory = async (categoryId, userId, updateData) => {
    try {
        // Check if category exists and belongs to user
        const existingCategory = await prisma.category.findFirst({
            where: {
                id: parseInt(categoryId),
                userId: parseInt(userId)
            }
        });

        if (!existingCategory) {
            return { success: false, message: "Category not found or unauthorized" };
        }

    
        const updatedCategory = await prisma.category.update({
            where: { id: parseInt(categoryId) },
            data: updateData
        });

        return { success: true, message: "Category updated successfully", data: updatedCategory };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const deleteCategory = async (categoryId, userId) => {
    try {
        // Check if category exists and belongs to user
        const existingCategory = await prisma.category.findFirst({
            where: {
                id: parseInt(categoryId),
                userId: parseInt(userId)
            }
        });

        if (!existingCategory) {
            return { success: false, message: "Category not found or unauthorized" };
        }

        await prisma.category.delete({
            where: { id: parseInt(categoryId) }
        });

        return { success: true, message: "Category deleted successfully" };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};