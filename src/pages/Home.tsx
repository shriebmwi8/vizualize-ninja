
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import DataPreview from '@/components/DataPreview';
import PreprocessingOptions from '@/components/PreprocessingOptions';
import Navbar from '@/components/Navbar';
import { downloadCleanedData } from '@/lib/api';
import { toast } from 'sonner';

const Home: React.FC = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [dataProcessed, setDataProcessed] = useState(false);
  const [dataPreview, setDataPreview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUploaded = (previewData: any) => {
    setDataPreview(previewData);
    setFileUploaded(true);
    setIsLoading(false);
  };

  const handleProcessingComplete = () => {
    setDataProcessed(true);
  };

  const handleDownload = async () => {
    try {
      await downloadCleanedData();
      toast.success("Cleaned data downloaded successfully");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download the cleaned data. Please check if the server is running.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              <span className="bg-gradient-to-r from-vizNinja-purple to-vizNinja-teal bg-clip-text text-transparent">
                Data Exploration & Visualization
              </span>
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Upload your CSV file to explore, analyze, and visualize your data.
              Get meaningful insights in seconds with our powerful preprocessing tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="transform transition-all hover:scale-[1.01]">
              <FileUpload onFileUploaded={handleFileUploaded} />
            </div>
            <div className="transform transition-all hover:scale-[1.01]">
              <PreprocessingOptions 
                onProcessingComplete={handleProcessingComplete}
                disabled={!fileUploaded}
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 transform transition-all hover:shadow-lg">
            <DataPreview data={dataPreview} isLoading={isLoading} />
          </div>
          
          {dataProcessed && (
            <div className="mt-8 text-center animate-fade-in">
              <Button 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-5 w-5" />
                Download Cleaned Dataset
              </Button>
              <p className="text-gray-500 mt-2 text-sm">
                Get your preprocessed data ready for further analysis
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
