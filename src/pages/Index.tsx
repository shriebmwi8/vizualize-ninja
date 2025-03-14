
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, BarChart3, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-vizNinja-purple to-vizNinja-teal bg-clip-text text-transparent">
            VizNinja Data Explorer
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Transform your raw data into beautiful visualizations with just a few clicks.
            Upload, clean, analyze, and visualize your data all in one place.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-vizNinja-lightPurple p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-vizNinja-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Data</h3>
              <p className="text-gray-500">
                Simply drag and drop your CSV file to begin your data journey.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-vizNinja-lightTeal p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-vizNinja-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Clean & Process</h3>
              <p className="text-gray-500">
                Handle missing values and prepare your data for analysis with ease.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visualize</h3>
              <p className="text-gray-500">
                Generate insightful visualizations to discover patterns in your data.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate('/home')} 
            className="bg-gradient-to-r from-vizNinja-purple to-vizNinja-teal hover:opacity-90 text-white px-8 py-6 rounded-lg text-lg font-medium"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
