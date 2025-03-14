
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from './LoadingSpinner';
import { Database, AlertCircle, Fingerprint, BarChart } from 'lucide-react';

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
      <div className="w-full p-6">
        <div className="text-2xl font-semibold mb-4 text-center text-gray-700 flex items-center justify-center gap-2">
          <Database className="h-6 w-6 text-vizNinja-purple" />
          Dataset Summary
        </div>
        <div className="h-64 flex flex-col items-center justify-center">
          <LoadingSpinner size={48} />
          <p className="mt-4 text-gray-500">Loading dataset summary...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="w-full p-6">
        <div className="text-2xl font-semibold mb-4 text-center text-gray-700 flex items-center justify-center gap-2">
          <Database className="h-6 w-6 text-vizNinja-purple" />
          Dataset Summary
        </div>
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <Database className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl text-gray-500 mb-2">No summary available</p>
          <p className="text-gray-400">Please process your data first to see the summary</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="text-2xl font-semibold mb-6 text-center text-gray-700 flex items-center justify-center gap-2">
        <Database className="h-6 w-6 text-vizNinja-purple" />
        Dataset Summary
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 rounded-lg p-1 bg-gray-100">
          <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-vizNinja-purple data-[state=active]:shadow-sm">
            <Database className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="missing" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-vizNinja-purple data-[state=active]:shadow-sm">
            <AlertCircle className="mr-2 h-4 w-4" /> Missing Values
          </TabsTrigger>
          <TabsTrigger value="unique" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-vizNinja-purple data-[state=active]:shadow-sm">
            <Fingerprint className="mr-2 h-4 w-4" /> Unique Values
          </TabsTrigger>
          <TabsTrigger value="stats" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-vizNinja-purple data-[state=active]:shadow-sm">
            <BarChart className="mr-2 h-4 w-4" /> Statistics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-br from-vizNinja-lightPurple to-purple-100 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <Database className="mr-2 h-4 w-4 text-vizNinja-purple" /> 
                Total Rows
              </h3>
              <p className="text-3xl font-bold text-vizNinja-purple">{summary.shape.rows.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-vizNinja-lightTeal to-blue-100 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <Database className="mr-2 h-4 w-4 text-vizNinja-teal" /> 
                Total Columns
              </h3>
              <p className="text-3xl font-bold text-vizNinja-teal">{summary.shape.columns.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">Data Types</h3>
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-100 shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">Column</th>
                    <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(summary.dataTypes).map(([column, type], index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border-b border-gray-100 px-4 py-3 font-medium">{column}</td>
                      <td className="border-b border-gray-100 px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          type === 'string' ? 'bg-blue-100 text-blue-700' : 
                          type === 'integer' ? 'bg-green-100 text-green-700' : 
                          type === 'float' ? 'bg-purple-100 text-purple-700' : 
                          'bg-gray-100 text-gray-700'
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
        
        <TabsContent value="missing" className="mt-6">
          <div className="rounded-lg overflow-hidden border border-gray-100 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-red-50 to-orange-50">
                  <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">Column</th>
                  <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">Missing Values</th>
                  <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">% Missing</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary.missingValues).map(([column, count], index) => {
                  const percentage = ((count / summary.shape.rows) * 100);
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border-b border-gray-100 px-4 py-3 font-medium">{column}</td>
                      <td className="border-b border-gray-100 px-4 py-3">{count}</td>
                      <td className="border-b border-gray-100 px-4 py-3">
                        <div className="flex items-center">
                          <span className="mr-2">{percentage.toFixed(2)}%</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                percentage > 50 ? 'bg-red-500' : 
                                percentage > 20 ? 'bg-orange-500' : 
                                'bg-green-500'
                              }`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="unique" className="mt-6">
          <div className="rounded-lg overflow-hidden border border-gray-100 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-indigo-50">
                  <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">Column</th>
                  <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">Unique Values</th>
                  <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">% Unique</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary.uniqueValues).map(([column, count], index) => {
                  const percentage = ((count / summary.shape.rows) * 100);
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border-b border-gray-100 px-4 py-3 font-medium">{column}</td>
                      <td className="border-b border-gray-100 px-4 py-3">{count}</td>
                      <td className="border-b border-gray-100 px-4 py-3">
                        <div className="flex items-center">
                          <span className="mr-2">{percentage.toFixed(2)}%</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full bg-indigo-500" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-6">
          <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
            <table className="w-full border-collapse min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-teal-50">
                  <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">Column</th>
                  <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">Mean</th>
                  <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">Median</th>
                  <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">Min</th>
                  <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">Max</th>
                  <th className="border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">Std</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary.statistics).map(([column, stats], index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border-b border-gray-100 px-4 py-3 font-medium">{column}</td>
                    <td className="border-b border-gray-100 px-4 py-3">{stats.mean.toFixed(2)}</td>
                    <td className="border-b border-gray-100 px-4 py-3">{stats.median.toFixed(2)}</td>
                    <td className="border-b border-gray-100 px-4 py-3">{stats.min.toFixed(2)}</td>
                    <td className="border-b border-gray-100 px-4 py-3">{stats.max.toFixed(2)}</td>
                    <td className="border-b border-gray-100 px-4 py-3">{stats.std.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataSummary;
