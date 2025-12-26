import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export const Header = ({ title, showBack = false }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 flex items-center shadow-sm">
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-tg-button text-2xl leading-none active:scale-90 transition-transform"
        >
          ←
        </button>
      )}
      <h1 className="text-lg font-bold text-gray-900">{title}</h1>
    </header>
  );
};
