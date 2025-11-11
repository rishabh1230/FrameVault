import { Film } from "./Film"; // Assuming Film type exists in this location

export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    film: string; // The MongoDB ObjectId of the Film/Product
}

export interface ShippingAddress {
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface PaymentResult {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
}

export interface Order {
    _id: string;
    user: string; // The MongoDB ObjectId of the User
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: 'PayPal' | 'Stripe' | string;
    paymentResult?: PaymentResult;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    createdAt: string;
    updatedAt: string;
}

// Data structure required to create an order (sent to the server)
export interface CreateOrderData {
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
}