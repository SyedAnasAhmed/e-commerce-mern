import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getRecommendedProducts,
} from "../controllers/product.contoller.js";
import { protectedRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectedRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/recomendation", getRecommendedProducts);
router.post("/", protectedRoute, adminRoute, createProduct);
router.delete("/:id", protectedRoute, adminRoute, deleteProduct);

export default router;
