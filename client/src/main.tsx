// client/src/main.tsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { getPaypalClientId } from "./api/order.ts";

const Root = () => {
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const id = await getPaypalClientId();
        setClientId(id);
      } catch (error) {
        setClientId("sb"); // fallback to sandbox
      } finally {
        setLoading(false);
      }
    };
    fetchClientId();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        Loading Payment Gateway...
      </div>
    );
  }

  const initialOptions = {
    clientId: clientId || "sb",
    currency: "USD",
  };

  return (
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <PayPalScriptProvider options={initialOptions}>
              <App />
            </PayPalScriptProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
