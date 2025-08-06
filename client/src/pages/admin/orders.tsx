import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  FileText,
  Calendar,
  DollarSign
} from "lucide-react";
import { apiRequest } from "../../lib/queryClient";

interface TranslationOrder {
  id: number;
  orderNumber: string;
  customerEmail: string;
  customerPhone?: string;
  originalFileName: string;
  fileType: string;
  pageCount: number;
  deliveryType: string;
  totalPrice: string;
  status: string;
  originalFilePath?: string;
  translatedFilePath?: string;
  originalFileContent?: string;
  translatedFileContent?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export function AdminOrders() {
  // ...existing state
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);

  // ...existing functions
  const handleDeleteOrder = (order: TranslationOrder) => {
    if (window.confirm(`Are you sure you want to delete order #${order.orderNumber}? This action cannot be undone.`)) {
      setDeletingOrderId(order.id);
      apiRequest("DELETE", `/api/admin/translation-orders/${order.orderNumber}`)
        .then(() => {
          setOrders(prev => prev.filter(o => o.id !== order.id));
          setFilteredOrders(prev => prev.filter(o => o.id !== order.id));
        })
        .catch((err) => {
          alert("Failed to delete order. Please try again.");
          console.error(err);
        })
        .finally(() => setDeletingOrderId(null));
    }
  };

  const [orders, setOrders] = useState<TranslationOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<TranslationOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<TranslationOrder | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<TranslationOrder | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders.filter(order =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.originalFileName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/translation-orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderNumber: string, status: string, adminNotes?: string) => {
    try {
      const response = await apiRequest("PATCH", `/api/admin/translation-orders/${orderNumber}/status`, {
        status,
        adminNotes
      });
      const updatedOrder = await response.json();
      
      setOrders(orders.map(order => 
        order.orderNumber === orderNumber ? updatedOrder : order
      ));
      
      setEditingOrder(null);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const displayFileContent = (fileContent: string | undefined, fileName: string, fileType: string) => {
    if (!fileContent) {
      return <p className="text-gray-500">No file content available</p>;
    }

    try {
      // Convert base64 to blob URL for display
      const binaryString = atob(fileContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: fileType });
      const url = URL.createObjectURL(blob);

      // Handle different file types
      if (fileType.includes('image/')) {
        return (
          <div className="space-y-2">
            <img
              src={url}
              alt={fileName}
              className="max-w-full max-h-96 object-contain border rounded-lg"
              onLoad={() => URL.revokeObjectURL(url)}
            />
            <div className="flex space-x-2">
              <a
                href={url}
                download={fileName}
                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </a>
            </div>
          </div>
        );
      } else if (fileType === 'application/pdf') {
        return (
          <div className="space-y-2">
            <iframe
              src={url}
              className="w-full h-96 border rounded-lg"
              title={fileName}
            />
            <div className="flex space-x-2">
              <a
                href={url}
                download={fileName}
                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-1" />
                Download PDF
              </a>
            </div>
          </div>
        );
      } else {
        // For other file types, just provide download link
        return (
          <div className="space-y-2">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">File preview not available for this type</p>
              <p className="text-xs text-gray-500">{fileType}</p>
            </div>
            <div className="flex space-x-2">
              <a
                href={url}
                download={fileName}
                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-1" />
                Download File
              </a>
            </div>
          </div>
        );
      }
    } catch (error) {
      console.error('Error displaying file content:', error);
      return <p className="text-red-500">Error displaying file content</p>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportOrders = () => {
    const csvContent = [
      ["Order Number", "Customer Email", "File Name", "File Type", "Pages", "Delivery", "Price", "Status", "Date"],
      ...filteredOrders.map(order => [
        order.orderNumber,
        order.customerEmail,
        order.originalFileName,
        order.fileType,
        order.pageCount.toString(),
        order.deliveryType,
        order.totalPrice,
        order.status,
        new Date(order.createdAt).toLocaleDateString()
      ])
    ].map(row => row.map(field => `"${field}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
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
        <h1 className="text-3xl font-bold text-gray-900">Translation Orders</h1>
        <Button onClick={exportOrders} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Order #</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">File</th>
                  <th className="text-left p-3">Details</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{order.orderNumber}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div>{order.customerEmail}</div>
                        {order.customerPhone && (
                          <div className="text-gray-500">{order.customerPhone}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm">
                          <div className="text-gray-500">{order.fileType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div>{order.pageCount} pages</div>
                        <Badge variant="outline" className="mt-1">
                          {order.deliveryType}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{order.totalPrice}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingOrder(order)}
                          title="Edit Status"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Delete Order"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteOrder(order)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Order Details</h3>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Order Number</label>
                  <p className="text-gray-900 font-medium">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Customer Email</label>
                  <p className="text-gray-900">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{selectedOrder.customerPhone || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">File Name</label>
                  <p className="text-gray-900">{selectedOrder.originalFileName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">File Type</label>
                  <p className="text-gray-900">{selectedOrder.fileType}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Pages</label>
                  <p className="text-gray-900">{selectedOrder.pageCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Delivery</label>
                  <p className="text-gray-900">{selectedOrder.deliveryType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Price</label>
                  <p className="text-gray-900 font-medium">${selectedOrder.totalPrice}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Updated</label>
                  <p className="text-gray-900">{new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              
              {selectedOrder.adminNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Admin Notes</label>
                  <div className="bg-gray-50 p-3 rounded-lg mt-1">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedOrder.adminNotes}</p>
                  </div>
                </div>
              )}
              
              {/* Original File Content */}
              <div>
                <label className="text-sm font-medium text-gray-600">Original File</label>
                <div className="mt-2 border rounded-lg p-4">
                  {displayFileContent(
                    selectedOrder.originalFileContent,
                    selectedOrder.originalFileName,
                    selectedOrder.fileType
                  )}
                </div>
              </div>
              
              {/* Translated File Content (if available) */}
              {selectedOrder.translatedFileContent && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Translated File</label>
                  <div className="mt-2 border rounded-lg p-4">
                    {displayFileContent(
                      selectedOrder.translatedFileContent,
                      `translated_${selectedOrder.originalFileName}`,
                      selectedOrder.fileType
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Update Order Status</h3>
              <Button variant="outline" onClick={() => setEditingOrder(null)}>
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Order Number</label>
                <p className="text-gray-900 font-medium">{editingOrder.orderNumber}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <Select 
                  value={editingOrder.status} 
                  onValueChange={(value) => setEditingOrder({...editingOrder, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Admin Notes</label>
                <Textarea
                  value={editingOrder.adminNotes || ''}
                  onChange={(e) => setEditingOrder({...editingOrder, adminNotes: e.target.value})}
                  placeholder="Add notes about this order..."
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => updateOrderStatus(editingOrder.orderNumber, editingOrder.status, editingOrder.adminNotes)}
                  className="flex-1"
                >
                  Update Order
                </Button>
                <Button variant="outline" onClick={() => setEditingOrder(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}