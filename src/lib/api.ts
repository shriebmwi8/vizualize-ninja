
import axios from 'axios';
import { toast } from 'sonner';

// Base URL for the backend API - Make sure this matches your backend server
const API_BASE_URL = 'http://localhost:5000/api';

// Check server connection
export const checkServerConnection = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error('Backend server connection failed:', error);
    return false;
  }
};

// Upload file to backend
export const uploadFile = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Save session data to localStorage
    updateLocalStorage(response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    handleApiError(error, 'Error uploading file');
    throw error;
  }
};

// Get data preview
export const getDataPreview = async (): Promise<any> => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    // In this implementation, we're using the sample_data saved in localStorage
    // from the upload response since there's no direct preview endpoint
    return {
      columns: JSON.parse(localStorage.getItem('columnNames') || '[]'),
      data: JSON.parse(localStorage.getItem('sampleData') || '[]')
    };
  } catch (error) {
    console.error('Error getting data preview:', error);
    handleApiError(error, 'Error getting data preview');
    throw error;
  }
};

// Process data
export const processData = async (option: string): Promise<any> => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    // Convert string option to numeric as expected by backend
    let missingValueStrategy;
    switch (option) {
      case '1': missingValueStrategy = 1; break; // mean/mode
      case '2': missingValueStrategy = 2; break; // median/mode
      case '3': missingValueStrategy = 3; break; // drop rows
      default: missingValueStrategy = 1;
    }
    
    const response = await axios.post(`${API_BASE_URL}/preprocess`, {
      session_id: sessionId,
      missing_value_strategy: missingValueStrategy
    });
    
    // Save visualizations data to localStorage
    if (response.data.visualizations) {
      updateVisualizationsStorage(response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error processing data:', error);
    handleApiError(error, 'Error processing data');
    throw error;
  }
};

// Get data summary - This is a simplified version since there's no direct endpoint
export const getDataSummary = async (): Promise<any> => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    const stats = JSON.parse(localStorage.getItem('stats') || '{}');
    
    return {
      shape: { rows: stats.rows || 0, columns: stats.columns || 0 },
      missingValues: stats.missing_values || {},
      uniqueValues: {}, // This data isn't provided by the backend
      dataTypes: stats.data_types || {},
      statistics: {} // This data isn't provided directly by the backend
    };
  } catch (error) {
    console.error('Error getting data summary:', error);
    handleApiError(error, 'Error getting data summary');
    throw error;
  }
};

// Get visualizations
export const getVisualizations = async (): Promise<any> => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    // Use the visualizations data returned from processData
    const visualizations = JSON.parse(localStorage.getItem('visualizations') || '{}');
    
    // Transform from base64 to URLs
    return {
      correlation_heatmap: `data:image/png;base64,${visualizations.correlation_heatmap}`,
      histograms: `data:image/png;base64,${visualizations.histograms}`,
      boxplot: `data:image/png;base64,${visualizations.boxplots}`,
      pairplot: `data:image/png;base64,${visualizations.pairplot || ''}` // Added for compatibility
    };
  } catch (error) {
    console.error('Error getting visualizations:', error);
    handleApiError(error, 'Error getting visualizations');
    throw error;
  }
};

// Run regression
export const runRegression = async (targetVariable: string): Promise<any> => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    const response = await axios.post(`${API_BASE_URL}/run_regression`, {
      session_id: sessionId,
      target_variable: targetVariable
    });
    
    const data = response.data;
    
    // Transform base64 images to URL format expected by frontend
    return {
      model_results: data.model_results,
      regression_plot: `data:image/png;base64,${data.regression_plot}`,
      feature_importance: data.feature_importance ? {
        data: data.feature_importance.data,
        image: `data:image/png;base64,${data.feature_importance.image}`
      } : null
    };
  } catch (error) {
    console.error('Error running regression:', error);
    handleApiError(error, 'Error running regression analysis');
    throw error;
  }
};

// Download cleaned data
export const downloadCleanedData = async (): Promise<void> => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    window.open(`${API_BASE_URL}/download/${sessionId}?type=data`, '_blank');
  } catch (error) {
    console.error('Error downloading cleaned data:', error);
    handleApiError(error, 'Error downloading cleaned data');
    throw error;
  }
};

// Download report
export const downloadReport = async (): Promise<void> => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    window.open(`${API_BASE_URL}/generate_report/${sessionId}`, '_blank');
  } catch (error) {
    console.error('Error downloading report:', error);
    handleApiError(error, 'Error downloading report');
    throw error;
  }
};

// Download results
export const downloadResults = async (): Promise<void> => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    window.open(`${API_BASE_URL}/download/${sessionId}?type=results`, '_blank');
  } catch (error) {
    console.error('Error downloading results:', error);
    handleApiError(error, 'Error downloading results');
    throw error;
  }
};

// Download visualization
export const downloadVisualization = async (visualizationType: string): Promise<void> => {
  try {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    // The backend doesn't have a direct endpoint for individual visualization downloads,
    // so we'll use a workaround to get the image from localStorage and download it
    const visualizations = JSON.parse(localStorage.getItem('visualizations') || '{}');
    const base64Data = visualizations[visualizationType];
    
    if (!base64Data) {
      throw new Error(`Visualization ${visualizationType} not found`);
    }
    
    // Create a download link for the image
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = `${visualizationType}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading visualization:', error);
    handleApiError(error, 'Error downloading visualization');
    throw error;
  }
};

// Helper function to handle API errors
const handleApiError = (error: any, defaultMessage: string) => {
  let errorMessage = defaultMessage;
  
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      errorMessage = 'Cannot connect to the backend server. Please ensure the server is running.';
    } else if (error.response) {
      // Server responded with an error
      const serverMessage = error.response.data?.error || error.response.data?.message;
      if (serverMessage) {
        errorMessage = `Server error: ${serverMessage}`;
      } else {
        errorMessage = `Server error (${error.response.status})`;
      }
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  toast.error(errorMessage);
};

// Update localStorage with session data
export const updateLocalStorage = (data: any) => {
  localStorage.setItem('sessionId', data.session_id);
  localStorage.setItem('stats', JSON.stringify(data.stats));
  localStorage.setItem('columnNames', JSON.stringify(data.stats.column_names));
  localStorage.setItem('sampleData', JSON.stringify(data.stats.sample_data));
  localStorage.setItem('numericFeatures', JSON.stringify(data.numeric_features));
  localStorage.setItem('categoricalFeatures', JSON.stringify(data.categorical_features));
};

// Update localStorage with visualizations data
export const updateVisualizationsStorage = (data: any) => {
  localStorage.setItem('visualizations', JSON.stringify(data.visualizations));
};
