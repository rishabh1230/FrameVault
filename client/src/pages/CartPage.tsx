import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate import
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Mock price per film to calculate subtotal
const FILM_PRICE = 39.99;

const CartPage: React.FC = () => {
  const { cart, itemCount, removeItemFromCart, clearCart } = useCart();
  const navigate = useNavigate(); // Initialize navigate

  const subtotal = cart.reduce((total, item) => total + item.quantity * FILM_PRICE, 0);

  // Handler to navigate to checkout page
  const handlePlaceOrder = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-cinema-bg text-cinema-text-primary py-12">
      <div className="container mx-auto px-4">
        {/* Title Section */}
        <div className="flex items-center gap-4 mb-10">
          <ShoppingCart size={32} className="text-cinema-accent" />
          <h1 className="text-4xl md:text-5xl font-black text-cinema-text-primary leading-tight">
            YOUR
            <span className="block text-cinema-accent">CART</span>
          </h1>
        </div>

        {/* Continue Shopping Link */}
        <Link 
          to="/films"
          className="inline-flex items-center gap-2 text-cinema-text-secondary hover:text-cinema-accent transition-colors group mb-8 font-medium uppercase tracking-wider"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </Link>

        {/* Empty Cart State */}
        {itemCount === 0 ? (
          <div className="text-center py-20 bg-cinema-card rounded-xl shadow-2xl border border-cinema-text-secondary/10">
            <h2 className="text-2xl font-bold mb-4">Your vault is empty!</h2>
            <p className="text-cinema-text-secondary mb-6">Start collecting those cinematic masterpieces.</p>
            <Link 
              to="/films" 
              className="px-6 py-3 bg-cinema-accent text-white font-bold uppercase tracking-wide rounded-lg hover:bg-cinema-text-primary transition-colors shadow-lg"
            >
              Browse Films
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center bg-cinema-card p-4 sm:p-6 rounded-xl shadow-xl border-l-4 border-cinema-accent transition-shadow hover:shadow-2xl"
                >
                  <img
                    src={item.image || `https://placehold.co/80x110/333333/999999?text=Poster`}
                    alt={item.title}
                    className="w-20 h-28 object-cover mr-4 sm:mr-6 rounded-md shadow-lg"
                  />
                  <div className="flex-grow mt-4 sm:mt-0">
                    <Link 
                      to={`/film/${item.id}`} 
                      className="text-xl font-bold hover:text-cinema-accent transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <p className="text-cinema-text-secondary text-sm italic">Directed by: {item.director}</p>
                    <p className="text-lg font-black mt-2">${(FILM_PRICE).toFixed(2)}</p>
                    <div className="mt-2 flex items-center text-cinema-text-secondary">
                      <span className='font-bold mr-2'>Quantity: {item.quantity}</span>
                      <span className='mx-3'>|</span>
                      <span className='font-bold'>Total: ${(FILM_PRICE * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItemFromCart(item.id)}
                    className="ml-auto mt-4 sm:mt-0 p-2 text-red-500 hover:text-red-700 bg-red-500/10 rounded-full transition-colors"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary & Actions */}
            <div className="lg:col-span-1 mt-10 lg:mt-0 sticky lg:top-28">
              <div className="bg-cinema-card p-6 rounded-xl shadow-2xl border border-cinema-accent/30 space-y-4">
                <h2 className="text-2xl font-black uppercase tracking-wider mb-4 border-b pb-3 border-cinema-text-secondary/30">
                  Order Summary
                </h2>
                <div className="flex justify-between text-lg font-medium">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}):</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-lg font-medium">
                  <span>Shipping:</span>
                  <span className="text-green-400 font-bold">FREE</span>
                </div>

                <div className="flex justify-between text-lg font-medium">
                  <span>Taxes (Mock):</span>
                  <span>$0.00</span>
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-cinema-text-secondary/30 flex justify-between items-center text-3xl font-black text-cinema-accent">
                  <span>TOTAL:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-cinema-accent text-white px-6 py-4 mt-6 font-black uppercase tracking-widest rounded-lg hover:bg-cinema-text-primary hover:text-cinema-bg transition-colors shadow-lg transform hover:scale-[1.01]"
                >
                  Place Order
                </button>

                {/* Clear Cart Button */}
                <button
                  onClick={clearCart}
                  className="w-full border-2 border-red-500 text-red-500 px-6 py-3 font-bold uppercase tracking-wide rounded-lg hover:bg-red-500 hover:text-white transition-colors mt-2"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
