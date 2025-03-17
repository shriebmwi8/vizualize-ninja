
// Mock data for frontend-only application

// Sample data preview
const mockDataPreview = {
  columns: ["Age", "Income", "Spending", "Savings", "Credit Score"],
  data: [
    [34, 65000, 48000, 17000, 720],
    [29, 48000, 40000, 8000, 680],
    [45, 89000, 60000, 29000, 790],
    [38, 72000, 52000, 20000, 750],
    [52, 120000, 85000, 35000, 820],
    [27, 45000, 42000, 3000, 670],
    [33, 68000, 50000, 18000, 730],
    [41, 78000, 56000, 22000, 760]
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
    "Age": "integer",
    "Income": "integer",
    "Spending": "integer",
    "Savings": "integer",
    "Credit Score": "integer"
  },
  statistics: {
    "Age": { mean: 37.5, median: 36.0, min: 22.0, max: 68.0, std: 10.2 },
    "Income": { mean: 72400, median: 68500, min: 32000, max: 150000, std: 25300 },
    "Spending": { mean: 55300, median: 52800, min: 28000, max: 120000, std: 18700 },
    "Savings": { mean: 17100, median: 15600, min: 0, max: 50000, std: 12400 },
    "Credit Score": { mean: 732, median: 740, min: 580, max: 850, std: 65 }
  }
};

// Mock visualizations with placeholder images
const mockVisualizations = {
  correlation_heatmap: "https://via.placeholder.com/600x500?text=Correlation+Heatmap",
  histograms: "https://via.placeholder.com/600x500?text=Histograms",
  pairplot: "https://via.placeholder.com/600x500?text=Pairplot",
  boxplot: "https://via.placeholder.com/600x500?text=Boxplot"
};

// Mock implementation of uploadFile
export const uploadFile = async (file: File): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate network request
    setTimeout(() => {
      console.log('File uploaded:', file.name);
      resolve();
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
export const processData = async (option: string): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate network request
    setTimeout(() => {
      console.log('Processing data with option:', option);
      resolve();
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
