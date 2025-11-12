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
  // ✅ Start with "sb" (sandbox) so UI loads instantly
  const [clientId, setClientId] = useState<string>("sb");

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const id = await getPaypalClientId();
        if (id) setClientId(id);
      } catch (error) {
        console.warn("Falling back to sandbox PayPal client ID");
      }
    };
    fetchClientId();
  }, []);

  const initialOptions = {
    clientId,
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
