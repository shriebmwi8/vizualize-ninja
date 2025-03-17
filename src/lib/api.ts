
// Mock data for frontend-only application

// Sample data for session
const mockSessionId = "123e4567-e89b-12d3-a456-426614174000";

// Initial file upload response data
const mockUploadResponse = {
  session_id: mockSessionId,
  stats: {
    rows: 150,
    columns: 5,
    column_names: ["Age", "Income", "Spending", "Savings", "Credit Score"],
    missing_values: {
      "Age": 2,
      "Income": 5,
      "Spending": 3,
      "Savings": 8,
      "Credit Score": 4
    },
    data_types: {
      "Age": "int64",
      "Income": "int64",
      "Spending": "int64",
      "Savings": "int64",
      "Credit Score": "int64"
    },
    sample_data: [
      {"Age": 34, "Income": 65000, "Spending": 48000, "Savings": 17000, "Credit Score": 720},
      {"Age": 29, "Income": 48000, "Spending": 40000, "Savings": 8000, "Credit Score": 680},
      {"Age": 45, "Income": 89000, "Spending": 60000, "Savings": 29000, "Credit Score": 790},
      {"Age": 38, "Income": 72000, "Spending": 52000, "Savings": 20000, "Credit Score": 750},
      {"Age": 52, "Income": 120000, "Spending": 85000, "Savings": 35000, "Credit Score": 820}
    ]
  },
  numeric_features: ["Age", "Income", "Spending", "Savings", "Credit Score"],
  categorical_features: []
};

// Sample data preview from uploaded file
const mockDataPreview = {
  columns: ["Age", "Income", "Spending", "Savings", "Credit Score"],
  data: [
    [34, 65000, 48000, 17000, 720],
    [29, 48000, 40000, 8000, 680],
    [45, 89000, 60000, 29000, 790],
    [38, 72000, 52000, 20000, 750],
    [52, 120000, 85000, 35000, 820]
  ]
};

// Mock data summary
const mockDataSummary = {
  shape: { rows: 150, columns: 5 },
  missingValues: {
    "Age": 2,
    "Income": 5,
    "Spending": 3,
    "Savings": 8,
    "Credit Score": 4
  },
  uniqueValues: {
    "Age": 42,
    "Income": 112,
    "Spending": 98,
    "Savings": 84,
    "Credit Score": 45
  },
  dataTypes: {
    "Age": "int64",
    "Income": "int64",
    "Spending": "int64",
    "Savings": "int64",
    "Credit Score": "int64"
  },
  statistics: {
    "Age": { mean: 37.5, median: 36.0, min: 22.0, max: 68.0, std: 10.2 },
    "Income": { mean: 72400, median: 68500, min: 32000, max: 150000, std: 25300 },
    "Spending": { mean: 55300, median: 52800, min: 28000, max: 120000, std: 18700 },
    "Savings": { mean: 17100, median: 15600, min: 0, max: 50000, std: 12400 },
    "Credit Score": { mean: 732, median: 740, min: 580, max: 850, std: 65 }
  }
};

// Mock preprocessing response
const mockPreprocessingResponse = {
  message: "Data preprocessing completed",
  rows_after_preprocessing: 148,
  visualizations: {
    correlation_heatmap: "https://via.placeholder.com/600x500?text=Correlation+Heatmap",
    histograms: "https://via.placeholder.com/600x500?text=Histograms",
    boxplots: "https://via.placeholder.com/600x500?text=Boxplots"
  }
};

// Mock visualization data
const mockVisualizations = {
  correlation_heatmap: "https://via.placeholder.com/600x500?text=Correlation+Heatmap",
  histograms: "https://via.placeholder.com/600x500?text=Histograms",
  boxplots: "https://via.placeholder.com/600x500?text=Boxplots"
};

