import api from '@/lib/axios';

export interface Payment {
  _id: string;
  orderId: string | {
    _id: string;
    orderNumber: string;
  } | null;
  customerId?: string | {
    _id: string;
    name: string;
    email: string;
  };
  transactionId: string;
  amount: number;
  method: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  gateway: string;
  gatewayResponse: any;
  paymentDetails?: Record<string, any>;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const paymentApi = {
  getAll: async (params?: {
    status?: string;
    method?: string;
  }): Promise<Payment[]> => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Payment> => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  create: async (data: Partial<Payment>): Promise<Payment> => {
    const response = await api.post('/payments', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Payment>): Promise<Payment> => {
    const response = await api.put(`/payments/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: Payment['status']): Promise<Payment> => {
    const response = await api.patch(`/payments/${id}/status`, { status });
    return response.data;
  },
};
