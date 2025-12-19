import api from '@/lib/axios';

export interface OrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerId: string | {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const orderApi = {
  getAll: async (params?: {
    status?: string;
    paymentStatus?: string;
    search?: string;
  }): Promise<Order[]> => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  create: async (data: Partial<Order>): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Order>): Promise<Order> => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};
