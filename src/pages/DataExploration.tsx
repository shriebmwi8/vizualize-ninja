
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DataSummary from '@/components/DataSummary';
import { getMockDataSummary } from '@/lib/api';

const DataExploration: React.FC = () => {
  const [dataSummary, setDataSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadSummary = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          const summary = getMockDataSummary();
          setDataSummary(summary);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading summary:', error);
        setIsLoading(false);
      }
    };
    
    loadSummary();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-vizNinja-darkGray mb-2">
              Data Exploration
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Gain insights into your dataset with comprehensive summaries and statistics.
            </p>
          </div>
          
          <DataSummary summary={dataSummary} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default DataExploration;
