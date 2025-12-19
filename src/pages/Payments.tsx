import { useState, useEffect, useMemo } from 'react';
import { paymentApi, Payment } from '@/services/paymentService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Search, MoreVertical, Eye, CheckCircle, XCircle, DollarSign, CreditCard, Clock, TrendingUp } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-warning/20 text-warning' },
  completed: { label: 'Completed', className: 'bg-success/20 text-success' },
  failed: { label: 'Failed', className: 'bg-destructive/20 text-destructive' },
  refunded: { label: 'Refunded', className: 'bg-muted text-muted-foreground' },
};

const methodConfig = {
  credit_card: { label: 'Credit Card', icon: '💳' },
  debit_card: { label: 'Debit Card', icon: '💳' },
  paypal: { label: 'PayPal', icon: '🅿️' },
  bank_transfer: { label: 'Bank Transfer', icon: '🏦' },
  cash_on_delivery: { label: 'Cash on Delivery', icon: '💵' },
};

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Payment['status']>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | Payment['method']>('all');
  const [viewPayment, setViewPayment] = useState<Payment | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await paymentApi.getAll();
      setPayments(data);
    } catch (error) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch = payment.transactionId.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, search, statusFilter, methodFilter]);

  const totalPayments = payments.length;
  const completedPayments = payments.filter(p => p.status === 'completed').length;
  const totalAmount = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  const handleUpdateStatus = async (paymentId: string, status: Payment['status']) => {
    try {
      await paymentApi.updateStatus(paymentId, status);
      toast.success('Payment status updated');
      fetchPayments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleViewPayment = async (payment: Payment) => {
    try {
      const fullPayment = await paymentApi.getById(payment._id);
      setViewPayment(fullPayment);
      setViewOpen(true);
    } catch (error) {
      toast.error('Failed to load payment details');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground">Track and manage payment transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-chart-1/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalPayments}</p>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completedPayments}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">BDT {totalAmount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Received</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">BDT {pendingAmount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Pending Amount</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground"
            >
              <option value="all">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Transactions ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading payments...
                    </TableCell>
                  </TableRow>
                ) : filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>
                        <span className="font-mono text-sm">{payment.transactionId}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">
                          {typeof payment.orderId === 'object' ? payment.orderId.orderNumber : 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {typeof payment.customerId === 'object' ? payment.customerId.name : 'N/A'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">BDT {payment.amount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <span>{methodConfig[payment.method].icon}</span>
                          <span className="text-sm">{methodConfig[payment.method].label}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig[payment.status].className} border-0`}>
                          {statusConfig[payment.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewPayment(payment)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {payment.status === 'pending' && (
                              <>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(payment._id, 'completed')}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(payment._id, 'failed')}>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Mark Failed
                                </DropdownMenuItem>
                              </>
                            )}
                            {payment.status === 'completed' && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(payment._id, 'refunded')}>
                                <XCircle className="w-4 h-4 mr-2" />
                                Issue Refund
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Payment Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {viewPayment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-mono font-medium">{viewPayment.transactionId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-mono font-medium">
                    {typeof viewPayment.orderId === 'object' ? viewPayment.orderId.orderNumber : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">
                    {typeof viewPayment.customerId === 'object' ? viewPayment.customerId.name : 'N/A'}
                  </p>
                  {typeof viewPayment.customerId === 'object' && (
                    <p className="text-sm">{viewPayment.customerId.email}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold">BDT {viewPayment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">
                    {methodConfig[viewPayment.method].icon} {methodConfig[viewPayment.method].label}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={`${statusConfig[viewPayment.status].className} border-0`}>
                    {statusConfig[viewPayment.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(viewPayment.createdAt).toLocaleString()}</p>
                </div>
                {viewPayment.paidAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Paid At</p>
                    <p className="font-medium">{new Date(viewPayment.paidAt).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {viewPayment.paymentDetails && Object.keys(viewPayment.paymentDetails).length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Payment Details</h3>
                  <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                    {Object.entries(viewPayment.paymentDetails).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="text-sm font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewPayment.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm bg-secondary/50 p-3 rounded-lg">{viewPayment.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
