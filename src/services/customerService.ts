import api from '@/lib/axios';

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

export const customerApi = {
  getAll: async (params?: {
    status?: string;
    search?: string;
  }): Promise<Customer[]> => {
    const response = await api.get('/customers', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  create: async (data: Partial<Customer>): Promise<Customer> => {
    const response = await api.post('/customers', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};
