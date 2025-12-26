interface PageContainerProps {
  children: React.ReactNode;
  withPadding?: boolean;
}

export const PageContainer = ({ children, withPadding = true }: PageContainerProps) => {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-green-50/40 via-white to-white ${withPadding ? 'pb-24' : ''}`}>
      {children}
    </div>
  );
};
