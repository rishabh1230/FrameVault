import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import axios from "axios";
import Stripe from "stripe";
import mongoose from "mongoose";

// Initialize Stripe
let stripe;
try {
    if (!process.env.STRIPE_SECRET_KEY) {
        console.warn("STRIPE_SECRET_KEY is not set in environment variables");
        stripe = null;
    } else {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
} catch (error) {
    console.error("Failed to initialize Stripe:", error);
    stripe = null;
}

const generateAccessToken = async () => {
    try {
        if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
            throw new Error("PAYPAL_CLIENT_ID or PAYPAL_SECRET is not set in environment variables");
        }
        
        const base = process.env.NODE_ENV === 'production' 
            ? "https://api-m.paypal.com"
            : "https://api-m.sandbox.paypal.com";

        const auth = Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
        ).toString("base64");
        
        const { data } = await axios.post(
            `${base}/v1/oauth2/token`,
            "grant_type=client_credentials",
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        return data.access_token;
    } catch (error) {
        throw new ApiError(500, "Could not generate PayPal access token");
    }
};

const createOrder = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        throw new ApiError(400, "No order items");
    }

    // Import Film model for lookup
    const { Film } = await import("../models/film.model.js");

    // Process order items: try to find Film by title, but don't require it
    const processedOrderItems = await Promise.all(
        orderItems.map(async (item) => {
            const orderItem = {
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            };

            // Try to find film by title if film ID was provided
            if (item.film) {
                try {
                    // If it's already a valid ObjectId, use it
                    if (mongoose.Types.ObjectId.isValid(item.film)) {
                        const film = await Film.findById(item.film);
                        if (film) {
                            orderItem.film = film._id;
                        }
                    } else {
                        // Otherwise, try to find by title
                        const film = await Film.findOne({ title: item.name });
                        if (film) {
                            orderItem.film = film._id;
                        }
                    }
                } catch (error) {
                    // If film lookup fails, just continue without film reference
                    console.warn(`Could not find film for item: ${item.name}`);
                }
            }

            return orderItem;
        })
    );

    const order = new Order({
        user: req.user._id,
        orderItems: processedOrderItems,
        shippingAddress,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    const createdOrder = await order.save();

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdOrder,
                "Order created successfully"
            )
        );
});

const getMyOrders = asyncHandler(async (req, res) => {
    // Finds orders for the currently logged-in user
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "User orders fetched successfully"));
});


const getPaypalClientId = asyncHandler(async (req, res) => {
    // Sends only the client ID to the frontend for the SDK
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { clientId: process.env.PAYPAL_CLIENT_ID },
                "PayPal client ID fetched successfully"
            )
        );
});

const getStripePublishableKey = asyncHandler(async (req, res) => {
    // Sends only the publishable key to the frontend for the SDK
    if (!process.env.STRIPE_PUBLISHABLE_KEY) {
        throw new ApiError(500, "Stripe publishable key is not configured");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { publishableKey: process.env.STRIPE_PUBLISHABLE_KEY },
                "Stripe publishable key fetched successfully"
            )
        );
});

const createStripePaymentIntent = asyncHandler(async (req, res) => {
    if (!stripe) {
        throw new ApiError(500, "Stripe is not configured. Please check your environment variables.");
    }

    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
        throw new ApiError(400, "Order ID and amount are required");
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Verify the amount matches the order total
    const orderTotal = Math.round(order.totalPrice * 100); // Convert to cents
    const requestedAmount = Math.round(parseFloat(amount) * 100);

    if (orderTotal !== requestedAmount) {
        throw new ApiError(400, "Amount does not match order total");
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: orderTotal,
            currency: "usd",
            metadata: {
                orderId: order._id.toString(),
                userId: order.user.toString(),
            },
        });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { clientSecret: paymentIntent.client_secret },
                    "Payment intent created successfully"
                )
            );
    } catch (error) {
        console.error("Stripe payment intent creation error:", error);
        throw new ApiError(500, `Stripe error: ${error.message || "Failed to create payment intent"}`);
    }
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        // Step 1: Verify the payment with PayPal's API using the order ID from the client
        const accessToken = await generateAccessToken();
        const base = process.env.NODE_ENV === 'production' 
            ? "https://api-m.paypal.com"
            : "https://api-m.sandbox.paypal.com";
        
        const paypalOrderId = req.body.paypalOrderId; 

        // Get the order details from PayPal to verify payment
        const { data: paypalOrder } = await axios.get(
            `${base}/v2/checkout/orders/${paypalOrderId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Step 2: Ensure the transaction was successful and the total amount matches
        const totalAmount = parseFloat(order.totalPrice).toFixed(2);
        
        // This assumes the payment was successfully captured client-side 
        // and we are simply verifying the status and amount.
        const paypalCapture = paypalOrder.purchase_units[0].payments.captures[0];

        if (paypalOrder.status === 'COMPLETED' && 
            paypalCapture.amount.value === totalAmount &&
            paypalCapture.amount.currency_code === 'USD' // Adjust currency as needed
        ) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: paypalOrder.id,
                status: paypalOrder.status,
                update_time: paypalOrder.update_time,
                email_address: paypalOrder.payer.email_address,
            };

            const updatedOrder = await order.save();
            
            return res.json(
                new ApiResponse(
                    200,
                    updatedOrder,
                    "Order payment successful and recorded"
                )
            );

        } else {
            throw new ApiError(400, "PayPal payment verification failed. Status/Amount mismatch.");
        }
    } else {
        throw new ApiError(404, "Order not found");
    }
});

const updateOrderToPaidStripe = asyncHandler(async (req, res) => {
    if (!stripe) {
        throw new ApiError(500, "Stripe is not configured. Please check your environment variables.");
    }

    const order = await Order.findById(req.params.id);
    const { paymentIntentId } = req.body;

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (!paymentIntentId) {
        throw new ApiError(400, "Payment intent ID is required");
    }

    try {
        // Verify the payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        // Verify the amount matches
        const orderTotal = Math.round(order.totalPrice * 100);
        if (paymentIntent.amount !== orderTotal) {
            throw new ApiError(400, "Payment amount does not match order total");
        }

        // Verify payment was successful
        if (paymentIntent.status === "succeeded") {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentMethod = "Stripe";
            order.paymentResult = {
                id: paymentIntent.id,
                status: paymentIntent.status,
                update_time: new Date().toISOString(),
                email_address: paymentIntent.receipt_email || req.user.email || "",
            };

            const updatedOrder = await order.save();

            return res.json(
                new ApiResponse(
                    200,
                    updatedOrder,
                    "Order payment successful and recorded"
                )
            );
        } else {
            throw new ApiError(400, `Payment not completed. Status: ${paymentIntent.status}`);
        }
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, `Stripe verification error: ${error.message}`);
    }
});

export { 
    createOrder, 
    getMyOrders, 
    getPaypalClientId, 
    updateOrderToPaid,
    getStripePublishableKey,
    createStripePaymentIntent,
    updateOrderToPaidStripe
};