import { useState, useEffect } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { EnhancedFileUpload } from "../components/EnhancedFileUpload";
import { MultiFileUpload } from "../components/MultiFileUpload";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  Eye,
  Edit,
  DollarSign,
  Calendar,
  Plus,
  BookOpen,
  Trash2,
  Save
} from "lucide-react";

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
  adminNotes?: string;
  paymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Guide {
  id: number;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  formType: string;
  price: string;
  skillLevel: string;
  featured: boolean;
  onlineFiling: boolean;
  fileName?: string;
  fileContent?: string;
  fileType?: string;
  createdAt: string;
}

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"orders" | "guides">("orders");
  
  // Translation Orders State
  const [selectedOrder, setSelectedOrder] = useState<TranslationOrder | null>(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  // Guides State
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isCreatingGuide, setIsCreatingGuide] = useState(false);
  const [guideForm, setGuideForm] = useState({
    title: "",
    titleEs: "",
    description: "",
    descriptionEs: "",
    formType: "",
    price: "",
    skillLevel: "beginner",
    featured: false,
    onlineFiling: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch all translation orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery<TranslationOrder[]>({
    queryKey: ["/api/admin/translation-orders"],
  });

  // Fetch all guides
  const { data: guides = [], isLoading: guidesLoading } = useQuery<Guide[]>({
    queryKey: ["/api/admin/guides"],
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderNumber, status, notes }: { orderNumber: string; status: string; notes?: string }) => {
      return apiRequest("PATCH", `/api/admin/translation-orders/${orderNumber}/status`, {
        status,
        adminNotes: notes
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/translation-orders"] });
      toast({
        title: "Status Updated",
        description: "Order status has been updated successfully.",
      });
      setSelectedOrder(null);
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    },
  });

  // Update guide mutation
  const updateGuideMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest("PATCH", `/api/admin/guides/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guides"] });
      toast({
        title: "Guide Updated",
        description: "Guide has been updated successfully.",
      });
      setSelectedGuide(null);
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update guide.",
        variant: "destructive",
      });
    },
  });

  // Delete guide mutation
  const deleteGuideMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/guides/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guides"] });
      toast({
        title: "Guide Deleted",
        description: "Guide has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete guide.",
        variant: "destructive",
      });
    },
  });

  // Upload file mutation
  const uploadFileMutation = useMutation({
    mutationFn: async ({ guideId, file }: { guideId: number; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/admin/guides/${guideId}/upload-file`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include session cookies for authentication
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guides"] });
      toast({
        title: "File Uploaded",
        description: "File has been uploaded successfully.",
      });
      setSelectedFile(null);
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "delivered": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "in_progress": return <AlertCircle className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = () => {
    if (!selectedOrder || !statusUpdate) return;
    
    updateStatusMutation.mutate({
      orderNumber: selectedOrder.orderNumber,
      status: statusUpdate,
      notes: adminNotes
    });
  };

  const openOrderDetails = (order: TranslationOrder) => {
    setSelectedOrder(order);
    setStatusUpdate(order.status);
    setAdminNotes(order.adminNotes || "");
  };

  const resetGuideForm = () => {
    setGuideForm({
      title: "",
      titleEs: "",
      description: "",
      descriptionEs: "",
      formType: "",
      price: "",
      skillLevel: "beginner",
      featured: false,
      onlineFiling: false
    });
    setSelectedFile(null);
  };

  const handleCreateGuide = async () => {
    // Validate file requirement
    if (!selectedFile) {
      toast({
        title: "File Required",
        description: "Please select a file to upload. A guide file is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      // First create the guide
      const response = await apiRequest("POST", "/api/admin/guides", guideForm);
      const guideData = await response.json();

      // Upload the required file
      if (selectedFile && guideData.id) {
        const formData = new FormData();

        // Use enhanced upload for large files (>50MB)
        if (selectedFile.size > 50 * 1024 * 1024) {
          // Use the large file upload endpoint with compression
          formData.append('file', selectedFile);
          formData.append('compressed', 'true');

          await fetch(`/api/admin/guides/${guideData.id}/upload-large-file-direct`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });
        } else {
          // Use regular upload for smaller files
          formData.append('file', selectedFile);

          await fetch(`/api/admin/guides/${guideData.id}/upload-file`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });
        }
      }

      // Refresh the guides list
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guides"] });

      toast({
        title: "Guide Created",
        description: "Guide has been created successfully.",
      });

      setIsCreatingGuide(false);
      resetGuideForm();
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create guide.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateGuide = () => {
    if (!selectedGuide) return;
    updateGuideMutation.mutate({
      id: selectedGuide.id,
      data: guideForm
    });
  };

  const openGuideDetails = (guide: Guide) => {
    setSelectedGuide(guide);
    setGuideForm({
      title: guide.title,
      titleEs: guide.titleEs,
      description: guide.description,
      descriptionEs: guide.descriptionEs,
      formType: guide.formType,
      price: guide.price,
      skillLevel: guide.skillLevel,
      featured: guide.featured,
      onlineFiling: guide.onlineFiling
    });
  };

  const handleFileUpload = (guideId: number) => {
    if (!selectedFile) return;
    uploadFileMutation.mutate({ guideId, file: selectedFile });
  };

  // Calculate revenue stats
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);
  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const completedOrders = orders.filter(order => order.status === "completed" || order.status === "delivered").length;

  if (ordersLoading && guidesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage translation orders and immigration guides</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "orders"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FileText className="h-5 w-5 inline mr-2" />
                  Translation Orders
                </button>
                <button
                  onClick={() => setActiveTab("guides")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "guides"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <BookOpen className="h-5 w-5 inline mr-2" />
                  Immigration Guides
                </button>
              </nav>
            </div>
          </div>

          {/* Translation Orders Tab */}
          {activeTab === "orders" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Completed</p>
                        <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Orders Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Order #</th>
                          <th className="text-left p-4">Customer</th>
                          <th className="text-left p-4">File</th>
                          <th className="text-left p-4">Pages</th>
                          <th className="text-left p-4">Delivery</th>
                          <th className="text-left p-4">Price</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Date</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-mono text-sm">{order.orderNumber}</td>
                            <td className="p-4">
                              <div>
                                <div className="font-medium">{order.customerEmail}</div>
                                {order.customerPhone && (
                                  <div className="text-sm text-gray-500">{order.customerPhone}</div>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                <span className="text-sm">{order.originalFileName}</span>
                              </div>
                            </td>
                            <td className="p-4">{order.pageCount}</td>
                            <td className="p-4 capitalize">{order.deliveryType}</td>
                            <td className="p-4 font-bold">${order.totalPrice}</td>
                            <td className="p-4">
                              <Badge className={getStatusColor(order.status)}>
                                <div className="flex items-center">
                                  {getStatusIcon(order.status)}
                                  <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                                </div>
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openOrderDetails(order)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Guides Tab */}
          {activeTab === "guides" && (
            <>
              {/* Guides Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Immigration Guides</h2>
                  <p className="text-gray-600">Manage your immigration guide library</p>
                </div>
                <Button onClick={() => setIsCreatingGuide(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Guide
                </Button>
              </div>

              {/* Guides Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide) => (
                  <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{guide.title}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">{guide.formType}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openGuideDetails(guide)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteGuideMutation.mutate(guide.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{guide.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-green-600">${guide.price}</span>
                        <Badge variant={guide.skillLevel === 'beginner' ? 'default' : guide.skillLevel === 'intermediate' ? 'secondary' : 'destructive'}>
                          {guide.skillLevel}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {guide.featured && <Badge variant="outline">Featured</Badge>}
                          {guide.onlineFiling && <Badge variant="outline">Online Filing</Badge>}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          {guide.fileName ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              File attached
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              No file
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Multi File Upload Section */}
                      <div className="mt-4 pt-4 border-t">
                        <MultiFileUpload
                          guideId={guide.id}
                          onUploadSuccess={() => {
                            queryClient.invalidateQueries({ queryKey: ["/api/admin/guides"] });
                          }}
                          maxFileSize={100}
                          showCompression={true}
                          guide={guide}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Order Details Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                    Close
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Order Number</Label>
                      <div className="font-mono text-sm mt-1">{selectedOrder.orderNumber}</div>
                    </div>
                    <div>
                      <Label>Total Price</Label>
                      <div className="text-xl font-bold text-green-600 mt-1">${selectedOrder.totalPrice}</div>
                    </div>
                    <div>
                      <Label>Customer Email</Label>
                      <div className="mt-1">{selectedOrder.customerEmail}</div>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <div className="mt-1">{selectedOrder.customerPhone || "Not provided"}</div>
                    </div>
                    <div>
                      <Label>File Details</Label>
                      <div className="mt-1">
                        <div>{selectedOrder.originalFileName}</div>
                        <div className="text-sm text-gray-500">{selectedOrder.pageCount} pages • {selectedOrder.deliveryType}</div>
                      </div>
                    </div>
                    <div>
                      <Label>Created</Label>
                      <div className="mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div>
                    <Label>Update Status</Label>
                    <select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>

                  {/* Admin Notes */}
                  <div>
                    <Label>Admin Notes</Label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add internal notes about this order..."
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleStatusUpdate}
                      disabled={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending ? "Updating..." : "Update Order"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Create Guide Modal */}
          {isCreatingGuide && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Create New Guide</h2>
                  <Button variant="outline" onClick={() => setIsCreatingGuide(false)}>
                    Close
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Title (English)</Label>
                      <Input
                        value={guideForm.title}
                        onChange={(e) => setGuideForm({...guideForm, title: e.target.value})}
                        placeholder="Enter guide title"
                      />
                    </div>
                    <div>
                      <Label>Title (Spanish)</Label>
                      <Input
                        value={guideForm.titleEs}
                        onChange={(e) => setGuideForm({...guideForm, titleEs: e.target.value})}
                        placeholder="Enter Spanish title"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description (English)</Label>
                    <Textarea
                      value={guideForm.description}
                      onChange={(e) => setGuideForm({...guideForm, description: e.target.value})}
                      placeholder="Enter guide description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Description (Spanish)</Label>
                    <Textarea
                      value={guideForm.descriptionEs}
                      onChange={(e) => setGuideForm({...guideForm, descriptionEs: e.target.value})}
                      placeholder="Enter Spanish description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Form Type</Label>
                      <Input
                        value={guideForm.formType}
                        onChange={(e) => setGuideForm({...guideForm, formType: e.target.value})}
                        placeholder="e.g., I-130"
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={guideForm.price}
                        onChange={(e) => setGuideForm({...guideForm, price: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>Skill Level</Label>
                      <select
                        value={guideForm.skillLevel}
                        onChange={(e) => setGuideForm({...guideForm, skillLevel: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={guideForm.featured}
                        onChange={(e) => setGuideForm({...guideForm, featured: e.target.checked})}
                        className="mr-2"
                      />
                      Featured
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={guideForm.onlineFiling}
                        onChange={(e) => setGuideForm({...guideForm, onlineFiling: e.target.checked})}
                        className="mr-2"
                      />
                      Online Filing
                    </label>
                  </div>

                  {/* File Upload Section */}
                  <div>
                    <Label>Upload Guide File (PDF, DOC, DOCX) <span className="text-red-500">*</span></Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                      {selectedFile && (
                        <p className="text-sm text-gray-600 mt-1">
                          Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          {selectedFile.size > 60 * 1024 * 1024 && (
                            <span className="text-blue-600 block text-xs">
                              ⚡ Large file detected - will be compressed automatically
                            </span>
                          )}
                        </p>
                      )}
                      {!selectedFile && (
                        <p className="text-xs text-red-500 mt-1">
                          <span className="font-medium">Required:</span> Please select a guide file to upload. Large files (60MB+) supported with compression.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={() => setIsCreatingGuide(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateGuide}
                    >
                      Create Guide
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Guide Modal */}
          {selectedGuide && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Edit Guide</h2>
                  <Button variant="outline" onClick={() => setSelectedGuide(null)}>
                    Close
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Title (English)</Label>
                      <Input
                        value={guideForm.title}
                        onChange={(e) => setGuideForm({...guideForm, title: e.target.value})}
                        placeholder="Enter guide title"
                      />
                    </div>
                    <div>
                      <Label>Title (Spanish)</Label>
                      <Input
                        value={guideForm.titleEs}
                        onChange={(e) => setGuideForm({...guideForm, titleEs: e.target.value})}
                        placeholder="Enter Spanish title"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description (English)</Label>
                    <Textarea
                      value={guideForm.description}
                      onChange={(e) => setGuideForm({...guideForm, description: e.target.value})}
                      placeholder="Enter guide description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Description (Spanish)</Label>
                    <Textarea
                      value={guideForm.descriptionEs}
                      onChange={(e) => setGuideForm({...guideForm, descriptionEs: e.target.value})}
                      placeholder="Enter Spanish description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Form Type</Label>
                      <Input
                        value={guideForm.formType}
                        onChange={(e) => setGuideForm({...guideForm, formType: e.target.value})}
                        placeholder="e.g., I-130"
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={guideForm.price}
                        onChange={(e) => setGuideForm({...guideForm, price: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>Skill Level</Label>
                      <select
                        value={guideForm.skillLevel}
                        onChange={(e) => setGuideForm({...guideForm, skillLevel: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={guideForm.featured}
                        onChange={(e) => setGuideForm({...guideForm, featured: e.target.checked})}
                        className="mr-2"
                      />
                      Featured
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={guideForm.onlineFiling}
                        onChange={(e) => setGuideForm({...guideForm, onlineFiling: e.target.checked})}
                        className="mr-2"
                      />
                      Online Filing
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={() => setSelectedGuide(null)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpdateGuide}
                      disabled={updateGuideMutation.isPending}
                    >
                      {updateGuideMutation.isPending ? "Updating..." : "Update Guide"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
