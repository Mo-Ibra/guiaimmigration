import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Plus, Edit, Trash2, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";

interface TranslationPricing {
  id: number;
  serviceType: string;
  pricePerPage: string;
  minimumPrice: string;
  deliveryDays: number;
  description: string;
  descriptionEs: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PricingFormData {
  serviceType: string;
  pricePerPage: string;
  minimumPrice: string;
  deliveryDays: number;
  description: string;
  descriptionEs: string;
  active: boolean;
}

const initialFormData: PricingFormData = {
  serviceType: "",
  pricePerPage: "",
  minimumPrice: "",
  deliveryDays: 1,
  description: "",
  descriptionEs: "",
  active: true,
};



export function AdminTranslationPricing() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState<TranslationPricing | null>(null);
  const [formData, setFormData] = useState<PricingFormData>(initialFormData);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pricingList = [], isLoading } = useQuery({
    queryKey: ["translation-pricing"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/translation-pricing");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: PricingFormData) => apiRequest("POST", "/api/admin/translation-pricing", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translation-pricing"] });
      setIsDialogOpen(false);
      setFormData(initialFormData);
      setEditingPricing(null);
      toast({
        title: "Success",
        description: "Translation pricing created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create translation pricing",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PricingFormData }) =>
      apiRequest("PUT", `/api/admin/translation-pricing/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translation-pricing"] });
      setIsDialogOpen(false);
      setFormData(initialFormData);
      setEditingPricing(null);
      toast({
        title: "Success",
        description: "Translation pricing updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update translation pricing",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/translation-pricing/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translation-pricing"] });
      toast({
        title: "Success",
        description: "Translation pricing deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete translation pricing",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPricing) {
      updateMutation.mutate({ id: editingPricing.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (pricing: TranslationPricing) => {
    setEditingPricing(pricing);
    setFormData({
      serviceType: pricing.serviceType,
      pricePerPage: pricing.pricePerPage,
      minimumPrice: pricing.minimumPrice,
      deliveryDays: pricing.deliveryDays,
      description: pricing.description,
      descriptionEs: pricing.descriptionEs,
      active: pricing.active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this pricing option?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingPricing(null);
  };

  const formatServiceType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading translation pricing...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Translation Pricing</h1>
          <p className="text-gray-600 mt-2">Manage translation service pricing options</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Pricing Option</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPricing ? "Edit Pricing Option" : "Add New Pricing Option"}
              </DialogTitle>
              <DialogDescription>
                Configure pricing for translation services. All prices are in USD.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="rush">Rush</SelectItem>
                      <SelectItem value="certified">Certified</SelectItem>
                      <SelectItem value="notarized">Notarized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deliveryDays">Delivery Days</Label>
                  <Input
                    id="deliveryDays"
                    type="number"
                    min="1"
                    value={formData.deliveryDays}
                    onChange={(e) => setFormData({ ...formData, deliveryDays: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pricePerPage">Price Per Page ($)</Label>
                  <Input
                    id="pricePerPage"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.pricePerPage}
                    onChange={(e) => setFormData({ ...formData, pricePerPage: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="minimumPrice">Minimum Price ($)</Label>
                  <Input
                    id="minimumPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.minimumPrice}
                    onChange={(e) => setFormData({ ...formData, minimumPrice: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description (English)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="descriptionEs">Description (Spanish)</Label>
                <Textarea
                  id="descriptionEs"
                  value={formData.descriptionEs}
                  onChange={(e) => setFormData({ ...formData, descriptionEs: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingPricing ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {pricingList.map((pricing: TranslationPricing) => (
          <Card key={pricing.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{formatServiceType(pricing.serviceType)} Translation</span>
                    {pricing.active ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {pricing.description}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(pricing)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(pricing.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-500">Per Page</div>
                    <div className="font-semibold">${pricing.pricePerPage}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-500">Minimum</div>
                    <div className="font-semibold">${pricing.minimumPrice}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <div>
                    <div className="text-sm text-gray-500">Delivery</div>
                    <div className="font-semibold">{pricing.deliveryDays} day{pricing.deliveryDays > 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <strong>Spanish:</strong> {pricing.descriptionEs}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pricingList.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No pricing options found</h3>
            <p className="text-gray-600 text-center mb-4">
              Get started by creating your first translation pricing option.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Pricing Option
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
