import React, { useEffect, useState } from "react";
import { Order } from "../types/Order";
import { fetchMyOrders } from "../api/order";
import { toast } from "react-toastify";

export const MyOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getOrders = async () => {
            try {
                setLoading(true);
                const userOrders = await fetchMyOrders();
                setOrders(userOrders);
                setError(null);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to fetch orders.");
                toast.error(err.message || "Failed to fetch orders.");
            } finally {
                setLoading(false);
            }
        };
        getOrders();
    }, []);

    if (loading) {
        return <div className="text-center text-xl mt-8">Loading your orders...</div>;
    }

    if (error) {
        return <div className="text-center text-xl mt-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 text-yellow-400 border-b border-gray-700 pb-3">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center p-10 bg-gray-800 rounded-lg">
                    <p className="text-lg">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                            <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-3">
                                <h2 className="text-xl font-semibold text-white">Order ID: <span className="text-yellow-400">{order._id.slice(-8)}</span></h2>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${order.isPaid ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                    {order.isPaid ? `Paid on ${new Date(order.paidAt!).toLocaleDateString()}` : 'Not Paid'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-gray-300 mb-4">
                                <div>
                                    <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p><strong>Total:</strong> <span className="font-bold text-lg text-yellow-400">${order.totalPrice.toFixed(2)}</span></p>
                                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                </div>
                                <div>
                                    <p><strong>Shipping To:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                    <p><strong>Status:</strong> {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt!).toLocaleDateString()}` : 'Processing'}</p>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold mt-4 mb-2 border-t border-gray-700 pt-3">Items</h3>
                            <ul className="space-y-1">
                                {order.orderItems.map((item, index) => (
                                    <li key={index} className="flex justify-between text-gray-400 text-sm">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};