import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { EmptyState } from '../components/EmptyState';
import { CartItem } from '../types';
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  getCartTotal,
} from '../utils/cart';

export const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    const updatedCart = updateCartItemQuantity(productId, quantity);
    setCart(updatedCart);
  };

  const handleRemove = (productId: number) => {
    const updatedCart = removeFromCart(productId);
    setCart(updatedCart);
  };

  const total = getCartTotal(cart);

  if (cart.length === 0) {
    return (
      <>
        <Header title="Cart" showBack />
        <EmptyState
          icon="🛒"
          title="Cart is empty"
          description="Add some products to get started"
          action={
            <button
              onClick={() => navigate('/')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Browse Products
            </button>
          }
        />
      </>
    );
  }

  return (
    <>
      <Header title="Cart" showBack />
      <div className="p-4 pb-24">
        <div className="space-y-3 mb-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-white rounded-lg p-4 shadow-sm flex gap-3"
            >
              {item.product.images[0] ? (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-3xl">
                  🌿
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.product.name}
                </h3>
                <p className="text-tg-button font-bold mb-2">
                  {item.product.price} ₽
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center active:scale-95"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center active:scale-95"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(item.product.id)}
                    className="ml-auto text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">{total.toFixed(2)} ₽</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>{total.toFixed(2)} ₽</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-green-600/20 active:scale-95 transition-transform"
        >
          Proceed to Checkout
        </button>
      </div>
    </>
  );
};
