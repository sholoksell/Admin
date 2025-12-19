import { useState, useEffect, useMemo } from 'react';
import { customerApi, Customer } from '@/services/customerService';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Search, MoreVertical, Edit, Trash2, Mail, Phone, MapPin, Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

const statusConfig = {
  active: { label: 'Active', className: 'bg-success/20 text-success' },
  inactive: { label: 'Inactive', className: 'bg-muted text-muted-foreground' },
  blocked: { label: 'Blocked', className: 'bg-destructive/20 text-destructive' },
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Customer['status']>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Bangladesh',
    },
    status: 'active' as Customer['status'],
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerApi.getAll();
      setCustomers(data);
    } catch (error) {
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editCustomer) {
        await customerApi.update(editCustomer._id, formData);
        toast.success('Customer updated successfully');
      } else {
        await customerApi.create(formData);
        toast.success('Customer created successfully');
      }
      setFormOpen(false);
      resetForm();
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save customer');
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      status: customer.status,
    });
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;
    try {
      await customerApi.delete(customerToDelete._id);
      toast.success('Customer deleted successfully');
      setDeleteOpen(false);
      setCustomerToDelete(null);
      fetchCustomers();
    } catch (error) {
      toast.error('Failed to delete customer');
    }
  };

  const resetForm = () => {
    setEditCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Bangladesh',
      },
      status: 'active',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setFormOpen(true);
          }}
          className="gradient-primary text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-chart-1/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalCustomers}</p>
              <p className="text-sm text-muted-foreground">Total Customers</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeCustomers}</p>
              <p className="text-sm text-muted-foreground">Active Customers</p>
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
            <div className="w-12 h-12 rounded-xl bg-chart-3/10 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
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
                placeholder="Search customers..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading customers...
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{customer.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {customer.phone || 'N/A'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {customer.address?.city || 'N/A'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{customer.totalOrders}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">BDT {customer.totalSpent.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig[customer.status].className} border-0`}>
                          {statusConfig[customer.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(customer)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setCustomerToDelete(customer);
                                setDeleteOpen(true);
                              }}
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

      {/* Customer Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Customer['status'] })}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Street"
                  value={formData.address.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                />
                <Input
                  placeholder="City"
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })}
                />
                <Input
                  placeholder="State"
                  value={formData.address.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value }
                  })}
                />
                <Input
                  placeholder="Zip Code"
                  value={formData.address.zipCode}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, zipCode: e.target.value }
                  })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-primary">
                {editCustomer ? 'Update' : 'Create'} Customer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete {customerToDelete?.name}? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
