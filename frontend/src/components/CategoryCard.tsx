import { motion } from 'framer-motion';

interface CategoryCardProps {
  name: string;
  icon: string;
  isInfoOnly?: boolean;
  comingSoon?: boolean;
  onClick: () => void;
}

const tapScale: any = {
  scale: 0.97,
  transition: { type: 'tween', duration: 0.12, ease: 'easeOut' },
};

export const CategoryCard = ({
  name,
  icon,
  isInfoOnly,
  comingSoon,
  onClick,
}: CategoryCardProps) => {
  // Visual accent for Flower category
  const isFlower = name === 'Flower';

  return (
    <motion.button
      onClick={onClick}
      disabled={comingSoon}
      whileTap={comingSoon ? {} : tapScale}
      className={`
        relative w-full aspect-square flex flex-col items-center justify-center
        bg-white dark:bg-dark-card rounded-2xl p-4 text-center
        transition-colors
        ${isFlower
          ? 'shadow-md shadow-green-100/50 ring-1 ring-green-100 dark:shadow-accent/20 dark:ring-accent/30'
          : 'shadow-sm shadow-gray-200/50 dark:shadow-dark-border/20'
        }
        ${comingSoon ? 'opacity-50' : ''}
      `}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-tight transition-colors">
        {name}
      </h3>

      {isInfoOnly && (
        <div className="mt-2 inline-block">
          <span className="text-xs text-green-700 dark:text-accent bg-green-50 dark:bg-accent-soft px-2.5 py-1 rounded-full font-medium transition-colors">
            Info
          </span>
        </div>
      )}

      {comingSoon && (
        <div className="absolute top-3 right-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-surface px-2.5 py-1 rounded-full font-medium transition-colors">
            Soon
          </span>
        </div>
      )}
    </motion.button>
  );
};
