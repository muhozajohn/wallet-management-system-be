import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
    let token;
    try {
        // Check for the authorization header and extract the token
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // If no token is provided, return an error
        if (!token) {
            return res.status(401).json({
                status: "Failed",
                message: "You are not logged in, please login",
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Retrieve the user by ID from the decoded token
        const loggedInUser = await prisma.user.findUnique({
            where: { id: decoded.id }, // Ensure `id` exists in your token payload
        });

        // If the user doesn't exist or the token is invalid, return an error
        if (!loggedInUser) {
            return res.status(401).json({
                status: "Failed",
                message: "Token has expired or user does not exist, please login again",
            });
        }

        // Attach the user to the request object for downstream access
        req.user = loggedInUser;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                status: "Failed",
                message: "Invalid or expired token, please login again",
            });
        }
        return res.status(500).json({
            status: "Failed",
            message: "An error occurred while processing your request",
            error: error.message,
        });
    }
};

export default authMiddleware;
