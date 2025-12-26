import { useEffect, useState } from 'react';

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const useTelegram = () => {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramWebApp['initDataUnsafe']['user']>(undefined);
  const [initData, setInitData] = useState<string>('');

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;

    if (telegram) {
      telegram.ready();
      telegram.expand();

      setTg(telegram);
      setUser(telegram.initDataUnsafe.user);
      setInitData(telegram.initData);

      // Apply Telegram theme colors
      if (telegram.themeParams.bg_color) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', telegram.themeParams.bg_color);
      }
      if (telegram.themeParams.text_color) {
        document.documentElement.style.setProperty('--tg-theme-text-color', telegram.themeParams.text_color);
      }
      if (telegram.themeParams.button_color) {
        document.documentElement.style.setProperty('--tg-theme-button-color', telegram.themeParams.button_color);
      }
      if (telegram.themeParams.button_text_color) {
        document.documentElement.style.setProperty('--tg-theme-button-text-color', telegram.themeParams.button_text_color);
      }
      if (telegram.themeParams.secondary_bg_color) {
        document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', telegram.themeParams.secondary_bg_color);
      }
      if (telegram.themeParams.hint_color) {
        document.documentElement.style.setProperty('--tg-theme-hint-color', telegram.themeParams.hint_color);
      }
    }
  }, []);

  return {
    tg,
    user,
    initData,
  };
};
