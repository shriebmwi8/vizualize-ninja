
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart4, HeatMap, LineChart, BoxSelect, Image } from 'lucide-react';
import { downloadVisualization } from '@/lib/api';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'sonner';

interface VisualizationGalleryProps {
  visualizations: Record<string, string> | null;
  isLoading: boolean;
}

const VisualizationGallery: React.FC<VisualizationGalleryProps> = ({ 
  visualizations, 
  isLoading 
}) => {
  const handleDownloadImage = async (visualizationType: string) => {
    try {
      await downloadVisualization(visualizationType);
      toast.success(`${visualizationType} downloaded successfully`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Error downloading ${visualizationType}`);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="text-2xl font-semibold mb-4 text-center text-gray-700">Visualizations</div>
        <div className="h-80 flex flex-col items-center justify-center">
          <LoadingSpinner size={48} />
          <p className="mt-4 text-gray-500">Generating visualizations...</p>
        </div>
      </div>
    );
  }

  if (!visualizations) {
    return (
      <div className="w-full">
        <div className="text-2xl font-semibold mb-4 text-center text-gray-700">Visualizations</div>
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <Image className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl text-gray-500 mb-2">No visualizations available</p>
          <p className="text-gray-400">Please process your data first to generate visualizations</p>
        </div>
      </div>
    );
  }

  const visualizationItems = [
    { 
      key: 'correlation_heatmap', 
      title: 'Correlation Heatmap', 
      description: 'Visualizes the correlation between numerical variables',
      icon: <HeatMap className="h-5 w-5 text-red-500" />
    },
    { 
      key: 'histograms', 
      title: 'Histograms', 
      description: 'Shows the distribution of numerical variables',
      icon: <BarChart4 className="h-5 w-5 text-blue-500" />
    },
    { 
      key: 'pairplot', 
      title: 'Pairplot', 
      description: 'Displays relationships between multiple variables',
      icon: <LineChart className="h-5 w-5 text-green-500" />
    },
    { 
      key: 'boxplot', 
      title: 'Boxplot', 
      description: 'Shows statistical distribution of numerical variables',
      icon: <BoxSelect className="h-5 w-5 text-purple-500" />
    },
  ];

  return (
    <div className="w-full">
      <div className="text-2xl font-semibold mb-6 text-center text-gray-700">
        Interactive Visualizations
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visualizationItems.map((item) => (
          <Card key={item.key} className="overflow-hidden border border-gray-100 shadow-md hover:shadow-lg transition-all">
            <CardHeader className="p-4 bg-gradient-to-r from-gray-50 to-white border-b">
              <div className="flex items-center gap-2">
                {item.icon}
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </div>
              <CardDescription className="text-xs mt-1">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative group">
                <img 
                  src={visualizations[item.key]} 
                  alt={item.title}
                  className="w-full h-60 object-contain bg-white p-2"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white hover:bg-gray-100 text-gray-800"
                    onClick={() => handleDownloadImage(item.key)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VisualizationGallery;
