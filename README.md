
# Data Visualization & Exploration Tool

This application allows you to upload CSV files, clean your data, generate visualizations, and download the processed data.

## Setup Instructions

### Backend (Flask)

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the Flask backend:
   ```
   python app.py
   ```
   The backend will run on http://localhost:5000

### Frontend (React)

1. Install the required dependencies:
   ```
   npm install
   ```

2. Run the React frontend:
   ```
   npm run dev
   ```
   The frontend will run on http://localhost:5173

## How to Use

1. Upload a CSV file using the upload interface.
2. Preview your data in the table.
3. Choose a preprocessing option to handle missing values.
4. Explore the data summary and visualizations generated.
5. Download the cleaned dataset or any of the visualizations.

## API Endpoints

- `POST /upload`: Upload a CSV file
- `GET /preview`: Get a preview of the uploaded data
- `POST /process`: Process the data with selected preprocessing option
- `GET /summary`: Get summary statistics of the data
- `GET /visualizations`: Get links to generated visualizations
- `GET /download`: Download the cleaned dataset
- `GET /download-visualization/<vis_type>`: Download a specific visualization
