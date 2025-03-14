
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from './LoadingSpinner';
import { Table } from 'lucide-react';

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
      <Card className="w-full border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center text-gray-800">
            <Table className="mr-2 h-5 w-5 text-vizNinja-purple" />
            Data Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <LoadingSpinner size={36} />
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.columns || !data.data || data.data.length === 0) {
    return (
      <Card className="w-full border-0 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center text-gray-800">
            <Table className="mr-2 h-5 w-5 text-vizNinja-purple" />
            Data Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <Table className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No data available</p>
            <p className="text-sm">Please upload a CSV file to see a preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center text-gray-800">
          <Table className="mr-2 h-5 w-5 text-vizNinja-purple" />
          Data Preview (First {data.data.length} Rows)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-vizNinja-lightPurple to-vizNinja-lightTeal">
                {data.columns.map((column, index) => (
                  <th 
                    key={index} 
                    className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700"
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
                  className={`
                    ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} 
                    hover:bg-blue-50 transition-colors
                  `}
                >
                  {row.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700"
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
