import express from "express";

const router = express.Router();

// controllers
const {
    createCategory,
    categories,
    getCategory,
    editCategory,
    removeCategory,
} = require("../controllers/category");
const { requireSignin }= require("../controllers/auth");

router.post("/createCategory", requireSignin, createCategory);
router.get("/categories", categories);
router.get("/getCategory", getCategory);
router.put("/editCategory", editCategory);
router.delete("/removeCategory/:categoryID", requireSignin, removeCategory);


export default router;
