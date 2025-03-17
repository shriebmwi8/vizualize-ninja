
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TrendingUp } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'sonner';

interface RegressionFormProps {
  onRunRegression: (targetVariable: string) => void;
  isLoading: boolean;
  availableFeatures?: string[];
}

const RegressionForm: React.FC<RegressionFormProps> = ({ 
  onRunRegression, 
  isLoading,
  availableFeatures = []
}) => {
  const [targetVariable, setTargetVariable] = useState<string>('');
  const [features, setFeatures] = useState<string[]>([]);
  
  useEffect(() => {
    // Load numeric features from localStorage if they exist
    const loadFeatures = () => {
      try {
        const storedFeatures = localStorage.getItem('numericFeatures');
        if (storedFeatures) {
          setFeatures(JSON.parse(storedFeatures));
        } else if (availableFeatures.length > 0) {
          setFeatures(availableFeatures);
        } else {
          // Fallback to default if no features are provided or stored
          setFeatures(["Age", "Income", "Spending", "Savings", "Credit Score"]);
        }
      } catch (error) {
        console.error('Error loading features:', error);
        setFeatures(availableFeatures.length > 0 ? availableFeatures : 
          ["Age", "Income", "Spending", "Savings", "Credit Score"]);
      }
    };
    
    loadFeatures();
  }, [availableFeatures]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetVariable) {
      toast.error('Please select a target variable');
      return;
    }
    onRunRegression(targetVariable);
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
              disabled={isLoading || features.length === 0}
            >
              <SelectTrigger id="target-variable" className="w-full">
                <SelectValue placeholder="Select a variable to predict" />
              </SelectTrigger>
              <SelectContent>
                {features.map((feature) => (
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
