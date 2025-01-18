import express from 'express';
import { createTransaction, deleteTransaction, getAllTransactions, getTransactionById, updateTransaction } from '../controllers/transaction.controller';
import fileUpload from '../utils/multer';


const transactionRoute = express.Router();
transactionRoute.post("/", fileUpload.single('files'), createTransaction)
transactionRoute.get("/",getAllTransactions)
transactionRoute.get("/:id",getTransactionById)
transactionRoute.put("/:id", fileUpload.single('files'), updateTransaction)
transactionRoute.patch("/:id", fileUpload.single('files'), updateTransaction)
transactionRoute.delete("/:id",deleteTransaction)

export default transactionRoute