import express from 'express';
import { createAccount, deleteAccount, getAccountById, getAccountsByType, getAccountTypeBalances, getAllAccounts, updateAccount } from '../controllers/account.controller';
import fileUpload from '../utils/multer';


const accountRoute = express.Router();

accountRoute.post("/",fileUpload.single("files"),createAccount)
accountRoute.get("/",getAllAccounts)
accountRoute.get("/balances/types",getAccountTypeBalances)
accountRoute.get("/type/:type",getAccountsByType)
accountRoute.get("/:id",getAccountById)
accountRoute.put("/:id",fileUpload.single("files"),updateAccount)
accountRoute.patch("/:id",fileUpload.single("files"),updateAccount)
accountRoute.delete("/:id",deleteAccount)

export default accountRoute