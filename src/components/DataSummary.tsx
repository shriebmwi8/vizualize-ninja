
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from './LoadingSpinner';

interface DataSummaryProps {
  summary: {
    shape: { rows: number; columns: number };
    missingValues: Record<string, number>;
    uniqueValues: Record<string, number>;
    dataTypes: Record<string, string>;
    statistics: Record<string, { mean: number; median: number; min: number; max: number; std: number }>;
  } | null;
  isLoading: boolean;
}

const DataSummary: React.FC<DataSummaryProps> = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dataset Summary</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <LoadingSpinner size={32} />
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dataset Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No summary available. Please process your data first.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Dataset Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="missing">Missing Values</TabsTrigger>
            <TabsTrigger value="unique">Unique Values</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-vizNinja-lightPurple rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Rows</h3>
                <p className="text-2xl font-bold text-vizNinja-purple">{summary.shape.rows}</p>
              </div>
              <div className="bg-vizNinja-lightTeal rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Columns</h3>
                <p className="text-2xl font-bold text-vizNinja-teal">{summary.shape.columns}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Data Types</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left">Column</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(summary.dataTypes).map(([column, type], index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-200 px-4 py-2">{column}</td>
                        <td className="border border-gray-200 px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            type === 'string' ? 'bg-blue-100 text-blue-800' : 
                            type === 'integer' ? 'bg-green-100 text-green-800' : 
                            type === 'float' ? 'bg-purple-100 text-purple-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="missing" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">Column</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Missing Values</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">% Missing</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(summary.missingValues).map(([column, count], index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 px-4 py-2">{column}</td>
                      <td className="border border-gray-200 px-4 py-2">{count}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        {((count / summary.shape.rows) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="unique" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">Column</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Unique Values</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">% Unique</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(summary.uniqueValues).map(([column, count], index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 px-4 py-2">{column}</td>
                      <td className="border border-gray-200 px-4 py-2">{count}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        {((count / summary.shape.rows) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">Column</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Mean</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Median</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Min</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Max</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Std</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(summary.statistics).map(([column, stats], index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 px-4 py-2">{column}</td>
                      <td className="border border-gray-200 px-4 py-2">{stats.mean.toFixed(2)}</td>
                      <td className="border border-gray-200 px-4 py-2">{stats.median.toFixed(2)}</td>
                      <td className="border border-gray-200 px-4 py-2">{stats.min.toFixed(2)}</td>
                      <td className="border border-gray-200 px-4 py-2">{stats.max.toFixed(2)}</td>
                      <td className="border border-gray-200 px-4 py-2">{stats.std.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataSummary;
