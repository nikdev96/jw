import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export const Header = ({ title, showBack = false }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border px-4 py-4 flex items-center shadow-sm dark:shadow-dark-border/10 transition-colors">
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-accent text-2xl leading-none active:scale-90 transition-all"
        >
          ←
        </button>
      )}
      <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 transition-colors">{title}</h1>
    </header>
  );
};
