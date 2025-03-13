
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface VisualizationGalleryProps {
  visualizations: Record<string, string> | null;
  isLoading: boolean;
}

const VisualizationGallery: React.FC<VisualizationGalleryProps> = ({ 
  visualizations, 
  isLoading 
}) => {
  const downloadImage = (imageUrl: string, imageName: string) => {
    // Create a link element, set the download attribute, and click it
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${imageName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Visualizations</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <LoadingSpinner size={32} />
        </CardContent>
      </Card>
    );
  }

  if (!visualizations) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Visualizations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No visualizations available. Please process your data first.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const visualizationItems = [
    { key: 'heatmap', title: 'Correlation Heatmap', description: 'Visualizes the correlation between numerical variables' },
    { key: 'histogram', title: 'Histograms', description: 'Shows the distribution of numerical variables' },
    { key: 'pairplot', title: 'Pairplot', description: 'Displays relationships between multiple variables' },
    { key: 'boxplot', title: 'Boxplot', description: 'Shows statistical distribution of numerical variables' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visualizations</CardTitle>
        <CardDescription>
          Explore your data through different visualizations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visualizationItems.map((item) => (
            <Card key={item.key} className="overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="text-xs">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={visualizations[item.key]} 
                    alt={item.title}
                    className="w-full h-52 object-cover"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => downloadImage(visualizations[item.key], item.key)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualizationGallery;
