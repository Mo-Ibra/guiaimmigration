import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DownloadLinksProps {
  downloadUrls: string[];
  guideName: string;
  attachmentNames?: string[];
  expiresIn?: string;
}

export const DownloadLinks: React.FC<DownloadLinksProps> = ({
  downloadUrls,
  guideName,
  attachmentNames = [],
  expiresIn = '24 hours'
}) => {
  const handleDownload = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = attachmentNames[index] || `${guideName}-attachment-${index + 1}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAttachmentName = (index: number): string => {
    if (attachmentNames[index]) {
      return attachmentNames[index];
    }
    if (downloadUrls.length === 1) {
      return guideName;
    }
    return `${guideName} - Attachment ${index + 1}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <CardTitle className="text-2xl text-green-800">Download Ready!</CardTitle>
        <CardDescription>
          Your purchase has been completed successfully. You can now download your immigration guide{downloadUrls.length > 1 ? 's' : ''}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">{guideName}</h3>
          <p className="text-sm text-blue-600 mb-3">
            {downloadUrls.length} attachment{downloadUrls.length > 1 ? 's' : ''} available for download
          </p>
          
          <div className="space-y-3">
            {downloadUrls.map((url, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border border-blue-100 rounded-md">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">{getAttachmentName(index)}</p>
                    <p className="text-sm text-gray-500">PDF Document</p>
                  </div>
                  {downloadUrls.length > 1 && (
                    <Badge variant="secondary">
                      Attachment {index + 1}
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={() => handleDownload(url, index)}
                  className="flex items-center space-x-2"
                  size="sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-amber-800">!</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-amber-800">Important Notes:</h4>
              <ul className="text-sm text-amber-700 mt-1 space-y-1">
                <li>• Download links expire in {expiresIn}</li>
                <li>• Save the files to your device for future reference</li>
                <li>• These are complete guides with step-by-step instructions</li>
                {downloadUrls.length > 1 && (
                  <li>• Each attachment contains different information - download all files</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Need help? Contact our support team for assistance.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadLinks;
