import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { getCartTotal, getCartCount } from '../utils/cart';

interface FloatingCartProps {
  cart: CartItem[];
}

export const FloatingCart = ({ cart }: FloatingCartProps) => {
  const navigate = useNavigate();
  const count = getCartCount(cart);
  const total = getCartTotal(cart);

  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pointer-events-none">
      <button
        onClick={() => navigate('/cart')}
        className="
          w-full bg-green-600 text-white rounded-2xl py-4 px-6 shadow-lg shadow-green-600/30
          flex items-center justify-between
          active:scale-[0.98] transition-all duration-150
          pointer-events-auto
        "
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-xl">🛒</span>
            <div className="absolute -top-1 -right-1 bg-white text-green-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {count}
            </div>
          </div>
          <span className="font-semibold text-base">View Cart</span>
        </div>
        <span className="font-bold text-lg">
          {total.toLocaleString('en-US')} ฿
        </span>
      </button>
    </div>
  );
};
