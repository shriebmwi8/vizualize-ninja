
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { processData } from '@/lib/api';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'sonner';

interface PreprocessingOptionsProps {
  onProcessingComplete: () => void;
  disabled?: boolean;
}

const PreprocessingOptions: React.FC<PreprocessingOptionsProps> = ({ 
  onProcessingComplete,
  disabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState('mean');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      // Map frontend options to backend options (1, 2, 3)
      const optionMap: Record<string, string> = {
        'mean': '1',
        'median': '2',
        'drop': '3'
      };
      
      // Process data with selected option
      await processData(optionMap[selectedOption]);
      toast.success('Data processed successfully');
      onProcessingComplete();
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Error processing data. Please check if the server is running.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Preprocessing Options</CardTitle>
        <CardDescription>
          Choose how to handle missing values in your dataset
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedOption} 
          onValueChange={setSelectedOption}
          className="flex flex-col space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mean" id="mean" disabled={disabled} />
            <Label htmlFor="mean" className={disabled ? "text-gray-400" : ""}>
              Fill with mean (numeric) / mode (categorical)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="median" id="median" disabled={disabled} />
            <Label htmlFor="median" className={disabled ? "text-gray-400" : ""}>
              Fill with median (numeric) / mode (categorical)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="drop" id="drop" disabled={disabled} />
            <Label htmlFor="drop" className={disabled ? "text-gray-400" : ""}>
              Drop rows with missing values
            </Label>
          </div>
        </RadioGroup>

        <Button
          className="w-full mt-6 bg-vizNinja-teal hover:bg-vizNinja-teal/90"
          onClick={handleProcess}
          disabled={disabled || isProcessing}
        >
          {isProcessing ? (
            <>
              <LoadingSpinner className="mr-2" size={16} />
              Processing...
            </>
          ) : (
            'Process Data'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PreprocessingOptions;
