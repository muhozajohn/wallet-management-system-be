import express from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, loginUser, updateUser } from '../controllers/users.controller';
import fileUpload from '../utils/multer';

const userRoute = express.Router();

userRoute.post("/", fileUpload.single("avatar"), createUser);
userRoute.get("/",  getAllUsers);
userRoute.post("/auth", fileUpload.single("avatar"), loginUser);
userRoute.get("/:id", getUserById);
userRoute.put("/:id", fileUpload.single("avatar"), updateUser);
userRoute.patch("/:id", fileUpload.single("avatar"), updateUser);
userRoute.delete("/:id",  deleteUser);


export default userRoute