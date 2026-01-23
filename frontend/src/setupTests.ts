import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock Telegram WebApp
const mockFn = () => jest.fn();

(global as any).Telegram = {
  WebApp: {
    initData: 'test_init_data',
    initDataUnsafe: {
      user: {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser'
      }
    },
    ready: mockFn(),
    expand: mockFn(),
    close: mockFn(),
    colorScheme: 'light',
    onEvent: mockFn(),
    offEvent: mockFn(),
    MainButton: {
      text: '',
      color: '',
      textColor: '',
      isVisible: false,
      isActive: false,
      isProgressVisible: false,
      setText: mockFn(),
      onClick: mockFn(),
      offClick: mockFn(),
      show: mockFn(),
      hook: mockFn(),
      enable: mockFn(),
      disable: mockFn(),
      showProgress: mockFn(),
      hideProgress: mockFn()
    },
    BackButton: {
      isVisible: false,
      onClick: mockFn(),
      offClick: mockFn(),
      show: mockFn(),
      hide: mockFn()
    },
    themeParams: {
      bg_color: '#ffffff',
      text_color: '#000000',
      button_color: '#0000ff',
      button_text_color: '#ffffff'
    }
  }
};