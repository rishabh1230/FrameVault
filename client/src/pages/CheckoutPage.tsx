
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { 
  createOrder, 
  createStripePaymentIntent, 
  payOrderStripe,
  getStripePublishableKey 
} from "../api/order";
import { CreateOrderData } from "../types/Order";

const FILM_PRICE = 39.99;
const StripeCheckoutForm: React.FC<{
  orderId: string;
  amount: number;
  clientSecret: string;
  onSuccess: () => void;
}> = ({ orderId, amount, clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false); // Track if card is complete
  const [cardError, setCardError] = useState<string | null>(null);
  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is not ready. Please wait...");
      return;
    }

    if (!cardComplete) {
      toast.error("Please complete all card details");
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      console.log("Confirming payment with client secret...");
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      console.log("Payment result:", { error, paymentIntent: paymentIntent?.id, status: paymentIntent?.status });

      if (error) {
        console.error("Stripe payment error:", error);
        toast.error(error.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded, updating order on server...");
        try {
          await payOrderStripe(orderId, paymentIntent.id);
          toast.success("Payment successful! Thank you for your order.");
          setTimeout(() => {
            onSuccess();
          }, 1000);
        } catch (serverError: any) {
          console.error("Failed to update order on server:", serverError);
          toast.error("Payment succeeded but failed to update order. Please contact support.");
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        console.error("Payment intent status:", paymentIntent?.status);
        toast.error(`Payment status: ${paymentIntent?.status || "unknown"}`);
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error("Stripe payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#ffffff",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-cinema-text-secondary/40 rounded-md bg-cinema-bg">
        <CardElement 
          options={cardElementOptions} 
          onChange={handleCardChange}
        />
      </div>
      {cardError && (
        <p className="text-red-500 text-sm">{cardError}</p>
      )}
      {!cardComplete && (
        <p className="text-yellow-500 text-sm">Please complete all card fields to continue</p>
      )}
      <button
        type="submit"
        disabled={!stripe || isProcessing || !cardComplete}
        className="w-full bg-cinema-accent text-white py-3 px-6 rounded-md font-semibold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [{ isPending: isPayPalPending }] = usePayPalScriptReducer();
  const { cart, clearCart } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "stripe">("paypal");
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false);

  // Shipping form state
  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const subtotal = cart.reduce((sum, item) => sum + (FILM_PRICE * item.quantity), 0);
  const shippingCost = 0;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shippingCost + tax;
  const isShippingValid = Object.values(shipping).every((field) => field.trim() !== "");

  // Load Stripe publishable key
  useEffect(() => {
    const loadStripeKey = async () => {
      try {
        const publishableKey = await getStripePublishableKey();
        if (publishableKey) {
          setStripePromise(loadStripe(publishableKey));
        }
      } catch (error) {
        console.error("Failed to load Stripe key:", error);
      }
    };
    loadStripeKey();
  }, []);

  useEffect(() => {
    const createOrderIfNeeded = async () => {
      if (isShippingValid && cart.length > 0 && !orderId && !isCreatingOrder) {
        setIsCreatingOrder(true);
        try {
          const orderData: CreateOrderData = {
            orderItems: cart.map((item) => ({
              name: item.title,
              quantity: item.quantity,
              price: FILM_PRICE,
              film: item.id.toString(),
            })),
            shippingAddress: shipping,
            itemsPrice: subtotal,
            taxPrice: tax,
            shippingPrice: shippingCost,
            totalPrice: total,
          };

          const createdOrder = await createOrder(orderData);
          setOrderId(createdOrder._id);
        } catch (error: any) {
          console.error("Failed to create order:", error);
          toast.error("Failed to create order. Please try again.");
        } finally {
          setIsCreatingOrder(false);
        }
      }
    };

    createOrderIfNeeded();
  }, [isShippingValid, cart, shipping, subtotal, tax, shippingCost, total, orderId, isCreatingOrder]);

 
  useEffect(() => {
    const createPaymentIntentIfNeeded = async () => {
      if (
        paymentMethod === "stripe" &&
        orderId &&
        total > 0 &&
        !stripeClientSecret &&
        !isCreatingPaymentIntent &&
        stripePromise
      ) {
        setIsCreatingPaymentIntent(true);
        try {
          const clientSecret = await createStripePaymentIntent(orderId, total);
          setStripeClientSecret(clientSecret);
        } catch (error: any) {
          console.error("Failed to create payment intent:", error);
          toast.error("Failed to initialize payment. Please try again.");
        } finally {
          setIsCreatingPaymentIntent(false);
        }
      }
    };

    createPaymentIntentIfNeeded();
  }, [paymentMethod, orderId, total, stripeClientSecret, isCreatingPaymentIntent, stripePromise]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({
      ...shipping,
      [e.target.name]: e.target.value,
    });
  };

  // PayPal createOrder callback
  const createPayPalOrder = (_data: any, actions: any) => {
    if (!isShippingValid) {
      toast.error("Please fill in all shipping details.");
      throw new Error("Invalid shipping information");
    }
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total.toFixed(2),
            currency_code: "USD",
          },
        },
      ],
    });
  };

  const onPayPalApprove = async (_data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
    
      
      toast.success("Payment successful! Thank you for your order.");
      clearCart(); // Clear cart after successful payment
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error("PayPal payment error:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  const handlePaymentSuccess = () => {
    clearCart(); // Clear cart after successful payment
    console.log("Redirecting to profile page...");
    navigate("/profile");
  };

  const stripeOptions: StripeElementsOptions = stripeClientSecret
    ? {
        clientSecret: stripeClientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#e50914",
            colorBackground: "#1a1a1a",
            colorText: "#ffffff",
            colorDanger: "#df1b41",
            fontFamily: "system-ui, sans-serif",
            spacingUnit: "4px",
            borderRadius: "4px",
          },
        },
      }
    : {
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#e50914",
            colorBackground: "#1a1a1a",
            colorText: "#ffffff",
            colorDanger: "#df1b41",
            fontFamily: "system-ui, sans-serif",
            spacingUnit: "4px",
            borderRadius: "4px",
          },
        },
      };

  return (
    <div className="max-w-5xl mx-auto bg-cinema-card p-8 rounded-lg shadow-xl mt-12 mb-24 text-cinema-text-primary">
      <h1 className="text-3xl font-bold mb-8 text-cinema-accent uppercase">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Shipping Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 border-b border-cinema-text-secondary/40 pb-2">
            Shipping Information
          </h2>
          <form className="space-y-5">
            {[
              { label: "Address", name: "address" },
              { label: "City", name: "city" },
              { label: "Postal Code", name: "postalCode" },
              { label: "Country", name: "country" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label htmlFor={name} className="block mb-2 font-medium capitalize">
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type="text"
                  value={shipping[name as keyof typeof shipping]}
                  onChange={handleChange}
                  className="w-full rounded-md border border-cinema-text-secondary/40 bg-cinema-bg px-3 py-2 text-cinema-text-primary focus:border-cinema-accent focus:ring-2 focus:ring-cinema-accent outline-none"
                  placeholder={`Enter your ${label.toLowerCase()}`}
                />
              </div>
            ))}
          </form>
        </div>

        {/* Order Summary & Payment */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 border-b border-cinema-text-secondary/40 pb-2">
            Order Summary
          </h2>
          <div className="space-y-3 text-lg">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="text-green-400 font-bold">${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between mt-6 pt-6 border-t-2 border-cinema-accent text-cinema-accent font-black text-2xl uppercase">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* Payment Method Selection */}
          <div className="mt-10">
            <h3 className="mb-4 font-semibold text-xl">Payment Method</h3>
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  paymentMethod === "paypal"
                    ? "bg-cinema-accent text-white"
                    : "bg-cinema-bg border border-cinema-text-secondary/40 text-cinema-text-primary"
                }`}
              >
                PayPal
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("stripe")}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  paymentMethod === "stripe"
                    ? "bg-cinema-accent text-white"
                    : "bg-cinema-bg border border-cinema-text-secondary/40 text-cinema-text-primary"
                }`}
              >
                Stripe
              </button>
            </div>

            {/* PayPal Payment */}
            {paymentMethod === "paypal" && (
              <div>
                <h4 className="mb-4 font-semibold">Pay with PayPal</h4>
                {isPayPalPending ? (
                  <div className="text-center text-cinema-accent">Loading PayPal...</div>
                ) : (
                  <PayPalButtons
                    style={{ layout: "vertical", color: "gold" }}
                    disabled={!isShippingValid || !orderId}
                    createOrder={createPayPalOrder}
                    onApprove={onPayPalApprove}
                    onError={(err) => {
                      console.error("PayPal error", err);
                      toast.error("Payment failed. Please try again.");
                    }}
                  />
                )}
              </div>
            )}

            {/* Stripe Payment */}
            {paymentMethod === "stripe" && (
              <div>
                <h4 className="mb-4 font-semibold">Pay with Stripe</h4>
                {!stripePromise ? (
                  <div className="text-center text-cinema-accent">Loading Stripe...</div>
                ) : !isShippingValid ? (
                  <p className="text-red-500">Please complete all shipping fields to enable payment.</p>
                ) : !orderId ? (
                  <p className="text-cinema-text-secondary">
                    {isCreatingOrder ? "Creating order..." : "Please wait..."}
                  </p>
                ) : isCreatingPaymentIntent ? (
                  <div className="text-center text-cinema-accent">Initializing payment...</div>
                ) : !stripeClientSecret ? (
                  <p className="text-red-500">Failed to initialize payment. Please try again.</p>
                ) : (
                  <Elements stripe={stripePromise} options={stripeOptions}>
                    <StripeCheckoutForm
                      orderId={orderId}
                      amount={total}
                      clientSecret={stripeClientSecret}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                )}
              </div>
            )}

            {!isShippingValid && (
              <p className="mt-2 text-red-500 text-sm">
                Please complete all shipping fields to enable payment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;