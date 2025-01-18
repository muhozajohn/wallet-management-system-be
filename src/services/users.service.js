import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import { uploadToCloud } from "../utils/cloudinary";
import generateToken from "../utils/generateToken";

const prisma = new PrismaClient();

// Create a new user
export const createUser = async (userData, file) => {
  try {
    // Check if the user already exists
    const existing = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existing) {
      return { success: false, message: "Email already exists" };
    }

    // Upload the file to Cloudinary if provided
    let avatarUrl = null;
    if (file) {
      const result = await uploadToCloud(file);
      avatarUrl = result?.secure_url || null;
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        password: hashedPassword,
        avatar: avatarUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      },
    });

    return { success: true, message: "User created successfully", user: newUser };
  } catch (error) {
    console.error("Service Error:", error);
    return { success: false, message: error.message };
  }
};

// Login user by email
export const loginUser = async (userData) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: userData.email } });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(userData.password, user.password);
    if (!isMatch) {
      return { success: false, message: "Invalid password" };
    }

    const token = generateToken(user.id);

    return {
      success: true,
      message: "Login successful",
      token,
      user,
    };
  } catch (error) {
    console.error("Service Error:", error);
    return { success: false, message: error.message };
  }
};
// Login user by username
 export const loginUserByUsername = async (userData) => {
  try {
    const user = await prisma.user.findUnique({ where: { username: userData.username } });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(userData.password, user.password);
    if (!isMatch) {
      return { success: false, message: "Invalid password" };
    }

    const token = generateToken(user.id);

    return {
      success: true,
      message: "Login successful",
      token,
      user,
    };
  } catch (error) {
    console.error("Service Error:", error);
    return { success: false, message: error.message };
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return { success: true, users };
  } catch (error) {
    console.error("Service Error:", error);
    return { success: false, message: error.message };
  }
};

// Get a single user by ID
export const getUserById = async (userId) => {
  try {
    // Convert userId to integer
    const id = parseInt(userId);
    
    // Validate if conversion was successful
    if (isNaN(id)) {
      return { success: false, message: "Invalid user ID format" };
    }
    // Fetch the user with included accounts, categories, transactions, and budgets
    const user = await prisma.user.findUnique({
      where: { id },
      include: { accounts: true, categories: true, transactions: true, budgets: true },
    });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    return { success: true, user };
  } catch (error) {
    console.error("Service Error:", error);
    return { success: false, message: error.message };
  }
};

// Update user
export const updateUser = async (userId, userData, file) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Upload the file to Cloudinary if provided
    let avatarUrl = user.avatar;
    if (file) {
      const result = await uploadToCloud(file);
      avatarUrl = result?.secure_url || avatarUrl;
    }

    // Hash the user's new password (if provided)
    let hashedPassword = user.password;
    if (userData.password) {
      hashedPassword = await bcrypt.hash(userData.password, 10);
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: userData.username || user.username,
        email: userData.email || user.email,
        fullName: userData.fullName || user.fullName,
        password: hashedPassword,
        avatar: avatarUrl,
      },
    });

    return { success: true, message: "User updated successfully", user: updatedUser };
  } catch (error) {
    console.error("Service Error:", error);
    return { success: false, message: error.message };
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    await prisma.user.delete({ where: { id: userId } });
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Service Error:", error);
    return { success: false, message: error.message };
  }
};
