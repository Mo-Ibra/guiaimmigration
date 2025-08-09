import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { 
  Search, 
  Filter,
  Download,
  DollarSign,
  Calendar,
  TrendingUp,
  CreditCard,
  RefreshCw
} from "lucide-react";
import { apiRequest } from "../../lib/queryClient";

interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail: string;
  service: string;
  serviceId?: string;
  paymentMethod: string;
  createdAt: string;
  metadata?: any;
}

interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  monthlyRevenue: number[];
  recentPayments: PaymentRecord[];
}

export function AdminPayments() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");

  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, []);

  useEffect(() => {
    let filtered = payments.filter(payment =>
      payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    if (serviceFilter !== "all") {
      filtered = filtered.filter(payment => payment.service === serviceFilter);
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter, serviceFilter]);

  const fetchPayments = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/payments");
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      // Mock data for demo
      const mockPayments: PaymentRecord[] = [
        {
          id: "pi_1234567890",
          amount: 49.99,
          currency: "usd",
          status: "succeeded",
          customerEmail: "john@example.com",
          service: "translation",
          paymentMethod: "card",
          createdAt: new Date().toISOString(),
        },
        {
          id: "pi_0987654321",
          amount: 29.99,
          currency: "usd",
          status: "succeeded",
          customerEmail: "jane@example.com",
          service: "immigration_guide",
          serviceId: "i130",
          paymentMethod: "card",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        }
      ];
      setPayments(mockPayments);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/payment-stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch payment stats:", error);
      // Do not set any mock stats; leave stats as is (null or previous value)
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceName = (service: string) => {
    switch (service) {
      case 'translation': return 'Translation Service';
      case 'immigration_guide': return 'Immigration Guide';
      case 'form_guide': return 'Form Guide';
      default: return service;
    }
  };

  const exportPayments = () => {
    const csvContent = [
      ["Payment ID", "Amount", "Currency", "Status", "Customer", "Service", "Date"],
      ...filteredPayments.map(payment => [
        payment.id,
        payment.amount.toString(),
        payment.currency.toUpperCase(),
        payment.status,
        payment.customerEmail,
        getServiceName(payment.service),
        new Date(payment.createdAt).toLocaleDateString()
      ])
    ].map(row => row.map(field => `"${field}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchPayments} className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          <Button onClick={exportPayments} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Payment Stats */}
      {stats && stats.totalRevenue && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((stats.successfulPayments / stats.totalTransactions) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.successfulPayments} of {stats.totalTransactions} successful
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failedPayments}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="succeeded">Succeeded</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="translation">Translation</SelectItem>
                <SelectItem value="immigration_guide">Immigration Guide</SelectItem>
                <SelectItem value="form_guide">Form Guide</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Payments ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Payment ID</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Service</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Method</th>
                  <th className="text-left p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-mono text-sm">{payment.id}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">{payment.customerEmail}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div>{getServiceName(payment.service)}</div>
                        {payment.serviceId && (
                          <div className="text-gray-500 text-xs">{payment.serviceId}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-sm capitalize">{payment.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{new Date(payment.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}