import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js'
import { checkoutSuccess, createCheckoutSession } from '../controllers/payment.controller.js'

const router = express.Router()

router.post("/create-checkout-session" , protectedRoute , createCheckoutSession)
router.post("/create-checkout-session" , protectedRoute , checkoutSuccess)

export default router