import express from "express";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";
import { analyticsData } from "../controllers/analytics.controller.js";

const router = express.Router()

router.get("/", protectedRoute, adminRoute, analyticsData )


export default router