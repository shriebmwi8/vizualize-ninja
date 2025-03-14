
from flask import Flask, request, jsonify, send_file
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
import io
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Global variable to store the dataframe
global_df = None
cleaned_df = None

@app.route('/upload', methods=['POST'])
def upload_file():
    global global_df
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and file.filename.endswith('.csv'):
        try:
            # Save the file temporarily
            temp_path = 'temp_upload.csv'
            file.save(temp_path)
            
            # Read the CSV file
            global_df = pd.read_csv(temp_path)
            
            # Delete the temporary file
            os.remove(temp_path)
            
            # Return success response with preview data
            preview_data = {
                'columns': global_df.columns.tolist(),
                'data': global_df.head(5).values.tolist()
            }
            
            return jsonify({
                'message': 'File uploaded successfully',
                'preview': preview_data
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'File must be a CSV'}), 400

@app.route('/preview', methods=['GET'])
def get_preview():
    global global_df
    
    if global_df is None:
        return jsonify({'error': 'No data uploaded yet'}), 400
    
    preview_data = {
        'columns': global_df.columns.tolist(),
        'data': global_df.head(5).values.tolist()
    }
    
    return jsonify(preview_data), 200

@app.route('/process', methods=['POST'])
def process_data():
    global global_df, cleaned_df
    
    if global_df is None:
        return jsonify({'error': 'No data uploaded yet'}), 400
    
    # Make a copy of the dataframe to avoid modifying the original
    df = global_df.copy()
    
    # Get the preprocessing option from the request
    option = request.json.get('option', 'mean_mode')
    
    # Handle missing values based on user choice
    if option == 'mean_mode':
        # Fill numeric with mean and categorical with mode
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            df[col] = df[col].fillna(df[col].mean())
            
        categorical_cols = df.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if not df[col].empty and df[col].mode().size > 0:
                df[col] = df[col].fillna(df[col].mode()[0])
    
    elif option == 'median_mode':
        # Fill numeric with median and categorical with mode
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            df[col] = df[col].fillna(df[col].median())
            
        categorical_cols = df.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if not df[col].empty and df[col].mode().size > 0:
                df[col] = df[col].fillna(df[col].mode()[0])
    
    elif option == 'drop':
        # Drop rows with missing values
        df = df.dropna()
    
    # Remove duplicates
    df = df.drop_duplicates()
    
    # Standardize column names
    df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_', regex=True)
    
    # Store the cleaned dataframe
    cleaned_df = df
    
    # Generate visualizations
    generate_visualizations(df)
    
    return jsonify({'message': 'Data processed successfully'}), 200

def generate_visualizations(df):
    # Create a directory for visualizations if it doesn't exist
    if not os.path.exists('visualizations'):
        os.makedirs('visualizations')
    
    # Correlation Heatmap
    plt.figure(figsize=(10, 6))
    corr_matrix = df.select_dtypes(include=[np.number]).corr()
    sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt='.2f')
    plt.title('Correlation Heatmap')
    plt.tight_layout()
    plt.savefig('visualizations/heatmap.png')
    plt.close()
    
    # Histograms
    plt.figure(figsize=(10, 8))
    df.select_dtypes(include=[np.number]).hist(figsize=(10, 8), bins=20)
    plt.suptitle('Histograms of Numeric Columns')
    plt.tight_layout()
    plt.savefig('visualizations/histogram.png')
    plt.close()
    
    # Boxplot
    plt.figure(figsize=(10, 6))
    numeric_df = df.select_dtypes(include=[np.number])
    if not numeric_df.empty:
        sns.boxplot(data=numeric_df)
        plt.title('Boxplot for Outlier Detection')
        plt.xticks(rotation=90)
        plt.tight_layout()
        plt.savefig('visualizations/boxplot.png')
    plt.close()
    
    # Pairplot (if not too many columns)
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    if len(numeric_cols) >= 2 and len(numeric_cols) <= 10:
        try:
            sns.pairplot(df[numeric_cols])
            plt.savefig('visualizations/pairplot.png')
        except Exception as e:
            print(f"Error generating pairplot: {str(e)}")
    plt.close()

