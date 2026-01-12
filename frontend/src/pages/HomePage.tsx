import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import { Category } from '../types';
import { CategoryCard } from '../components/CategoryCard';
import { CategorySkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { PageContainer } from '../components/PageContainer';

// Stagger animation for category cards
const containerVariants: any = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants: any = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'tween', duration: 0.3, ease: 'easeOut' },
  },
};

export const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (name: string): string => {
    const icons: Record<string, string> = {
      Flower: '🌿',
      Edibles: '🍪',
      'Pre-Rolls': '🚬',
      Delivery: '🚚',
      Payments: '💳',
      Education: '📚',
      Merch: '👕',
      Support: '💬',
    };
    return icons[name] || '📦';
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="pt-6 pb-5 px-4 text-center bg-gradient-to-b from-green-50/40 via-white/20 to-transparent dark:from-dark-surface/60 dark:via-dark-bg/20 dark:to-transparent transition-colors">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
            <span className="text-2xl">🌿</span> JUSTWEED
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1.5 font-medium transition-colors">Premium Cannabis Store</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 transition-colors">Local delivery · 30–90 min</p>
        </div>
        <div className="px-4 grid grid-cols-2 gap-3 mt-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer withPadding={false}>
        <EmptyState
          icon="⚠️"
          title="Connection Error"
          description={error}
          action={
            <button
              onClick={loadCategories}
              className="bg-accent text-dark-bg px-8 py-3 rounded-xl font-semibold shadow-lg shadow-accent/30 active:scale-[0.98] transition-all"
            >
              Retry
            </button>
          }
        />
      </PageContainer>
    );
  }

  if (categories.length === 0) {
    return (
      <PageContainer withPadding={false}>
        <EmptyState
          icon="📦"
          title="No categories available"
          description="Check back soon for new products"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-[420px] mx-auto w-full pb-20">
        {/* Hero section with subtle gradient */}
        <div className="pt-6 pb-5 px-4 text-center bg-gradient-to-b from-green-50/40 via-white/20 to-transparent dark:from-dark-surface/60 dark:via-dark-bg/20 dark:to-transparent transition-colors">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
            <span className="text-2xl">🌿</span> JUSTWEED
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1.5 font-medium transition-colors">Premium Cannabis Store</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 transition-colors">Local delivery · 30–90 min</p>
        </div>

        <motion.div
          className="px-4 grid grid-cols-2 gap-3 mt-1"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={cardVariants}>
              <CategoryCard
                name={category.name}
                icon={getCategoryIcon(category.name)}
                isInfoOnly={category.is_info_only}
                comingSoon={category.coming_soon}
                onClick={() => navigate(`/category/${category.id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageContainer>
  );
};
