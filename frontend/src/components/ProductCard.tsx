import { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export const ProductCard = ({ product, onAdd }: ProductCardProps) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm shadow-gray-200/50 flex flex-col h-full">
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
            {product.price.toLocaleString('ru-RU')} ₽
          </div>

          <button
            onClick={handleAdd}
            className={`
              w-full py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-150
              ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-green-600 text-white active:scale-[0.98]'
              }
            `}
          >
            {isAdded ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
};
