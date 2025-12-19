import { useState, useEffect, useMemo } from 'react';
import { orderApi, Order } from '@/services/orderService';
import { customerApi } from '@/services/customerService';
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
import { Search, MoreVertical, Eye, Edit, Trash2, Package, DollarSign, Clock, CheckCircle, ShoppingCart, TrendingUp } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-warning/20 text-warning' },
  processing: { label: 'Processing', className: 'bg-chart-1/20 text-chart-1' },
  shipped: { label: 'Shipped', className: 'bg-chart-3/20 text-chart-3' },
  delivered: { label: 'Delivered', className: 'bg-success/20 text-success' },
  cancelled: { label: 'Cancelled', className: 'bg-muted text-muted-foreground' },
  refunded: { label: 'Refunded', className: 'bg-destructive/20 text-destructive' },
};

const paymentStatusConfig = {
  pending: { label: 'Pending', className: 'bg-warning/20 text-warning' },
  paid: { label: 'Paid', className: 'bg-success/20 text-success' },
  failed: { label: 'Failed', className: 'bg-destructive/20 text-destructive' },
  refunded: { label: 'Refunded', className: 'bg-muted text-muted-foreground' },
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getAll();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid').length;

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    try {
      await orderApi.updateStatus(orderId, status);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await orderApi.delete(orderId);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const handleViewOrder = async (order: Order) => {
    try {
      const fullOrder = await orderApi.getById(order._id);
      setViewOrder(fullOrder);
      setViewOpen(true);
    } catch (error) {
      toast.error('Failed to load order details');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">Manage and track customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-chart-1/10 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingOrders}</p>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">BDT {totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{paidOrders}</p>
              <p className="text-sm text-muted-foreground">Paid Orders</p>
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
                placeholder="Search by order number..."
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
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <span className="font-mono font-medium">{order.orderNumber}</span>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{typeof order.customerId === 'object' ? order.customerId.name : 'N/A'}</p>
                      </TableCell>
                      <TableCell>
                        <span>{order.items.length} items</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">BDT {order.total.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig[order.status].className} border-0`}>
                          {statusConfig[order.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${paymentStatusConfig[order.paymentStatus].className} border-0`}>
                          {paymentStatusConfig[order.paymentStatus].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
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
                            <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'processing')}>
                              <Edit className="w-4 h-4 mr-2" />
                              Mark Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, 'delivered')}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(order._id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
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

      {/* View Order Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {viewOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{typeof viewOrder.customerId === 'object' ? viewOrder.customerId.name : 'N/A'}</p>
                  <p className="text-sm">{typeof viewOrder.customerId === 'object' ? viewOrder.customerId.email : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{new Date(viewOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={`${statusConfig[viewOrder.status].className} border-0`}>
                    {statusConfig[viewOrder.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <Badge className={`${paymentStatusConfig[viewOrder.paymentStatus].className} border-0`}>
                    {paymentStatusConfig[viewOrder.paymentStatus].label}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                <div className="bg-secondary/50 p-4 rounded-lg space-y-1">
                  <p>{viewOrder.shippingAddress.name}</p>
                  <p>{viewOrder.shippingAddress.phone}</p>
                  <p>{viewOrder.shippingAddress.street}</p>
                  <p>{viewOrder.shippingAddress.city}, {viewOrder.shippingAddress.state} {viewOrder.shippingAddress.zipCode}</p>
                  <p>{viewOrder.shippingAddress.country}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-2">
                  {viewOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-secondary/50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        {item.variantName && <p className="text-sm text-muted-foreground">{item.variantName}</p>}
                        <p className="text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">BDT {item.total.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>BDT {viewOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>BDT {viewOrder.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>BDT {viewOrder.shipping.toLocaleString()}</span>
                  </div>
                  {viewOrder.discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount</span>
                      <span>-BDT {viewOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>BDT {viewOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {viewOrder.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm bg-secondary/50 p-3 rounded-lg">{viewOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
