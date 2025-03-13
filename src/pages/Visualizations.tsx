
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import VisualizationGallery from '@/components/VisualizationGallery';
import { getMockVisualizations } from '@/lib/api';

const Visualizations: React.FC = () => {
  const [visualizations, setVisualizations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadVisualizations = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          const visData = getMockVisualizations();
          setVisualizations(visData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading visualizations:', error);
        setIsLoading(false);
      }
    };
    
    loadVisualizations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-vizNinja-darkGray mb-2">
              Data Visualizations
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore your data through interactive visualizations and charts.
            </p>
          </div>
          
          <VisualizationGallery 
            visualizations={visualizations} 
            isLoading={isLoading} 
          />
        </div>
      </main>
    </div>
  );
};

export default Visualizations;
