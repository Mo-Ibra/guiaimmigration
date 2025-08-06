import React, { useState } from 'react';
import { EnhancedFileUpload } from './EnhancedFileUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MultiFileUploadProps {
  guideId: number;
  onUploadSuccess: () => void;
  onUploadError?: (error: string) => void;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  showCompression?: boolean;
  guide?: {
    fileName?: string | null;
    fileName2?: string | null;
    fileType?: string | null;
    fileType2?: string | null;
  };
}

export const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  guideId,
  onUploadSuccess,
  onUploadError,
  maxFileSize = 100,
  acceptedTypes = ['.pdf', '.doc', '.docx'],
  showCompression = true,
  guide
}) => {
  const [uploadKey, setUploadKey] = useState(0);

  const handleUploadSuccess = () => {
    // Force re-render to refresh the file status
    setUploadKey(prev => prev + 1);
    onUploadSuccess();
  };

  const formatFileSize = (fileName: string | null): string => {
    if (!fileName) return '';
    // This is a placeholder - in a real app you'd get file size from somewhere
    return '(File uploaded)';
  };

  const getFileIcon = (fileName: string | null) => {
    if (!fileName) return null;
    return <FileText className="h-4 w-4 text-green-500" />;
  };

  const generateDownloadUrl = (attachmentNumber: 1 | 2): string => {
    // This is a placeholder URL - in a real app you'd generate a proper download token
    const tokenData = `guide-${guideId}-download-${Date.now()}`;
    const downloadToken = Buffer.from(tokenData).toString('base64');
    return `/api/download/${downloadToken}?attachment=${attachmentNumber}`;
  };

  const handleDownload = (attachmentNumber: 1 | 2) => {
    const url = generateDownloadUrl(attachmentNumber);
    const link = document.createElement('a');
    link.href = url;
    link.download = attachmentNumber === 1 ? (guide?.fileName || 'attachment1') : (guide?.fileName2 || 'attachment2');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Guide Attachments</CardTitle>
          <CardDescription>
            Upload up to two files for this guide. Customers will be able to download both attachments after purchase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="attachment1" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="attachment1" className="flex items-center space-x-2">
                <span>Attachment 1</span>
                {guide?.fileName && <Badge variant="secondary" className="ml-2">Uploaded</Badge>}
              </TabsTrigger>
              <TabsTrigger value="attachment2" className="flex items-center space-x-2">
                <span>Attachment 2</span>
                {guide?.fileName2 && <Badge variant="secondary" className="ml-2">Uploaded</Badge>}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="attachment1" className="space-y-4">
              <div className="space-y-4">
                {guide?.fileName && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(guide.fileName)}
                        <div>
                          <p className="text-sm font-medium text-green-800">{guide.fileName}</p>
                          <p className="text-xs text-green-600">{formatFileSize(guide.fileName)}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(1)}
                        className="flex items-center space-x-1"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                )}
                
                <EnhancedFileUpload
                  key={`attachment1-${uploadKey}`}
                  guideId={guideId}
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={onUploadError}
                  maxFileSize={maxFileSize}
                  acceptedTypes={acceptedTypes}
                  showCompression={showCompression}
                  attachmentNumber={1}
                  attachmentLabel="Upload Primary Attachment (PDF, DOC, DOCX)"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="attachment2" className="space-y-4">
              <div className="space-y-4">
                {guide?.fileName2 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(guide.fileName2)}
                        <div>
                          <p className="text-sm font-medium text-green-800">{guide.fileName2}</p>
                          <p className="text-xs text-green-600">{formatFileSize(guide.fileName2)}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(2)}
                        className="flex items-center space-x-1"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                )}
                
                <EnhancedFileUpload
                  key={`attachment2-${uploadKey}`}
                  guideId={guideId}
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={onUploadError}
                  maxFileSize={maxFileSize}
                  acceptedTypes={acceptedTypes}
                  showCompression={showCompression}
                  attachmentNumber={2}
                  attachmentLabel="Upload Secondary Attachment (PDF, DOC, DOCX)"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiFileUpload;
