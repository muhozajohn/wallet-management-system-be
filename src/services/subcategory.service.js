import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createSubCategory = async (subCategoryData) => {
    try {
        const parentId = await prisma.category.findFirst({
            where: { id: parseInt(subCategoryData.categoryId) }
        })
        
        if (!parentId) {
            return { success: false, message: "Invalid category ID " };
        }

             const newSubCategory = await prisma.subCategory.create({
            data: {
                ...subCategoryData,
                categoryId: parentId.id
            }
        });
        
        return { success: true, message: "SubCategory created successfully", data: newSubCategory };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const getSubCategories = async () => {
    try {
        const subCategories = await prisma.subCategory.findMany({
                include: { 
                transactions: true,
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: subCategories };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const getSubCategoryById = async (subCategoryId) => {
    try {
        const subCategory = await prisma.subCategory.findFirst({
            where: {
                id: parseInt(subCategoryId),
            },
            include: { 
                transactions: true,
                category: true
            }
        });

        if (!subCategory) {
            return { success: false, message: "SubCategory not found" };
        }

        return { success: true, data: subCategory };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const updateSubCategory = async (subCategoryId,  updateData) => {
    try {
        // Check if subcategory exists and belongs to the category
        const existingSubCategory = await prisma.subCategory.findFirst({
            where: {
                id: parseInt(subCategoryId),
            }
        });

        if (!existingSubCategory) {
            return { success: false, message: "SubCategory not found or unauthorized" };
        }

        const updatedSubCategory = await prisma.subCategory.update({
            where: { id: parseInt(subCategoryId) },
            data: updateData
        });

        return { success: true, message: "SubCategory updated successfully", data: updatedSubCategory };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};

export const deleteSubCategory = async (subCategoryId) => {
    try {
        // Check if subcategory exists and belongs to the category
        const existingSubCategory = await prisma.subCategory.findFirst({
            where: {
                id: parseInt(subCategoryId),
            }
        });

        if (!existingSubCategory) {
            return { success: false, message: "SubCategory not found or unauthorized" };
        }

        await prisma.subCategory.delete({
            where: { id: parseInt(subCategoryId) }
        });

        return { success: true, message: "SubCategory deleted successfully" };
    } catch (error) {
        console.error("Service Error:", error);
        return { success: false, message: error.message };
    }
};