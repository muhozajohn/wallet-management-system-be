import express from 'express';
import { createAccount, deleteAccount, getAccountById, getAllAccounts, updateAccount } from '../controllers/account.controller.js';
import fileUpload from '../utils/multer.js';


const accountRoute = express.Router();

accountRoute.post("/",fileUpload.single("files"),createAccount)
accountRoute.get("/",getAllAccounts)
accountRoute.get("/:id",getAccountById)
accountRoute.put("/:id",fileUpload.single("files"),updateAccount)
accountRoute.patch("/:id",fileUpload.single("files"),updateAccount)
accountRoute.delete("/:id",deleteAccount)

export default accountRoute