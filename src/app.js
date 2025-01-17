import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDatabase } from "./config/Dbconnection.js";

// routes
import routes from "./routes/index.js";


const app = express();
dotenv.config();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(cors());

// routes
app.use("/api", routes)

app.get("/", (req, res) => {
    res.status(200).json({
      status: "success",
      author: "John Muhoza",
      message: "Welcome to the Wallet Management API. Use this API to manage your transactions, budgets, and financial insights.",
    });
});
  

  // connection 
connectToDatabase
const PORT = process.env.PORT || 7001;
app.listen(PORT,()=>{
    console.log(`Server running on port: http://localhost:${PORT}`);
});