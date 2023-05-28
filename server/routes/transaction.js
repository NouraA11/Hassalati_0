import express from "express";

const router = express.Router();

// controllers
const {
    createTransaction,
    transactions,
    editTransaction,
    removeTransaction,
} = require("../controllers/transaction");
const { requireSignin }= require("../controllers/auth");

router.post("/createTransaction", requireSignin, createTransaction);
router.get("/transactions", transactions);
router.put("/editTransaction", editTransaction);
router.delete("/removeTransaction/:transactionID", requireSignin, removeTransaction);


export default router;
