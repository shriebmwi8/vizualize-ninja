
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, File, FileType } from 'lucide-react';
import { uploadFile, updateLocalStorage } from '@/lib/api';
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
      const response = await uploadFile(file);
      toast.success('File uploaded successfully');
      
      // Save session data to localStorage
      updateLocalStorage(response);
      
      // Prepare data preview in the format expected by the component
      const previewData = {
        columns: response.stats.column_names,
        data: response.stats.sample_data.map((row: any) => 
          Object.values(row)
        )
      };
      
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
    <Card className="w-full overflow-hidden border-0 shadow-lg">
      <CardContent className="p-6">
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center ${
            isDragging ? 'border-vizNinja-purple bg-vizNinja-lightPurple/50' : 'border-gray-200 hover:border-vizNinja-purple hover:bg-vizNinja-lightPurple/20'
          } transition-all duration-300 cursor-pointer`}
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
          
          <div className="flex flex-col items-center justify-center py-6">
            <div className="bg-vizNinja-lightPurple p-4 rounded-full mb-4">
              <Upload 
                className="h-10 w-10 text-vizNinja-purple" 
                strokeWidth={1.5} 
              />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Upload your CSV file</h3>
            <p className="text-gray-500 mb-2">
              Drag and drop your file here or click to browse
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <FileType className="h-3 w-3" />
              Supported format: CSV (Maximum: 10MB)
            </p>
          </div>
        </div>

        {file && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between border border-gray-100">
            <div className="flex items-center overflow-hidden">
              <div className="bg-blue-100 p-2 rounded-md mr-3">
                <File className="h-5 w-5 text-blue-600" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate max-w-[200px] md:max-w-xs text-gray-700">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Button
          className="w-full mt-6 bg-gradient-to-r from-vizNinja-purple to-vizNinja-purple/90 hover:opacity-90 transition-opacity"
          disabled={!file || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? (
            <>
              <LoadingSpinner className="mr-2" size={18} />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              <span>Upload & Analyze</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
