import { CartItem, Product } from '../types';

const CART_KEY = 'justweed_cart';

export const getCart = (): CartItem[] => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (product: Product, quantity = 1): CartItem[] => {
  const cart = getCart();
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }

  saveCart(cart);
  return cart;
};

export const removeFromCart = (productId: number): CartItem[] => {
  const cart = getCart().filter((item) => item.product.id !== productId);
  saveCart(cart);
  return cart;
};

export const updateCartItemQuantity = (
  productId: number,
  quantity: number
): CartItem[] => {
  const cart = getCart();
  const item = cart.find((item) => item.product.id === productId);

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = quantity;
    saveCart(cart);
  }

  return cart;
};

export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};

export const getCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

export const getCartCount = (cart: CartItem[]): number => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};
