import { validateUser, validateUserLogin, validateUserLoginByUsername } from "../utils/validations";
import * as UserService from "../services/users.service";

// createUser controller
export const createUser = async (req, res) => {
    const { error, value } = validateUser(req.body);


    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const userResponse = await UserService.createUser(value, req.file, res);

        // Log the user response
        if (userResponse.success) {
            return res.status(201).json({
                status: "201",
                message: userResponse.message,
                data: userResponse.user,
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: userResponse.message,
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


// login

export const loginUser = async (req, res) => {
    const { email, username, password } = req.body;

    // Validate input
    let validationResult;
    if (email) {
        validationResult = validateUserLogin({ email, password });
    } else if (username) {
        validationResult = validateUserLoginByUsername({ username, password });
    } else {
        return res.status(400).json({ message: "Email or Username is required." });
    }

    const { error, value } = validationResult;
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Attempt to login the user using provided credentials
        let userResponse;
        if (email) {
            userResponse = await UserService.loginUser(value); // Login with email
        } else if (username) {
            userResponse = await UserService.loginUserByUsername(value); // Login with username
        }

        if (userResponse.success) {
            return res.status(200).json({
                status: "200",
                message: userResponse.message,
                token: userResponse.token,
                data: userResponse.user,
            });
        } else {
            return res.status(401).json({
                status: "401",
                message: userResponse.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to Login",
            error: error.message,
        });
    }
};


// get allusers

export const getAllUsers = async (req, res) => {
    try {
        const result = await UserService.getAllUsers();

        if (result.success && result.users.length > 0) {
            return res.status(200).json({
                status: "200",
                message: "Users retrieved successfully",
                data: result.users,
            });
        } else if (result.success && result.users.length === 0) {
            return res.status(404).json({
                status: "404",
                message: "No users found",
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
            message: "Failed to retrieve users",
            error: error.message,
        });
    }
};


// get by Id

export const getUserById = async (req, res) => {
    const { id } = req.params
    try {
        const result = await UserService.getUserById(id);

        if (result.success && result.user) {
            return res.status(200).json({
                status: "200",
                message: result.message,
                data: result.user,
            });
        } else if (result.success && !result.user) {
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
            message: "Failed to retrieve users",
            error: error.message,
        });
    }
};


// update user

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { error, value } = validateUser(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const userResponse = await UserService.updateUser(id, value, req.file);

        // Log the user response
        if (userResponse.success) {
            return res.status(200).json({
                status: "200",
                message: userResponse.message,
                data: userResponse.user,
            });
        } else {
            return res.status(400).json({
                status: "400",
                message: userResponse.message,
            });
        }
    } catch (error) {
        console.log("Controller Error:", error);
        return res.status(500).json({
            status: "500",
            message: "Failed to retrieve users",
            error: error.message,
        });
    }
};


// delete user

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await UserService.deleteUser(id);

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
            message: "Failed to delete user",
            error: error.message,
        });
    }
};