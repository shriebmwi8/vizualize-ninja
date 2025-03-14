
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import VisualizationGallery from '@/components/VisualizationGallery';
import { getVisualizations } from '@/lib/api';
import { toast } from 'sonner';
import { BarChart, LineChart, Sparkles } from 'lucide-react';

const Visualizations: React.FC = () => {
  const [visualizations, setVisualizations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVisualizations = async () => {
      setIsLoading(true);
      try {
        // Get visualizations from the backend
        const visData = await getVisualizations();
        setVisualizations(visData);
      } catch (error) {
        console.error('Error loading visualizations:', error);
        toast.error('Error loading visualizations. Please check if the server is running.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVisualizations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-vizNinja-purple to-vizNinja-teal bg-clip-text text-transparent">
                Data Visualizations
              </span>
            </h1>
            <div className="flex justify-center items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <BarChart className="h-8 w-8 text-vizNinja-purple" />
              <LineChart className="h-8 w-8 text-vizNinja-teal" />
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Visualize your data through beautiful charts and graphs. 
              Discover patterns, correlations, and distributions that text alone can't reveal.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 transform transition-all hover:shadow-xl">
            <VisualizationGallery 
              visualizations={visualizations} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Visualizations;