// Mock regression results
const mockRegressionResults = {
  model_results: {
    mse: 4235.67,
    r2: 0.87,
    num_features: 4,
    num_samples: 150,
    test_size: 30
  },
  regression_plot: "https://via.placeholder.com/600x500?text=Regression+Results",
  feature_importance: {
    data: [
      { Feature: "Income", Importance: 0.65 },
      { Feature: "Age", Importance: 0.42 },
      { Feature: "Credit Score", Importance: 0.38 },
      { Feature: "Spending", Importance: 0.31 }
    ],
    image: "https://via.placeholder.com/600x500?text=Feature+Importance"
  }
};

// Mock implementation of uploadFile
export const uploadFile = async (file: File): Promise<any> => {
  return new Promise((resolve) => {
    // Simulate network request
    console.log('File uploaded:', file.name);
    setTimeout(() => {
      resolve(mockUploadResponse);
    }, 1500);
  });
};

// Mock implementation of getDataPreview
export const getDataPreview = async (): Promise<any> => {
  return new Promise((resolve) => {
    // Simulate network request
    setTimeout(() => {
      resolve(mockDataPreview);
    }, 1000);
  });
};

// Mock implementation of processData
export const processData = async (option: string): Promise<any> => {
  return new Promise((resolve) => {
    // Simulate network request
    console.log('Processing data with option:', option);
    setTimeout(() => {
      resolve(mockPreprocessingResponse);
    }, 2000);
  });
};

// Mock implementation of getDataSummary
export const getDataSummary = async (): Promise<any> => {
  return new Promise((resolve) => {
    // Simulate network request
    setTimeout(() => {
      resolve(mockDataSummary);
    }, 1500);
  });
};

// Mock implementation of getVisualizations
export const getVisualizations = async (): Promise<any> => {
  return new Promise((resolve) => {
    // Simulate network request
    setTimeout(() => {
      resolve(mockVisualizations);
    }, 1800);
  });
};

// Mock implementation of runRegression
export const runRegression = async (sessionId: string, targetVariable: string): Promise<any> => {
  return new Promise((resolve) => {
    // Simulate network request
    console.log(`Running regression with session ${sessionId} and target ${targetVariable}`);
    setTimeout(() => {
      resolve(mockRegressionResults);
    }, 2500);
  });
};

// Mock implementation of downloadCleanedData
export const downloadCleanedData = async (): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate download
    setTimeout(() => {
      console.log('Cleaned data downloaded');
      
      // Create a fake CSV file and trigger download
      const csvContent = "Age,Income,Spending,Savings,Credit Score\n34,65000,48000,17000,720\n29,48000,40000,8000,680";
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'cleaned_data.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      resolve();
    }, 1000);
  });
};

// Mock implementation of downloadReport
export const downloadReport = async (sessionId: string): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate download
    setTimeout(() => {
      console.log('Analysis report downloaded for session:', sessionId);
      
      // Create a fake HTML file and trigger download
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Data Analysis Report</title>
            <style>
                body { font-family: Arial, sans-serif; }
            </style>
        </head>
        <body>
            <h1>Data Analysis Report</h1>
            <p>Session ID: ${sessionId}</p>
            <p>This is a placeholder for a full HTML report</p>
        </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `analysis_report_${sessionId}.html`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      resolve();
    }, 1000);
  });
};

// Mock implementation of downloadResults
export const downloadResults = async (sessionId: string): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate download
    setTimeout(() => {
      console.log('Analysis results downloaded for session:', sessionId);
      
      // Create a fake text file (since we can't create a real ZIP in browser)
      const textContent = `This is a placeholder for the analysis results ZIP file.\nSession ID: ${sessionId}`;
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `analysis_results_${sessionId}.txt`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      resolve();
    }, 1000);
  });
};

// Mock implementation of downloadVisualization
export const downloadVisualization = async (visualizationType: string): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate download
    setTimeout(() => {
      console.log('Downloading visualization:', visualizationType);
      
      // Create a fake image download from the placeholder
      const imageUrl = mockVisualizations[visualizationType as keyof typeof mockVisualizations];
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', imageUrl);
      a.setAttribute('download', `${visualizationType}.png`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      resolve();
    }, 1000);
  });
};
