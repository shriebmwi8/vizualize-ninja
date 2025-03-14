
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { processData } from '@/lib/api';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'sonner';
import { Wand2, Activity, Trash2 } from 'lucide-react';

interface PreprocessingOptionsProps {
  onProcessingComplete: () => void;
  disabled?: boolean;
}

const PreprocessingOptions: React.FC<PreprocessingOptionsProps> = ({ 
  onProcessingComplete,
  disabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState('1'); // Default to mean/mode
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      // Process data with selected option
      await processData(selectedOption);
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
    <Card className="w-full border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-vizNinja-lightTeal to-vizNinja-lightPurple/50 pb-6">
        <CardTitle className="text-xl text-gray-800">Preprocessing Options</CardTitle>
        <CardDescription className="text-gray-600">
          Choose how to handle missing values in your dataset
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <RadioGroup 
          value={selectedOption} 
          onValueChange={setSelectedOption}
          className="flex flex-col space-y-4"
        >
          <div className={`flex items-center space-x-3 p-3 rounded-lg ${selectedOption === '1' ? 'bg-vizNinja-lightPurple/30' : 'hover:bg-gray-50'} transition-colors`}>
            <RadioGroupItem value="1" id="mean" disabled={disabled} className={selectedOption === '1' ? 'text-vizNinja-purple' : ''} />
            <div className="flex items-center">
              <Wand2 className={`mr-2 h-5 w-5 ${selectedOption === '1' ? 'text-vizNinja-purple' : 'text-gray-400'}`} />
              <Label htmlFor="mean" className={`${disabled ? "text-gray-400" : selectedOption === '1' ? "text-gray-800 font-medium" : "text-gray-600"}`}>
                Fill with mean (numeric) / mode (categorical)
              </Label>
            </div>
          </div>
          
          <div className={`flex items-center space-x-3 p-3 rounded-lg ${selectedOption === '2' ? 'bg-vizNinja-lightTeal/30' : 'hover:bg-gray-50'} transition-colors`}>
            <RadioGroupItem value="2" id="median" disabled={disabled} className={selectedOption === '2' ? 'text-vizNinja-teal' : ''} />
            <div className="flex items-center">
              <Activity className={`mr-2 h-5 w-5 ${selectedOption === '2' ? 'text-vizNinja-teal' : 'text-gray-400'}`} />
              <Label htmlFor="median" className={`${disabled ? "text-gray-400" : selectedOption === '2' ? "text-gray-800 font-medium" : "text-gray-600"}`}>
                Fill with median (numeric) / mode (categorical)
              </Label>
            </div>
          </div>
          
          <div className={`flex items-center space-x-3 p-3 rounded-lg ${selectedOption === '3' ? 'bg-red-50' : 'hover:bg-gray-50'} transition-colors`}>
            <RadioGroupItem value="3" id="drop" disabled={disabled} className={selectedOption === '3' ? 'text-red-500' : ''} />
            <div className="flex items-center">
              <Trash2 className={`mr-2 h-5 w-5 ${selectedOption === '3' ? 'text-red-500' : 'text-gray-400'}`} />
              <Label htmlFor="drop" className={`${disabled ? "text-gray-400" : selectedOption === '3' ? "text-gray-800 font-medium" : "text-gray-600"}`}>
                Drop rows with missing values
              </Label>
            </div>
          </div>
        </RadioGroup>

        <Button
          className={`w-full mt-8 ${disabled ? 'bg-gray-300' : 'bg-gradient-to-r from-vizNinja-teal to-blue-500'} hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all`}
          onClick={handleProcess}
          disabled={disabled || isProcessing}
        >
          {isProcessing ? (
            <>
              <LoadingSpinner className="mr-2" size={18} />
              Processing...
            </>
          ) : (
            <>
              {selectedOption === '3' ? <Trash2 className="mr-2 h-5 w-5" /> : <Wand2 className="mr-2 h-5 w-5" />}
              Process Data
            </>
          )}
        </Button>
        
        {disabled && (
          <p className="text-center text-gray-500 text-sm mt-4">
            Please upload a CSV file first
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PreprocessingOptions;
