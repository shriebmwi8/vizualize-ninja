
import axios from 'axios';

// Configure axios base URL to point to the Flask backend
const api = axios.create({
  baseURL: 'http://localhost:5000',
  // Allow the browser to include credentials in cross-origin requests
  withCredentials: false,
  // Allow absolute URLs in axios requests
  allowAbsoluteUrls: true
});

// Upload a CSV file to the server
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get a preview of the uploaded data
export const getDataPreview = async () => {
  const response = await api.get('/preview');
  return response.data;
};

// Process the data with the selected option
export const processData = async (option: string) => {
  const response = await api.post('/process', { option });
  return response.data;
};

// Get summary statistics for the data
export const getDataSummary = async () => {
  const response = await api.get('/summary');
  return response.data;
};

// Get links to generated visualizations
export const getVisualizations = async () => {
  const response = await api.get('/visualizations');
  return response.data;
};

// Download the cleaned data
export const downloadCleanedData = () => {
  window.open(`${api.defaults.baseURL}/download`, '_blank');
};

// Download a specific visualization
export const downloadVisualization = (visType: string) => {
  window.open(`${api.defaults.baseURL}/download-visualization/${visType}`, '_blank');
};

export default api;
