import express from "express";
import {getAllProducts}  from "../controllers/product.contoller.js";

const router = express.Router();

router.get("/", protectedRoute, adminRoute, getAllProducts);

export default router;
