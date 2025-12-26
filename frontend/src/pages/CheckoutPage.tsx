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
      <div className="p-4 pb-32">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order summary */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    {(item.product.price * item.quantity).toFixed(2)} ฿
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold">
                <span>Total</span>
                <span>{total.toFixed(2)} ฿</span>
              </div>
            </div>
          </div>

          {/* Delivery details */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Delivery Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your address"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tg-button"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tg-button"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a note for your order"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tg-button resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment method info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">💳 Payment</h3>
            <p className="text-blue-800 text-sm">
              Payment on delivery (cash or card)
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`
            w-full bg-green-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-green-600/20
            active:scale-95 transition-transform
            ${loading ? 'opacity-50' : ''}
          `}
        >
          {loading ? 'Placing Order...' : `Confirm Order (${total.toFixed(2)} ฿)`}
        </button>
      </div>
    </>
  );
};
