import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
          <div className="text-center p-4">
            <div className="text-4xl mb-4">😵</div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Что-то пошло не так
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Произошла ошибка. Пожалуйста, обновите страницу.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-accent text-dark-bg px-6 py-2 rounded-lg font-medium"
            >
              Обновить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}