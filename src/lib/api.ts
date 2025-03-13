
import axios from 'axios';

// This would normally be an environment variable
const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData);
  return response.data;
};

export const getDataPreview = async () => {
  const response = await api.get('/preview');
  return response.data;
};

export const processData = async (option: string) => {
  const response = await api.post('/process', { option });
  return response.data;
};

export const getDataSummary = async () => {
  const response = await api.get('/summary');
  return response.data;
};

export const getVisualizations = async () => {
  const response = await api.get('/visualizations');
  return response.data;
};

export const downloadCleanedData = async () => {
  const response = await api.get('/download', {
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'cleaned_data.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// For development/demo purposes - mocked data
export const getMockDataPreview = () => {
  return {
    columns: ['id', 'name', 'age', 'city', 'salary'],
    data: [
      [1, 'John Doe', 32, 'New York', 85000],
      [2, 'Jane Smith', 28, 'San Francisco', 92000],
      [3, 'Robert Johnson', 45, 'Chicago', 120000],
      [4, 'Emily Williams', 36, 'Boston', 78000],
      [5, 'Michael Brown', 41, 'Seattle', 115000],
    ]
  };
};

export const getMockDataSummary = () => {
  return {
    shape: {rows: 100, columns: 5},
    missingValues: {
      name: 0,
      age: 3,
      city: 1,
      salary: 5
    },
    uniqueValues: {
      name: 100,
      age: 45,
      city: 25,
      salary: 98
    },
    dataTypes: {
      id: 'integer',
      name: 'string',
      age: 'integer',
      city: 'string',
      salary: 'integer'
    },
    statistics: {
      age: {mean: 38.5, median: 36, min: 22, max: 65, std: 9.8},
      salary: {mean: 95600, median: 92000, min: 45000, max: 150000, std: 25400}
    }
  };
};

export const getMockVisualizations = () => {
  return {
    heatmap: '/placeholder.svg',
    histogram: '/placeholder.svg',
    pairplot: '/placeholder.svg',
    boxplot: '/placeholder.svg',
  };
};
