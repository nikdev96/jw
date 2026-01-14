import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProductPreviewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  allProducts?: Product[]; // For related products
  onProductSelect?: (product: Product) => void; // Switch to another product
}

export const ProductPreviewModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  allProducts = [],
  onProductSelect,
}: ProductPreviewModalProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  // ESC key handler and scroll lock
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    // Don't close - user can add more items
  };

  // Get related products (same category, exclude current)
  const relatedProducts = allProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 6); // Max 6 related products

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="fixed bottom-0 left-0 right-0 z-[70] max-w-[420px] mx-auto
                       bg-white dark:bg-dark-card
                       rounded-t-3xl overflow-hidden shadow-2xl
                       max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-100 dark:border-dark-border relative">
              {/* Drag Handle */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />

              <div className="flex items-start justify-between gap-4 mt-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2">
                    {product.name}
                  </h2>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {product.price.toLocaleString('en-US')} ฿
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-dark-surface
                             rounded-full flex items-center justify-center
                             text-gray-600 dark:text-gray-400
                             active:scale-90 transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Image Gallery */}
              <ImageGallery
                images={product.images}
                currentIndex={currentImageIndex}
                onChange={setCurrentImageIndex}
              />

              {/* Product Info Section */}
              <div className="px-6 py-4">
                {/* Type & THC Badges */}
                <div className="flex gap-2 mb-4">
                  {product.type && (
                    <span
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${getTypeBadgeClass(
                        product.type
                      )}`}
                    >
                      {product.type}
                    </span>
                  )}
                  {product.thc !== null && product.thc !== undefined && (
                    <span
                      className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30
                                 text-purple-700 dark:text-purple-300
                                 rounded-lg text-sm font-semibold"
                    >
                      {product.thc}% THC
                    </span>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Related Products Section */}
              {relatedProducts.length > 0 && (
                <div className="border-t border-gray-100 dark:border-dark-border pt-4 pb-6">
                  <div className="px-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                      Complete the set
                    </h3>
                  </div>

                  <RelatedProductsCarousel
                    products={relatedProducts}
                    onAddToCart={onAddToCart}
                    onProductClick={(relatedProduct) => {
                      if (onProductSelect) {
                        onProductSelect(relatedProduct);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Fixed Bottom CTA */}
            <div className="flex-shrink-0 p-6 bg-white dark:bg-dark-surface border-t border-gray-100 dark:border-dark-border space-y-3">
              {/* Primary CTA */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-accent text-dark-bg
                           py-4 rounded-xl text-lg font-bold
                           active:scale-[0.98] transition-all
                           shadow-lg shadow-accent/30"
              >
                Add to Cart
              </button>

              {/* Secondary CTA */}
              <button
                onClick={() => {
                  onClose();
                  navigate('/cart');
                }}
                className="w-full bg-gray-100 dark:bg-dark-surface
                           text-gray-900 dark:text-gray-100
                           py-3 rounded-xl text-base font-semibold
                           active:scale-[0.98] transition-all"
              >
                Go to Cart
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Sub-component: Related Products Carousel
interface RelatedProductsCarouselProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const RelatedProductsCarousel = ({
  products,
  onAddToCart,
  onProductClick,
}: RelatedProductsCarouselProps) => {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 px-6 pb-2">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 w-40"
          >
            <div
              onClick={() => onProductClick(product)}
              className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden
                         shadow-sm border border-gray-100 dark:border-dark-border
                         cursor-pointer active:scale-[0.98] transition-all"
            >
              {/* Image */}
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-28 object-cover"
                />
              ) : (
                <div className="w-full h-28 bg-gradient-to-br from-green-50 to-green-100 dark:from-dark-card dark:to-dark-surface flex items-center justify-center">
                  <span className="text-3xl">🌿</span>
                </div>
              )}

              {/* Info */}
              <div className="p-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[40px] leading-tight mb-1">
                  {product.name}
                </h4>

                <div className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {product.price.toLocaleString('en-US')} ฿
                </div>

                {/* Add Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="w-full bg-accent text-dark-bg
                             py-2 rounded-lg text-xs font-bold
                             active:scale-95 transition-all
                             shadow-md shadow-accent/20"
                >
                  + Add
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Sub-component: Image Gallery with Swipe
interface ImageGalleryProps {
  images: string[];
  currentIndex: number;
  onChange: (index: number) => void;
}

const ImageGallery = ({ images, currentIndex, onChange }: ImageGalleryProps) => {
  const [dragDirection, setDragDirection] = useState(0);

  const paginate = (newDirection: number) => {
    const newIndex = currentIndex + newDirection;
    if (newIndex >= 0 && newIndex < images.length) {
      onChange(newIndex);
      setDragDirection(newDirection);
    }
  };

  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const swipeConfidenceThreshold = 10000;

  const handleDragEnd = (_e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  if (images.length === 0) {
    return (
      <div className="relative h-64 bg-gradient-to-br from-green-50 to-green-100 dark:from-dark-surface dark:to-dark-card flex items-center justify-center">
        <span className="text-7xl">🌿</span>
      </div>
    );
  }

  return (
    <div className="relative h-64 bg-gray-100 dark:bg-dark-surface overflow-hidden">
      {/* Current Image with Swipe */}
      <AnimatePresence initial={false} custom={dragDirection}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Product image ${currentIndex + 1}`}
          custom={dragDirection}
          initial={{ opacity: 0, x: dragDirection > 0 ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dragDirection > 0 ? -100 : 100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
        />
      </AnimatePresence>

      {/* Navigation Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDragDirection(index > currentIndex ? 1 : -1);
                onChange(index);
              }}
              className={`rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-5 h-1.5'
                  : 'bg-white/50 w-1.5 h-1.5 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Helper: Get badge color based on type
const getTypeBadgeClass = (type: string): string => {
  const colors: Record<string, string> = {
    Indica:
      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    Sativa:
      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    Hybrid: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    CBD: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  };
  return (
    colors[type] ||
    'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
  );
};
