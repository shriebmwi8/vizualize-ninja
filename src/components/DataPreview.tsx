
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from './LoadingSpinner';

interface DataPreviewProps {
  data: {
    columns: string[];
    data: (string | number)[][];
  } | null;
  isLoading: boolean;
}

const DataPreview: React.FC<DataPreviewProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <LoadingSpinner size={32} />
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.columns || !data.data || data.data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No data available. Please upload a CSV file.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Preview (First 5 Rows)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-vizNinja-lightGray">
                {data.columns.map((column, index) => (
                  <th 
                    key={index} 
                    className="border border-gray-200 px-4 py-2 text-left font-medium text-vizNinja-darkGray"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  {row.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className="border border-gray-200 px-4 py-2 text-sm"
                    >
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPreview;
