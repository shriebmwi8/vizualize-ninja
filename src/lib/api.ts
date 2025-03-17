
import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = 'http://localhost:5000/api';

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
    
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Get data preview
export const getDataPreview = async (): Promise<any> => {
  try {
    // For this function, we'll rely on the sample_data returned from the upload endpoint
    // Assuming the sessionId is stored in localStorage after upload
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    // Create a structure matching what the frontend expects
    return {
      columns: JSON.parse(localStorage.getItem('columnNames') || '[]'),
      data: JSON.parse(localStorage.getItem('sampleData') || '[]')
    };
  } catch (error) {
    console.error('Error getting data preview:', error);
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
    
    return response.data;
  } catch (error) {
    console.error('Error processing data:', error);
    throw error;
  }
};

// Get data summary
export const getDataSummary = async (): Promise<any> => {
  try {
    // Since there's no direct endpoint for data summary in the backend,
    // we'll use the data stored in localStorage from the upload response
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw new Error('No session ID found. Please upload a file first.');
    }
    
    const stats = JSON.parse(localStorage.getItem('stats') || '{}');
    
    // Transform the data to match the frontend's expected format
    return {
      shape: { rows: stats.rows || 0, columns: stats.columns || 0 },
      missingValues: stats.missing_values || {},
      uniqueValues: {}, // This data isn't provided by the backend
      dataTypes: stats.data_types || {},
      statistics: {} // This data isn't provided directly by the backend
    };
  } catch (error) {
    console.error('Error getting data summary:', error);
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
      boxplots: `data:image/png;base64,${visualizations.boxplots}`
    };
  } catch (error) {
    console.error('Error getting visualizations:', error);
    throw error;
  }
};

// Run regression
export const runRegression = async (sessionId: string, targetVariable: string): Promise<any> => {
  try {
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
    throw error;
  }
};

// Download report
export const downloadReport = async (sessionId: string): Promise<void> => {
  try {
    window.open(`${API_BASE_URL}/generate_report/${sessionId}`, '_blank');
  } catch (error) {
    console.error('Error downloading report:', error);
    throw error;
  }
};

// Download results
export const downloadResults = async (sessionId: string): Promise<void> => {
  try {
    window.open(`${API_BASE_URL}/download/${sessionId}?type=results`, '_blank');
  } catch (error) {
    console.error('Error downloading results:', error);
    throw error;
  }
};

// Download visualization - not directly supported by backend
export const downloadVisualization = async (visualizationType: string): Promise<void> => {
  try {
    const visualizations = JSON.parse(localStorage.getItem('visualizations') || '{}');
    const base64Data = visualizations[visualizationType];
    
    if (!base64Data) {
      throw new Error(`Visualization ${visualizationType} not found`);
    }
    
    // Create a link to download the base64 image
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Data}`;
    link.download = `${visualizationType}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading visualization:', error);
    throw error;
  }
};

// Update FileUpload.tsx to save session data to localStorage
export const updateLocalStorage = (data: any) => {
  localStorage.setItem('sessionId', data.session_id);
  localStorage.setItem('stats', JSON.stringify(data.stats));
  localStorage.setItem('columnNames', JSON.stringify(data.stats.column_names));
  localStorage.setItem('sampleData', JSON.stringify(data.stats.sample_data));
  localStorage.setItem('numericFeatures', JSON.stringify(data.numeric_features));
  localStorage.setItem('categoricalFeatures', JSON.stringify(data.categorical_features));
};

// Update for after data processing to save visualizations
export const updateVisualizationsStorage = (data: any) => {
  localStorage.setItem('visualizations', JSON.stringify(data.visualizations));
};
