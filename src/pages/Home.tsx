import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import DataPreview from '@/components/DataPreview';
import PreprocessingOptions from '@/components/PreprocessingOptions';
import Navbar from '@/components/Navbar';
import { downloadCleanedData } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Home: React.FC = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [dataProcessed, setDataProcessed] = useState(false);
  const [dataPreview, setDataPreview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      toast({
        title: "Success",
        description: "Cleaned data downloaded successfully",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download the cleaned data. Please check if the server is running.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-vizNinja-darkGray mb-2">
              Data Visualization & Exploration
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Upload your CSV file to explore, analyze, and visualize your data. 
              Get insights in seconds with our powerful preprocessing and visualization tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <FileUpload onFileUploaded={handleFileUploaded} />
            <PreprocessingOptions 
              onProcessingComplete={handleProcessingComplete}
              disabled={!fileUploaded}
            />
          </div>
          
          <DataPreview data={dataPreview} isLoading={isLoading} />
          
          {dataProcessed && (
            <div className="mt-6 text-center">
              <Button 
                className="bg-vizNinja-teal hover:bg-vizNinja-teal/90"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Cleaned Dataset
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
