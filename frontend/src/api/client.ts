import { Category, Product, OrderCreate, Order } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

let initDataGlobal = '';

export const setInitData = (initData: string) => {
  initDataGlobal = initData;
};

const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(initDataGlobal && { Authorization: `tma ${initDataGlobal}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
};

export const api = {
  // Categories
  getCategories: (includeChildren = false): Promise<Category[]> => {
    const params = new URLSearchParams();
    if (includeChildren) {
      params.append('include_children', 'true');
    }
    return apiClient<Category[]>(`/categories?${params.toString()}`);
  },

  getCategory: (id: number): Promise<Category> => {
    return apiClient<Category>(`/categories/${id}`);
  },

  getCategoryChildren: (parentId: number): Promise<Category[]> => {
    return apiClient<Category[]>(`/categories?parent_id=${parentId}`);
  },

  // Products
  getProducts: (categoryId?: number): Promise<Product[]> => {
    const params = categoryId ? `?category_id=${categoryId}` : '';
    return apiClient<Product[]>(`/products${params}`);
  },

  getProduct: (id: number): Promise<Product> => {
    return apiClient<Product>(`/products/${id}`);
  },

  // Orders
  createOrder: (data: OrderCreate): Promise<Order> => {
    return apiClient<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