@app.route('/summary', methods=['GET'])
def get_summary():
    global global_df
    
    if global_df is None:
        return jsonify({'error': 'No data uploaded yet'}), 400
    
    df = global_df
    
    # Calculate missing values
    missing_values = df.isnull().sum().to_dict()
    
    # Count unique values for each column
    unique_values = {col: df[col].nunique() for col in df.columns}
    
    # Get data types
    data_types = {col: str(df[col].dtype) for col in df.columns}
    
    # Basic statistics for numeric columns
    stats = {}
    numeric_df = df.select_dtypes(include=[np.number])
    for col in numeric_df.columns:
        stats[col] = {
            'mean': float(numeric_df[col].mean()),
            'median': float(numeric_df[col].median()),
            'min': float(numeric_df[col].min()),
            'max': float(numeric_df[col].max()),
            'std': float(numeric_df[col].std())
        }
    
    summary = {
        'shape': {'rows': df.shape[0], 'columns': df.shape[1]},
        'missingValues': missing_values,
        'uniqueValues': unique_values,
        'dataTypes': data_types,
        'statistics': stats
    }
    
    return jsonify(summary), 200

@app.route('/visualizations', methods=['GET'])
def get_visualizations():
    # Check if visualizations directory exists
    if not os.path.exists('visualizations'):
        return jsonify({'error': 'No visualizations available yet'}), 400
    
    # Map of available visualizations
    vis_map = {}
    vis_types = ['heatmap', 'histogram', 'pairplot', 'boxplot']
    
    for vis_type in vis_types:
        file_path = f'visualizations/{vis_type}.png'
        if os.path.exists(file_path):
            vis_map[vis_type] = f'/download-visualization/{vis_type}'
    
    return jsonify(vis_map), 200

@app.route('/download', methods=['GET'])
def download_cleaned_data():
    global cleaned_df
    
    if cleaned_df is None:
        return jsonify({'error': 'No cleaned data available'}), 400
    
    # Create a BytesIO object
    csv_data = io.BytesIO()
    
    # Write the dataframe to the BytesIO object
    cleaned_df.to_csv(csv_data, index=False)
    
    # Seek to the beginning of the BytesIO object
    csv_data.seek(0)
    
    # Send the file
    return send_file(
        csv_data,
        mimetype='text/csv',
        as_attachment=True,
        download_name='cleaned_data.csv'
    )

@app.route('/download-visualization/<vis_type>', methods=['GET'])
def download_visualization(vis_type):
    file_path = f'visualizations/{vis_type}.png'
    
    if not os.path.exists(file_path):
        return jsonify({'error': f'Visualization {vis_type} not found'}), 404
    
    return send_file(
        file_path,
        mimetype='image/png',
        as_attachment=True,
        download_name=f'{vis_type}.png'
    )

# Fix issue with PreprocessingOptions.tsx component
@app.route('/process', methods=['POST'])
def handle_process():
    global global_df, cleaned_df
    
    if global_df is None:
        return jsonify({'error': 'No data uploaded yet'}), 400
    
    # Get the option from request
    data = request.json
    option = data.get('option')
    
    # Map frontend options to backend options
    option_map = {
        '1': 'mean_mode',
        '2': 'median_mode',
        '3': 'drop'
    }
    
    # Make a copy of the dataframe to avoid modifying the original
    df = global_df.copy()
    
    # Process based on mapped option
    actual_option = option_map.get(option, 'mean_mode')
    
    # Handle missing values based on user choice
    if actual_option == 'mean_mode':
        # Fill numeric with mean and categorical with mode
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            df[col] = df[col].fillna(df[col].mean())
            
        categorical_cols = df.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if not df[col].empty and df[col].mode().size > 0:
                df[col] = df[col].fillna(df[col].mode()[0])
    
    elif actual_option == 'median_mode':
        # Fill numeric with median and categorical with mode
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            df[col] = df[col].fillna(df[col].median())
            
        categorical_cols = df.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if not df[col].empty and df[col].mode().size > 0:
                df[col] = df[col].fillna(df[col].mode()[0])
    
    elif actual_option == 'drop':
        # Drop rows with missing values
        df = df.dropna()
    
    # Remove duplicates
    df = df.drop_duplicates()
    
    # Standardize column names
    df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_', regex=True)
    
    # Store the cleaned dataframe
    cleaned_df = df
    
    # Generate visualizations
    generate_visualizations(df)
    
    return jsonify({'message': 'Data processed successfully'}), 200

# Update the root route to handle health check
@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "API is running"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
