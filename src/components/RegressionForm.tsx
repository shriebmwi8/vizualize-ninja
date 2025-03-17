
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TrendingUp } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface RegressionFormProps {
  onRunRegression: (targetVariable: string) => void;
  isLoading: boolean;
}

const RegressionForm: React.FC<RegressionFormProps> = ({ onRunRegression, isLoading }) => {
  const [targetVariable, setTargetVariable] = useState<string>('');
  
  // Mock numeric features available for regression
  const availableFeatures = ["Age", "Income", "Spending", "Savings", "Credit Score"];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetVariable) {
      onRunRegression(targetVariable);
    }
  };
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Configure Regression Model</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="target-variable" className="text-gray-700">
              Select Target Variable to Predict
            </Label>
            <Select 
              value={targetVariable} 
              onValueChange={setTargetVariable}
              disabled={isLoading}
            >
              <SelectTrigger id="target-variable" className="w-full">
                <SelectValue placeholder="Select a variable to predict" />
              </SelectTrigger>
              <SelectContent>
                {availableFeatures.map((feature) => (
                  <SelectItem key={feature} value={feature}>
                    {feature}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              This is the dependent variable your model will predict
            </p>
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-vizNinja-purple to-blue-600 hover:opacity-90"
              disabled={!targetVariable || isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="mr-2" size={18} />
                  Running Regression...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Run Regression Analysis
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegressionForm;
