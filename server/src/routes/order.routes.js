import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {
    createOrder,
    getMyOrders,
    getPaypalClientId,
    updateOrderToPaid,
    getStripePublishableKey,
    createStripePaymentIntent,
    updateOrderToPaidStripe,
} from "../controllers/order.controllers.js";

const router = Router();

// Routes for authenticated users
router.route("/").post(verifyJWT, createOrder); // Create new order (before payment)
router.route("/myorders").get(verifyJWT, getMyOrders); // Get user's orders

// Public routes to get payment gateway keys for the client SDK
router.route("/paypal-client-id").get(getPaypalClientId); 
router.route("/stripe-publishable-key").get(getStripePublishableKey);

// Stripe payment routes
router.route("/stripe/create-payment-intent").post(verifyJWT, createStripePaymentIntent);
router.route("/:id/pay").put(verifyJWT, updateOrderToPaid); // Update order status to paid (PayPal)
router.route("/:id/pay/stripe").put(verifyJWT, updateOrderToPaidStripe); // Update order status to paid (Stripe)

export default router;