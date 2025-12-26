import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';
import { Category, Product } from '../types';
import { Header } from '../components/Header';
import { ProductSkeleton, CategorySkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { addToCart } from '../utils/cart';

// iOS-style tap feedback
const tapScale = {
  scale: 0.97,
  transition: { type: 'tween', duration: 0.12, ease: 'easeOut' },
};

// Accordion animation
const accordionVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { type: 'tween', duration: 0.3, ease: 'easeOut' },
      opacity: { duration: 0.25, ease: 'easeOut' },
    },
  },
};

// Stagger for product cards
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'tween', duration: 0.25, ease: 'easeOut' },
  },
};

export const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [children, setChildren] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NEW: Accordion state for subcategories
  const [expandedSubcategoryId, setExpandedSubcategoryId] = useState<number | null>(null);
  const [subcategoryProducts, setSubcategoryProducts] = useState<Map<number, Product[]>>(new Map());

  useEffect(() => {
    if (id) {
      loadCategoryData(parseInt(id));
    }
  }, [id]);

  const loadCategoryData = async (categoryId: number) => {
    try {
      setLoading(true);
      setError(null);

      const [currentCategory, categoryChildren, categoryProducts] = await Promise.all([
        api.getCategory(categoryId),
        api.getCategoryChildren(categoryId),
        api.getProducts(categoryId),
      ]);

      setCategory(currentCategory);
      setChildren(categoryChildren);
      setProducts(categoryProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Toggle accordion and load products for subcategory
  const toggleSubcategory = async (subcategoryId: number) => {
    // If clicking on already expanded, collapse it
    if (expandedSubcategoryId === subcategoryId) {
      setExpandedSubcategoryId(null);
      return;
    }

    // Expand new subcategory
    setExpandedSubcategoryId(subcategoryId);

    // Load products if not already loaded
    if (!subcategoryProducts.has(subcategoryId)) {
      try {
        const products = await api.getProducts(subcategoryId);
        setSubcategoryProducts(new Map(subcategoryProducts).set(subcategoryId, products));
      } catch (err) {
        console.error('Failed to load subcategory products:', err);
      }
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    // Simple feedback
    const button = document.getElementById(`add-${product.id}`);
    if (button) {
      button.textContent = '✓ Added';
      setTimeout(() => {
        button.textContent = '+ Add';
      }, 1000);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Loading..." showBack />
        <div className="p-4 grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </>
    );
  }

  if (error || !category) {
    return (
      <>
        <Header title="Error" showBack />
        <EmptyState
          icon="⚠️"
          title="Error"
          description={error || 'Category not found'}
        />
      </>
    );
  }

  // Info-only category
  if (category.is_info_only) {
    return (
      <>
        <Header title={category.name} showBack />
        <div className="p-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h2 className="font-semibold text-blue-900 mb-2">Information</h2>
            <p className="text-blue-800 text-sm">
              This is an informational category. Content will be added soon.
            </p>
          </div>

          {children.length > 0 && (
            <div className="grid grid-cols-1 gap-2">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <h3 className="font-semibold text-gray-900">{child.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Detailed information coming soon
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  // UPDATED: Show subcategories as accordion (was: grid with navigate)
  if (children.length > 0) {
    return (
      <>
        <Header title={category.name} showBack />
        <div className="bg-gradient-to-b from-green-50/40 via-white to-white min-h-screen pb-6">
          <div className="p-4 space-y-3">
            {children.map((child) => {
              const isExpanded = expandedSubcategoryId === child.id;
              const childProducts = subcategoryProducts.get(child.id) || [];
              const previewProducts = childProducts.slice(0, 2); // Show only 2 products

              return (
                <div key={child.id} className="bg-white rounded-2xl shadow-sm shadow-gray-200/50 overflow-hidden">
                  {/* Accordion Header */}
                  <motion.button
                    onClick={() => toggleSubcategory(child.id)}
                    whileTap={tapScale}
                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🌿</span>
                      <h3 className="font-semibold text-gray-900">{child.name}</h3>
                    </div>
                    <motion.span
                      className="text-gray-400"
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
                    >
                      ▼
                    </motion.span>
                  </motion.button>

                  {/* Accordion Content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={accordionVariants}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4">
                      {previewProducts.length > 0 ? (
                        <>
                          <motion.div
                            className="grid grid-cols-2 gap-2.5 mb-3"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                          >
                            {previewProducts.map((product) => (
                              <motion.div
                                key={product.id}
                                variants={cardVariants}
                                className="bg-white rounded-xl overflow-hidden shadow-sm shadow-gray-200/50 flex flex-col h-full border border-gray-50"
                              >
                                {product.images[0] ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-24 object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-24 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                                    <span className="text-2xl">🌿</span>
                                  </div>
                                )}

                                <div className="p-2 flex flex-col flex-1">
                                  <h4 className="font-semibold text-xs text-gray-900 leading-snug mb-0.5 line-clamp-2 min-h-[28px]">
                                    {product.name}
                                  </h4>

                                  <div className="mt-auto pt-1">
                                    <div className="text-sm font-bold text-gray-900 mb-1.5">
                                      {product.price.toLocaleString('en-US')} ฿
                                    </div>

                                    <motion.button
                                      id={`add-${product.id}`}
                                      onClick={() => handleAddToCart(product)}
                                      whileTap={tapScale}
                                      className="w-full bg-green-600 text-white py-1.5 rounded-lg text-xs font-semibold"
                                    >
                                      + Add
                                    </motion.button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>

                          {/* Show More Button */}
                          {childProducts.length > 2 && (
                            <motion.button
                              onClick={() => navigate(`/category/${child.id}`)}
                              whileTap={tapScale}
                              className="w-full py-2.5 text-green-600 font-semibold text-sm"
                            >
                              Show all {childProducts.length} products →
                            </motion.button>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500 text-sm text-center py-4">No products yet</p>
                      )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // Show products
  if (products.length === 0) {
    return (
      <>
        <Header title={category.name} showBack />
        <EmptyState
          icon="🌿"
          title="No products yet"
          description="Check back soon for new arrivals"
        />
      </>
    );
  }

  return (
    <>
      <Header title={category.name} showBack />
      <div className="bg-gradient-to-b from-green-50/40 via-white to-white min-h-screen">
        <motion.div
          className="p-4 pb-24 grid grid-cols-2 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={cardVariants}>
              <div
                className="bg-white rounded-2xl overflow-hidden shadow-sm shadow-gray-200/50 flex flex-col h-full"
              >
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-36 object-cover"
                  />
                ) : (
                  <div className="w-full h-36 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                    <span className="text-4xl">🌿</span>
                  </div>
                )}

                <div className="p-3 flex flex-col flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 leading-tight mb-1.5 line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-auto pt-2">
                    <div className="text-xl font-bold text-gray-900 mb-2">
                      {product.price.toLocaleString('en-US')} ฿
                    </div>

                    <motion.button
                      id={`add-${product.id}`}
                      onClick={() => handleAddToCart(product)}
                      whileTap={tapScale}
                      className="w-full bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold"
                    >
                      + Add
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
};
