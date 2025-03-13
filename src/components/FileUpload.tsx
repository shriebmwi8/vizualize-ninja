
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, File } from 'lucide-react';
import { uploadFile, getDataPreview } from '@/lib/api';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileUploaded: (data: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('Please upload a CSV file');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (!droppedFile.name.endsWith('.csv')) {
        toast.error('Please upload a CSV file');
        return;
      }
      
      setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Upload file to backend
      await uploadFile(file);
      toast.success('File uploaded successfully');
      
      // Get the preview data
      const previewData = await getDataPreview();
      onFileUploaded(previewData);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading file. Please check if the server is running.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragging ? 'border-vizNinja-purple bg-vizNinja-lightPurple' : 'border-gray-300'
          } transition-colors duration-200 cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          
          <div className="flex flex-col items-center justify-center py-4">
            <Upload 
              className="h-12 w-12 text-vizNinja-purple mb-2" 
              strokeWidth={1.5} 
            />
            <h3 className="text-lg font-semibold mb-2">Upload your CSV file</h3>
            <p className="text-sm text-gray-500 mb-2">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-gray-400">
              (Maximum file size: 10MB)
            </p>
          </div>
        </div>

        {file && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <File className="h-5 w-5 text-vizNinja-purple mr-2" />
              <span className="text-sm font-medium truncate max-w-[200px] md:max-w-xs">
                {file.name}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({(file.size / 1024).toFixed(2)} KB)
              </span>
            </div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <Button
          className="w-full mt-4 bg-vizNinja-purple hover:bg-vizNinja-purple/90"
          disabled={!file || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? (
            <LoadingSpinner className="mr-2" size={16} />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isUploading ? 'Uploading...' : 'Upload & Analyze'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
