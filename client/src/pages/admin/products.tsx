import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  FileText,
  DollarSign,
  Star,
  Globe,
  Eye,
  Download,
  Loader2
} from "lucide-react";
import { apiRequest } from "../../lib/queryClient";
import { EnhancedFileUpload } from "../../components/EnhancedFileUpload";

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
  fileName2?: string;
  fileContent2?: string;
  fileType2?: string;
  createdAt: string;
}

export function AdminProducts() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [previewGuide, setPreviewGuide] = useState<Guide | null>(null);
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    fetchGuides();
  }, []);

  useEffect(() => {
    const filtered = guides.filter(guide =>
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.formType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.skillLevel.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGuides(filtered);
  }, [guides, searchTerm]);

  const fetchGuides = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/guides");
      const data = await response.json();
      setGuides(data);
    } catch (error) {
      console.error("Failed to fetch guides:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshGuidesAndUpdateEditingGuide = async (editingGuideId: number) => {
    try {
      const response = await apiRequest("GET", "/api/admin/guides");
      const data = await response.json();
      setGuides(data);
      
      // Update the editingGuide state with the refreshed data
      const refreshedGuide = data.find((g: Guide) => g.id === editingGuideId);
      if (refreshedGuide) {
        setEditingGuide(refreshedGuide);
      }
    } catch (error) {
      console.error("Failed to refresh guides:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate file requirement for new guides
    if (!editingGuide && selectedFiles.length === 0) {
      alert("Please select at least one file to upload. A guide file is required for new guides.");
      return;
    }

    // Validate individual file size limits (100MB per file)
    for (const file of selectedFiles) {
      if (file.size > 100 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 100MB individual file limit. Please select a smaller file.`);
        return;
      }
    }

    // Validate total combined file size (100MB total limit)
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 100 * 1024 * 1024) {
      alert(`Total file size (${(totalSize / 1024 / 1024).toFixed(2)}MB) exceeds the 100MB total limit. Please select smaller files or remove some files.`);
      return;
    }

    setSaving(true);
    try {
      if (editingGuide) {
        const response = await apiRequest("PATCH", `/api/admin/guides/${editingGuide.id}`, formData);
        const updatedGuide = await response.json();

        // If there are files selected for editing, upload them
        if (selectedFiles.length > 0) {
          await handleFileUpload(editingGuide.id);
          // Refresh guides list and update editingGuide state
          await refreshGuidesAndUpdateEditingGuide(editingGuide.id);
        } else {
          setGuides(guides.map(g => g.id === editingGuide.id ? updatedGuide : g));
        }
      } else {
        // First create the guide
        const response = await apiRequest("POST", "/api/admin/guides", formData);
        const newGuide = await response.json();

        // Upload the required files
        if (selectedFiles.length > 0 && newGuide.id) {
          await handleFileUpload(newGuide.id);
          // Refresh guides list to get updated guide with file information
          await fetchGuides();
        } else {
          setGuides([...guides, newGuide]);
        }
      }

      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save guide:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : null,
        formData,
        editingGuide: editingGuide ? { id: editingGuide.id, title: editingGuide.title } : null
      });
      
      // Show more detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to ${editingGuide ? 'update' : 'create'} guide. Error: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (guideId: number) => {
    if (selectedFiles.length === 0) return;

    try {
      // Determine which attachment slots to use based on existing files
      const getNextAttachmentNumber = (index: number) => {
        if (!editingGuide) {
          // For new guides, use sequential numbering
          return index + 1;
        }
        
        // For existing guides, check which slots are available
        const hasFile1 = editingGuide.fileName && editingGuide.fileContent;
        const hasFile2 = editingGuide.fileName2 && editingGuide.fileContent2;
        
        if (index === 0) {
          // For the first file being uploaded
          if (!hasFile1) {
            return 1; // Use slot 1 if it's empty
          } else if (!hasFile2) {
            return 2; // Use slot 2 if slot 1 is occupied
          } else {
            return 1; // Replace slot 1 if both are occupied
          }
        } else {
          // For the second file being uploaded
          if (!hasFile2) {
            return 2; // Use slot 2 if it's empty
          } else {
            return 1; // This shouldn't happen with proper validation
          }
        }
      };

      for (let i = 0; i < selectedFiles.length && i < 2; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        const attachmentNumber = getNextAttachmentNumber(i);

        // Use enhanced upload for large files (>25MB to be safe with 100MB files)
        if (file.size > 25 * 1024 * 1024) {
          // Use the large file upload endpoint with compression
          formData.append('file', file);
          formData.append('compressed', 'false'); // Don't compress for now to avoid issues
          formData.append('attachmentNumber', attachmentNumber.toString());

          const response = await fetch(`/api/admin/guides/${guideId}/upload-large-file-direct`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error(`Large file upload failed for ${file.name}`);
          }
        } else {
          // Use regular upload for smaller files
          formData.append('file', file);
          formData.append('attachmentNumber', attachmentNumber.toString());

          const response = await fetch(`/api/admin/guides/${guideId}/upload-file`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error(`File upload failed for ${file.name}`);
          }
        }
      }

      console.log("Files uploaded successfully");
    } catch (error) {
      console.error("Failed to upload files:", error);
      throw error; // Re-throw to handle in calling function
    }
  };

  const handleDownloadFile = (guide: Guide) => {
    if (!guide.fileContent || !guide.fileName) {
      console.error("No file content available");
      return;
    }

    try {
      // Convert base64 to blob
      const byteCharacters = atob(guide.fileContent);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: guide.fileType || 'application/octet-stream' });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = guide.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const handleViewFile = (guide: Guide) => {
    if (!guide.fileContent || !guide.fileName) {
      console.error("No file content available");
      return;
    }

    setPreviewGuide(guide);
    setShowFilePreview(true);
  };

  const handleViewFileInNewTab = (guide: Guide) => {
    if (!guide.fileContent || !guide.fileName) {
      console.error("No file content available");
      return;
    }

    try {
      // Convert base64 to blob
      const byteCharacters = atob(guide.fileContent);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: guide.fileType || 'application/octet-stream' });

      // Create URL and open in new tab
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

      // Clean up the URL after a delay to allow the browser to load it
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Failed to view file:", error);
    }
  };

  const deleteGuide = async (id: number) => {
    if (!confirm("Are you sure you want to delete this guide?")) return;

    setDeleting(id);
    try {
      await apiRequest("DELETE", `/api/admin/guides/${id}`);
      setGuides(guides.filter(g => g.id !== id));
    } catch (error) {
      console.error("Failed to delete guide:", error);
      alert("Failed to delete guide. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    
    // Validate file count (max 2 files)
    if (newFiles.length > 2) {
      alert("You can upload a maximum of 2 files per guide.");
      return;
    }

    // Validate individual file sizes (100MB limit per file)
    for (const file of newFiles) {
      if (file.size > 100 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 100MB individual file limit. Please select a smaller file.`);
        return;
      }
    }

    // Add new files to existing selection (accumulate up to 2 files)
    const allFiles = [...selectedFiles, ...newFiles];
    if (allFiles.length > 2) {
      alert("You can only have a maximum of 2 files. Please remove some files first.");
      return;
    }

    // Validate total combined file size (100MB total limit)
    const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 100 * 1024 * 1024) {
      alert(`Total file size (${(totalSize / 1024 / 1024).toFixed(2)}MB) exceeds the 100MB total limit. Please select smaller files or remove some files.`);
      return;
    }

    setSelectedFiles(allFiles);
    
    // Clear the input to allow selecting the same file again if needed
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
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
    setEditingGuide(null);
    setSelectedFiles([]);
  };

  const openEditModal = (guide: Guide) => {
    setEditingGuide(guide);
    setFormData({
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
    // Reset selected files when opening edit modal
    setSelectedFiles([]);
    setShowModal(true);
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <Button onClick={() => setShowModal(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Guide</span>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <Card key={guide.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{guide.title}</CardTitle>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{guide.formType}</Badge>
                    <Badge className={getSkillLevelColor(guide.skillLevel)}>
                      {guide.skillLevel}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {guide.featured && <Star className="w-4 h-4 text-yellow-500" />}
                  {guide.onlineFiling && <Globe className="w-4 h-4 text-blue-500" />}
                  {(guide.fileName || guide.fileName2) && (
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4 text-gray-500" />
                      {guide.fileName && guide.fileName2 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-1 rounded">2</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{guide.description}</p>

              {guide.fileName || guide.fileName2 ? (
                <div className="space-y-2 mb-3">
                  {/* Primary File */}
                  {guide.fileName && (
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-sm text-gray-700 truncate block">File 1: {guide.fileName}</span>
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewFile(guide);
                          }}
                          className="h-6 px-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                          title="View file 1"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadFile(guide);
                          }}
                          className="h-6 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                          title="Download file 1"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Secondary File */}
                  {guide.fileName2 && (
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded-md border border-blue-200">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-sm text-blue-700 truncate block">File 2: {guide.fileName2}</span>
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            const secondFileGuide = {
                              ...guide,
                              fileName: guide.fileName2,
                              fileContent: guide.fileContent2,
                              fileType: guide.fileType2
                            };
                            handleViewFile(secondFileGuide);
                          }}
                          className="h-6 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                          title="View file 2"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            const secondFileGuide = {
                              ...guide,
                              fileName: guide.fileName2,
                              fileContent: guide.fileContent2,
                              fileType: guide.fileType2
                            };
                            handleDownloadFile(secondFileGuide);
                          }}
                          className="h-6 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                          title="Download file 2"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2 mb-3 p-2 bg-gray-50 rounded-md border border-gray-200">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">No files attached</span>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="font-bold text-lg">{guide.price}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(guide.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(guide)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteGuide(guide.id)}
                  disabled={deleting === guide.id}
                  className="text-red-600 hover:text-red-700"
                >
                  {deleting === guide.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                {editingGuide ? 'Edit Guide' : 'Add New Guide'}
              </h3>
              <Button variant="outline" onClick={() => {
                setShowModal(false);
                resetForm();
              }}>
                ×
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title (English)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="titleEs">Title (Spanish)</Label>
                  <Input
                    id="titleEs"
                    value={formData.titleEs}
                    onChange={(e) => setFormData({...formData, titleEs: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description (English)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="descriptionEs">Description (Spanish)</Label>
                <Textarea
                  id="descriptionEs"
                  value={formData.descriptionEs}
                  onChange={(e) => setFormData({...formData, descriptionEs: e.target.value})}
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="formType">Form Type</Label>
                  <Input
                    id="formType"
                    value={formData.formType}
                    onChange={(e) => setFormData({...formData, formType: e.target.value})}
                    placeholder="e.g., I-130"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="skillLevel">Skill Level</Label>
                  <Select value={formData.skillLevel} onValueChange={(value) => setFormData({...formData, skillLevel: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                  />
                  <Label htmlFor="featured">Featured Guide</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="onlineFiling"
                    checked={formData.onlineFiling}
                    onCheckedChange={(checked) => setFormData({...formData, onlineFiling: checked})}
                  />
                  <Label htmlFor="onlineFiling">Online Filing Available</Label>
                </div>
              </div>

              {/* File Upload Section */}
              <div>
                <Label htmlFor="guideFiles">
                  Guide Files (PDF, DOC, DOCX) - Max 100MB per file, 100MB total {!editingGuide && <span className="text-red-500">*</span>}
                </Label>
                <div className="mt-2 space-y-3">
                  {/* Current File Status */}
                  {editingGuide && (
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Current Files Status:</span>
                        </div>
                      </div>
                      <div className="mt-2 space-y-2">
                        {/* Primary File */}
                        <div className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-500">File 1:</span>
                            {editingGuide.fileName ? (
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1 text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs">
                                  <FileText className="w-3 h-3" />
                                  <span>Attached</span>
                                </div>
                                <span className="text-sm text-gray-600">{editingGuide.fileName}</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 text-orange-700 bg-orange-100 px-2 py-1 rounded text-xs">
                                <FileText className="w-3 h-3" />
                                <span>No File</span>
                              </div>
                            )}
                          </div>
                          {editingGuide.fileName && editingGuide.fileContent && (
                            <div className="flex space-x-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewFile(editingGuide)}
                                className="text-xs flex items-center space-x-1 h-6 px-2"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View</span>
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadFile(editingGuide)}
                                className="text-xs flex items-center space-x-1 h-6 px-2"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {/* Secondary File */}
                        <div className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-500">File 2:</span>
                            {editingGuide.fileName2 ? (
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1 text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs">
                                  <FileText className="w-3 h-3" />
                                  <span>Attached</span>
                                </div>
                                <span className="text-sm text-gray-600">{editingGuide.fileName2}</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">
                                <FileText className="w-3 h-3" />
                                <span>No File</span>
                              </div>
                            )}
                          </div>
                          {editingGuide.fileName2 && editingGuide.fileContent2 && (
                            <div className="flex space-x-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Create a temporary guide object for the second file
                                  const secondFileGuide = {
                                    ...editingGuide,
                                    fileName: editingGuide.fileName2,
                                    fileContent: editingGuide.fileContent2,
                                    fileType: editingGuide.fileType2
                                  };
                                  handleViewFile(secondFileGuide);
                                }}
                                className="text-xs flex items-center space-x-1 h-6 px-2"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View</span>
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Create a temporary guide object for the second file
                                  const secondFileGuide = {
                                    ...editingGuide,
                                    fileName: editingGuide.fileName2,
                                    fileContent: editingGuide.fileContent2,
                                    fileType: editingGuide.fileType2
                                  };
                                  handleDownloadFile(secondFileGuide);
                                }}
                                className="text-xs flex items-center space-x-1 h-6 px-2"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* File Upload Input */}
                  <div>
                    <input
                      id="guideFiles"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      multiple
                      onChange={handleFileSelect}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      disabled={selectedFiles.length >= 2}
                    />
                    
                    {/* Selected Files Display */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="p-2 bg-blue-50 rounded border border-blue-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-blue-700 font-medium truncate">
                                  {file.name}
                                </p>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="text-xs text-blue-600">
                                    Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                  {file.size > 50 * 1024 * 1024 && (
                                    <span className="text-xs text-orange-600">
                                      Large file - using enhanced upload (compression disabled for stability)
                                    </span>
                                  )}
                                  {file.size > 100 * 1024 * 1024 && (
                                    <span className="text-xs text-red-600 font-medium">
                                      File exceeds 100MB individual limit
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-600 text-sm font-medium"
                            type="button"
                          >
                            Remove
                          </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingGuide ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingGuide ? 'Update Guide' : 'Create Guide'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {showFilePreview && previewGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">File Preview</h3>
                <p className="text-gray-600">{previewGuide.fileName}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleViewFileInNewTab(previewGuide)}
                  className="flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Open in New Tab</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownloadFile(previewGuide)}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowFilePreview(false);
                    setPreviewGuide(null);
                  }}
                >
                  ×
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {previewGuide.fileType?.includes('pdf') ? (
                <iframe
                  src={`data:${previewGuide.fileType};base64,${previewGuide.fileContent}`}
                  className="w-full h-full border rounded"
                  title="PDF Preview"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded border">
                  <FileText className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Preview not available for this file type</p>
                  <p className="text-sm text-gray-500 mb-4">
                    File type: {previewGuide.fileType || 'Unknown'}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleViewFileInNewTab(previewGuide)}
                      className="flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Open in New Tab</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadFile(previewGuide)}
                      className="flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
