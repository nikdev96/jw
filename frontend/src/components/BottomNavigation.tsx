import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShoppingCart, MessageCircle } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  path: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Catalog',
    icon: Home,
    path: '/',
  },
  {
    id: 'cart',
    label: 'Cart',
    icon: ShoppingCart,
    path: '/cart',
  },
  {
    id: 'support',
    label: 'Support',
    icon: MessageCircle,
    path: '/support',
  },
];

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/category');
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border safe-area-bottom z-50 transition-colors">
      <div className="max-w-[420px] mx-auto px-2 py-1">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all active:scale-95 min-w-[70px] relative"
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-accent-soft rounded-xl"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}

                {/* Icon */}
                <div className="relative mb-0.5">
                  <Icon
                    size={24}
                    strokeWidth={2.5}
                    className={`transition-colors ${
                      active
                        ? 'text-accent drop-shadow-[0_0_8px_rgba(199,240,0,0.4)]'
                        : 'text-gray-700 dark:text-gray-400'
                    }`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`text-[11px] font-semibold relative transition-colors ${
                    active
                      ? 'text-accent drop-shadow-[0_0_6px_rgba(199,240,0,0.3)]'
                      : 'text-gray-700 dark:text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
