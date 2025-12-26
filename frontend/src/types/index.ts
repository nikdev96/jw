export interface Category {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
  parent_id: number | null;
  is_active: boolean;
  is_info_only: boolean;
  coming_soon: boolean;
  children?: Category[];
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  category_id: number;
  is_active: boolean;
  sort_order: number;
  category?: Category;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
}

export interface OrderCreate {
  items: OrderItem[];
  delivery_address: string;
  phone: string;
  comment?: string;
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  delivery_address: string | null;
  phone: string | null;
  comment: string | null;
  created_at: string;
  updated_at: string;
  items: any[];
}
