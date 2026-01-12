import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { EmptyState } from '../components/EmptyState';
import { api } from '../api/client';
import { CartItem, OrderCreate } from '../types';
import { getCart, clearCart, getCartTotal } from '../utils/cart';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    const currentCart = getCart();
    if (currentCart.length === 0) {
      navigate('/cart');
    }
    setCart(currentCart);
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!deliveryAddress.trim() || !phone.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderData: OrderCreate = {
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        delivery_address: deliveryAddress,
        phone: phone,
        comment: comment || undefined,
      };

      const order = await api.createOrder(orderData);

      // Clear cart
      clearCart();

      // Navigate to success page
      navigate('/order-success', { state: { orderId: order.id } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const total = getCartTotal(cart);

  if (cart.length === 0) {
    return (
      <>
        <Header title="Checkout" showBack />
        <EmptyState
          icon="🛒"
          title="Cart is empty"
          description="Add products before checkout"
        />
      </>
    );
  }

  return (
    <>
      <Header title="Checkout" showBack />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg p-4 pb-32 transition-colors">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order summary */}
          <div className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-sm shadow-gray-200/50 dark:shadow-dark-border/20 transition-colors">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors">Order Summary</h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 transition-colors">
                    {(item.product.price * item.quantity).toLocaleString('en-US')} ฿
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200 dark:border-dark-border flex justify-between font-bold transition-colors">
                <span className="text-gray-900 dark:text-gray-100 transition-colors">Total</span>
                <span className="text-accent">{total.toLocaleString('en-US')} ฿</span>
              </div>
            </div>
          </div>

          {/* Delivery details */}
          <div className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-sm shadow-gray-200/50 dark:shadow-dark-border/20 transition-colors">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors">Delivery Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your address"
                  required
                  className="w-full px-4 py-2
                             border border-gray-300 dark:border-dark-border
                             rounded-xl
                             bg-white dark:bg-dark-surface
                             text-gray-900 dark:text-gray-100
                             placeholder:text-gray-400 dark:placeholder:text-gray-500
                             focus:outline-none focus:ring-2 focus:ring-accent
                             transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+66 (xx) xxx-xxxx"
                  required
                  className="w-full px-4 py-2
                             border border-gray-300 dark:border-dark-border
                             rounded-xl
                             bg-white dark:bg-dark-surface
                             text-gray-900 dark:text-gray-100
                             placeholder:text-gray-400 dark:placeholder:text-gray-500
                             focus:outline-none focus:ring-2 focus:ring-accent
                             transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">
                  Comment (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a note for your order"
                  rows={3}
                  className="w-full px-4 py-2
                             border border-gray-300 dark:border-dark-border
                             rounded-xl
                             bg-white dark:bg-dark-surface
                             text-gray-900 dark:text-gray-100
                             placeholder:text-gray-400 dark:placeholder:text-gray-500
                             focus:outline-none focus:ring-2 focus:ring-accent
                             resize-none
                             transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Payment method info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-2xl p-4 transition-colors">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 transition-colors">💳 Payment</h3>
            <p className="text-blue-800 dark:text-blue-400 text-sm transition-colors">
              Payment on delivery (cash or card)
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl p-4 transition-colors">
              <p className="text-red-800 dark:text-red-400 text-sm transition-colors">{error}</p>
            </div>
          )}
        </form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-dark-border transition-colors">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`
            w-full bg-accent text-dark-bg py-4 rounded-xl font-semibold shadow-lg shadow-accent/30
            active:scale-95 transition-transform
            ${loading ? 'opacity-50' : ''}
          `}
        >
          {loading ? 'Placing Order...' : `Confirm Order (${total.toLocaleString('en-US')} ฿)`}
        </button>
      </div>
    </>
  );
};
