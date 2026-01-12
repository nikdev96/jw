import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { EmptyState } from '../components/EmptyState';
import { CartItem } from '../types';
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  getCartTotal,
} from '../utils/cart';

// iOS-style tap feedback
const tapScale: any = {
  scale: 0.97,
  transition: { type: 'tween', duration: 0.12, ease: 'easeOut' },
};

// Stagger animation for cart items
const containerVariants: any = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'tween', duration: 0.25, ease: 'easeOut' },
  },
};

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
          title="Your cart is empty"
          description="Add some products to get started"
          action={
            <motion.button
              onClick={() => navigate('/')}
              whileTap={tapScale}
              className="bg-accent text-dark-bg px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-accent/30 active:scale-95 transition-all"
            >
              Browse Catalog
            </motion.button>
          }
        />
      </>
    );
  }

  return (
    <>
      <Header title="Cart" showBack />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pb-32 transition-colors">
        <motion.div
          className="p-4 space-y-3 mb-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {cart.map((item) => (
            <motion.div
              key={item.product.id}
              variants={itemVariants}
              className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-sm shadow-gray-200/50 dark:shadow-dark-border/20 flex gap-3 transition-colors"
            >
              {item.product.images[0] ? (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 dark:from-dark-surface dark:to-dark-card rounded-xl flex items-center justify-center text-3xl flex-shrink-0 transition-colors">
                  🌿
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 transition-colors">
                  {item.product.name}
                </h3>
                <p className="text-accent font-bold mb-2">
                  {item.product.price.toLocaleString('en-US')} ฿
                </p>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() =>
                      handleUpdateQuantity(item.product.id, item.quantity - 1)
                    }
                    whileTap={tapScale}
                    className="w-8 h-8 bg-gray-100 dark:bg-dark-surface rounded-lg flex items-center justify-center active:scale-95 text-gray-900 dark:text-gray-100 font-semibold transition-colors"
                  >
                    −
                  </motion.button>
                  <span className="w-8 text-center font-medium text-gray-900 dark:text-gray-100 transition-colors">
                    {item.quantity}
                  </span>
                  <motion.button
                    onClick={() =>
                      handleUpdateQuantity(item.product.id, item.quantity + 1)
                    }
                    whileTap={tapScale}
                    className="w-8 h-8 bg-gray-100 dark:bg-dark-surface rounded-lg flex items-center justify-center active:scale-95 text-gray-900 dark:text-gray-100 font-semibold transition-colors"
                  >
                    +
                  </motion.button>
                  <motion.button
                    onClick={() => handleRemove(item.product.id)}
                    whileTap={tapScale}
                    className="ml-auto text-red-600 dark:text-red-400 text-sm font-medium active:scale-95 transition-colors"
                  >
                    Remove
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="px-4">
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-4 mb-4 shadow-sm shadow-gray-200/50 dark:shadow-dark-border/20 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400 transition-colors">Subtotal</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                {total.toLocaleString('en-US')} ฿
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-gray-900 dark:text-gray-100 transition-colors">Total</span>
              <span className="text-accent">{total.toLocaleString('en-US')} ฿</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-dark-border transition-colors">
        <motion.button
          onClick={() => navigate('/checkout')}
          whileTap={tapScale}
          className="w-full bg-accent text-dark-bg py-4 rounded-xl font-semibold shadow-lg shadow-accent/30 active:scale-95 transition-transform"
        >
          Proceed to Checkout
        </motion.button>
      </div>
    </>
  );
};
