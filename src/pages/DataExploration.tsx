
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import DataSummary from '@/components/DataSummary';
import { getDataSummary } from '@/lib/api';
import { toast } from 'sonner';
import { BarChart, PieChart, LineChart } from 'lucide-react';

const DataExploration: React.FC = () => {
  const [dataSummary, setDataSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      setIsLoading(true);
      try {
        // Get data summary from the backend
        const summary = await getDataSummary();
        setDataSummary(summary);
      } catch (error) {
        console.error('Error loading summary:', error);
        toast.error('Error loading data summary. Please check if the server is running.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSummary();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-vizNinja-purple to-vizNinja-teal bg-clip-text text-transparent">
                Data Exploration
              </span>
            </h1>
            <div className="flex justify-center gap-4 mb-4">
              <BarChart className="h-8 w-8 text-vizNinja-purple" />
              <PieChart className="h-8 w-8 text-vizNinja-teal" />
              <LineChart className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Gain insights into your dataset with comprehensive summaries and statistics.
              Understand your data structure, missing values, and distributions at a glance.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl">
            <DataSummary summary={dataSummary} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataExploration;
