import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTelegram } from './hooks/useTelegram';
import { setInitData } from './api/client';
import { getCart } from './utils/cart';
import { CartItem } from './types';

import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { SupportPage } from './pages/SupportPage';
import { BottomNavigation } from './components/BottomNavigation';
// import { FloatingCart } from './components/FloatingCart'; // Replaced by BottomNavigation

// iOS-style page transition variants
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const pageTransition: any = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.25,
};

function AppContent() {
  const { initData, colorScheme } = useTelegram();
  const [cart, setCart] = useState<CartItem[]>([]);
  const location = useLocation();

  // Apply theme from Telegram
  useEffect(() => {
    if (colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [colorScheme]);

  useEffect(() => {
    if (initData) {
      setInitData(initData);
    }

    // Cart sync - poll localStorage for cart changes
    setCart(getCart());
    const handleStorageChange = () => {
      setCart(getCart());
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(() => {
      setCart(getCart());
    }, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [initData]);

  // Hide bottom nav on checkout and success pages
  const hideBottomNav = location.pathname.match(/\/(checkout|order-success)/);

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={pageTransition}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation - Shows on main screens (home, cart, support) */}
      {!hideBottomNav && <BottomNavigation />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
