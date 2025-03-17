
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Download, FileText, Archive } from 'lucide-react';
import { downloadReport, downloadResults } from '@/lib/api';
import { toast } from 'sonner';

interface RegressionResultsProps {
  results: any;
  targetVariable: string;
  sessionId: string;
}

const RegressionResults: React.FC<RegressionResultsProps> = ({ 
  results, 
  targetVariable,
  sessionId
}) => {
  const handleDownloadReport = async () => {
    try {
      await downloadReport(sessionId);
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error downloading report');
    }
  };

  const handleDownloadResults = async () => {
    try {
      await downloadResults(sessionId);
      toast.success('Results downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error downloading results');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">
        Regression Results for {targetVariable}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 uppercase font-medium">R² Score</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">{results.model_results.r2.toFixed(3)}</p>
              <p className="text-xs mt-1 text-gray-600">
                Values closer to 1 indicate better fit
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 uppercase font-medium">Mean Squared Error</p>
              <p className="text-3xl font-bold text-purple-700 mt-1">{results.model_results.mse.toFixed(2)}</p>
              <p className="text-xs mt-1 text-gray-600">
                Lower values indicate better predictions
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 uppercase font-medium">Training Size</p>
              <p className="text-3xl font-bold text-green-700 mt-1">
                {results.model_results.num_samples - results.model_results.test_size}
              </p>
              <p className="text-xs mt-1 text-gray-600">
                Number of samples used for training
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Predicted vs Actual Values</h3>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
            <img 
              src={results.regression_plot} 
              alt="Predicted vs Actual Values"
              className="w-full object-contain max-h-96"
            />
          </div>
        </div>
        
        {results.feature_importance && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Feature Importance</h3>
            <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
              <img 
                src={results.feature_importance.image} 
                alt="Feature Importance"
                className="w-full object-contain max-h-96"
              />
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {results.feature_importance.data.map((feature: any) => (
                <div 
                  key={feature.Feature} 
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                >
                  <p className="font-medium text-gray-800">{feature.Feature}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${feature.Importance * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Score: {feature.Importance.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          onClick={handleDownloadReport}
          className="flex-1 bg-vizNinja-purple hover:bg-vizNinja-purple/90"
        >
          <FileText className="mr-2 h-5 w-5" />
          Download HTML Report
        </Button>
        
        <Button
          onClick={handleDownloadResults}
          className="flex-1 bg-vizNinja-teal hover:bg-vizNinja-teal/90"
        >
          <Archive className="mr-2 h-5 w-5" />
          Download All Results
        </Button>
      </div>
    </div>
  );
};

export default RegressionResults;
