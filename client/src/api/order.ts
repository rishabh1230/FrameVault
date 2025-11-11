import api from "./axios"; // (Assuming axiosInstance is correctly configured)
import { Order, CreateOrderData } from "../types/Order";

/**
 * Creates a new order entry on the server.
 * @param orderData - The structured data for the new order.
 * @returns The created Order object.
 */
export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
    try {
        const { data } = await api.post("/orders", orderData);
        // Assuming the server response has the data inside a 'data' property (as per ApiResponse utility)
        return data.data; 
    } catch (error) {
        throw new Error("Failed to create order.");
    }
};

/**
 * Fetches the PayPal Client ID from the server.
 * @returns The PayPal client ID string.
 */
export const getPaypalClientId = async (): Promise<string> => {
    try {
        const { data } = await api.get("/orders/paypal-client-id");
        return data.data.clientId;
    } catch (error) {
        // If the fetch fails, the app will use the default "sb" (sandbox) 
        // which might still work, or simply display an error.
        console.error("Failed to fetch PayPal client ID, falling back to 'sb'.", error);
        return "sb"; 
    }
};

/**
 * Updates the order on the server after a successful PayPal payment.
 * @param orderId - The ID of the order to update.
 * @param paypalOrderId - The ID returned by PayPal after successful payment.
 * @returns The updated Order object.
 */
export const payOrder = async (orderId: string, paypalOrderId: string): Promise<Order> => {
    try {
        const { data } = await api.put(`/orders/${orderId}/pay`, {
            paypalOrderId,
        });
        return data.data;
    } catch (error) {
        throw new Error("Failed to finalize order payment on server.");
    }
};

/**
 * Fetches all orders for the currently logged-in user.
 * @returns An array of Order objects.
 */
export const fetchMyOrders = async (): Promise<Order[]> => {
    try {
        const { data } = await api.get("/orders/myorders");
        return data.data;
    } catch (error) {
        throw new Error("Failed to fetch user orders.");
    }
};

/**
 * Fetches the Stripe publishable key from the server.
 * @returns The Stripe publishable key string.
 */
export const getStripePublishableKey = async (): Promise<string> => {
    try {
        const { data } = await api.get("/orders/stripe-publishable-key");
        return data.data.publishableKey;
    } catch (error) {
        console.error("Failed to fetch Stripe publishable key.", error);
        throw new Error("Failed to fetch Stripe publishable key.");
    }
};

/**
 * Creates a Stripe payment intent for an order.
 * @param orderId - The ID of the order.
 * @param amount - The total amount to charge.
 * @returns The client secret for the payment intent.
 */
export const createStripePaymentIntent = async (orderId: string, amount: number): Promise<string> => {
    try {
        const { data } = await api.post("/orders/stripe/create-payment-intent", {
            orderId,
            amount,
        });
        return data.data.clientSecret;
    } catch (error) {
        throw new Error("Failed to create Stripe payment intent.");
    }
};

/**
 * Updates the order on the server after a successful Stripe payment.
 * @param orderId - The ID of the order to update.
 * @param paymentIntentId - The ID of the Stripe payment intent.
 * @returns The updated Order object.
 */
export const payOrderStripe = async (orderId: string, paymentIntentId: string): Promise<Order> => {
    try {
        const { data } = await api.put(`/orders/${orderId}/pay/stripe`, {
            paymentIntentId,
        });
        return data.data;
    } catch (error) {
        throw new Error("Failed to finalize order payment on server.");
    }
};