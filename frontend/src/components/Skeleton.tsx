export const Skeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-dark-card rounded ${className}`} />
  );
};

export const ProductSkeleton = () => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm shadow-gray-200/50 dark:shadow-dark-border/20 transition-colors">
      <Skeleton className="w-full h-36" />
      <div className="p-3">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <Skeleton className="h-6 w-20 mb-2" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-sm shadow-gray-200/50 dark:shadow-dark-border/20 transition-colors">
      <Skeleton className="h-10 w-10 mb-3 mx-auto rounded-full" />
      <Skeleton className="h-5 w-24 mx-auto rounded-full" />
    </div>
  );
};
