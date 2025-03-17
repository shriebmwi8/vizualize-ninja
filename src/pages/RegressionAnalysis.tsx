
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import RegressionForm from '@/components/RegressionForm';
import RegressionResults from '@/components/RegressionResults';
import { runRegression } from '@/lib/api';
import { toast } from 'sonner';
import { BarChart, TrendingUp, LineChart } from 'lucide-react';

const RegressionAnalysis: React.FC = () => {
  const [sessionId, setSessionId] = useState<string>('');
  const [targetVariable, setTargetVariable] = useState<string>('');
  const [regressionResults, setRegressionResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [numericFeatures, setNumericFeatures] = useState<string[]>([]);

  useEffect(() => {
    // Get sessionId from localStorage
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }
    
    // Get numeric features from localStorage
    const storedNumericFeatures = localStorage.getItem('numericFeatures');
    if (storedNumericFeatures) {
      setNumericFeatures(JSON.parse(storedNumericFeatures));
    }
  }, []);

  const handleRunRegression = async (target: string) => {
    if (!sessionId) {
      toast.error('No session found. Please upload and process a file first.');
      return;
    }
    
    setIsLoading(true);
    setTargetVariable(target);
    
    try {
      const results = await runRegression(target);
      setRegressionResults(results);
      toast.success('Regression analysis completed successfully');
    } catch (error) {
      console.error('Regression error:', error);
      toast.error('Error running regression analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-vizNinja-purple to-vizNinja-teal bg-clip-text text-transparent">
                Linear Regression Analysis
              </span>
            </h1>
            <div className="flex justify-center gap-4 mb-4">
              <TrendingUp className="h-8 w-8 text-vizNinja-purple" />
              <BarChart className="h-8 w-8 text-vizNinja-teal" />
              <LineChart className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Build a linear regression model to predict your target variable and 
              analyze feature importance for more powerful insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md transform transition-all hover:shadow-lg">
              <RegressionForm 
                onRunRegression={handleRunRegression} 
                isLoading={isLoading}
                availableFeatures={numericFeatures}
              />
            </div>
          </div>
          
          {regressionResults && (
            <div className="bg-white p-6 rounded-xl shadow-md transform transition-all hover:shadow-lg">
              <RegressionResults results={regressionResults} targetVariable={targetVariable} sessionId={sessionId} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RegressionAnalysis;
