
from flask import Flask, request, jsonify, send_file
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
import io
from flask_cors import CORS
import json
import uuid
from io import BytesIO
import base64
from sklearn.linear_model import LinearRegression
from sklearn import metrics

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# In-memory storage for session data
sessions = {}

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint for health check"""
    return jsonify({"status": "healthy"}), 200

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Endpoint for file upload"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and file.filename.endswith('.csv'):
        try:
            # Generate a session ID
            session_id = str(uuid.uuid4())
            
            # Read the CSV file
            df = pd.read_csv(file)
            
            # Store the dataframe in the session
            sessions[session_id] = {
                'original_df': df,
                'processed_df': None,
                'visualizations': {}
            }
            
            # Get basic stats
            stats = {
                'rows': df.shape[0],
                'columns': df.shape[1],
                'column_names': df.columns.tolist(),
                'missing_values': df.isnull().sum().to_dict(),
                'data_types': {col: str(df[col].dtype) for col in df.columns},
                'sample_data': df.head(5).to_dict('records')
            }
            
            # Identify numeric and categorical features
            numeric_features = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
            categorical_features = df.select_dtypes(include=['object']).columns.tolist()
            
            return jsonify({
                'session_id': session_id,
                'stats': stats,
                'numeric_features': numeric_features,
                'categorical_features': categorical_features
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'File must be a CSV'}), 400

@app.route('/api/preprocess', methods=['POST'])
def preprocess_data():
    """Endpoint for data preprocessing"""
    data = request.json
    session_id = data.get('session_id')
    missing_value_strategy = data.get('missing_value_strategy', 1)
    
    if not session_id or session_id not in sessions:
        return jsonify({'error': 'Invalid session ID'}), 400
    
    try:
        # Get the original dataframe
        df = sessions[session_id]['original_df'].copy()
        
        # Handle missing values based on strategy
        if missing_value_strategy == 1:  # mean/mode
            # Fill numeric with mean
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            for col in numeric_cols:
                df[col] = df[col].fillna(df[col].mean())
            
            # Fill categorical with mode
            cat_cols = df.select_dtypes(include=['object']).columns
            for col in cat_cols:
                if not df[col].empty and df[col].mode().size > 0:
                    df[col] = df[col].fillna(df[col].mode()[0])
                    
        elif missing_value_strategy == 2:  # median/mode
            # Fill numeric with median
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            for col in numeric_cols:
                df[col] = df[col].fillna(df[col].median())
            
            # Fill categorical with mode
            cat_cols = df.select_dtypes(include=['object']).columns
            for col in cat_cols:
                if not df[col].empty and df[col].mode().size > 0:
                    df[col] = df[col].fillna(df[col].mode()[0])
                    
        elif missing_value_strategy == 3:  # drop rows
            df = df.dropna()
        
        # Store the processed dataframe
        sessions[session_id]['processed_df'] = df
        
        # Generate visualizations
        visualizations = generate_visualizations(df)
        sessions[session_id]['visualizations'] = visualizations
        
        return jsonify({
            'message': 'Data processed successfully',
            'visualizations': visualizations
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_visualizations(df):
    """Generate visualization images and return as base64 strings"""
    visualizations = {}
    
    # Correlation Heatmap
    try:
        plt.figure(figsize=(10, 8))
        corr_matrix = df.select_dtypes(include=[np.number]).corr()
        sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt='.2f')
        plt.title('Correlation Heatmap')
        plt.tight_layout()
        
        buf = BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        img_str = base64.b64encode(buf.read()).decode('utf-8')
        visualizations['correlation_heatmap'] = img_str
        plt.close()
    except Exception as e:
        print(f"Error generating correlation heatmap: {str(e)}")
    
    # Histograms
    try:
        plt.figure(figsize=(12, 10))
        df.select_dtypes(include=[np.number]).hist(figsize=(12, 10), bins=20)
        plt.suptitle('Histograms of Numeric Columns')
        plt.tight_layout()
        
        buf = BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        img_str = base64.b64encode(buf.read()).decode('utf-8')
        visualizations['histograms'] = img_str
        plt.close()
    except Exception as e:
        print(f"Error generating histograms: {str(e)}")
    
    # Boxplots
    try:
        plt.figure(figsize=(12, 8))
        numeric_df = df.select_dtypes(include=[np.number])
        if not numeric_df.empty:
            sns.boxplot(data=numeric_df)
            plt.title('Boxplot for Outlier Detection')
            plt.xticks(rotation=90)
            plt.tight_layout()
            
            buf = BytesIO()
            plt.savefig(buf, format='png')
            buf.seek(0)
            img_str = base64.b64encode(buf.read()).decode('utf-8')
            visualizations['boxplots'] = img_str
        plt.close()
    except Exception as e:
        print(f"Error generating boxplots: {str(e)}")
    
    # Pairplot (if not too many columns)
    try:
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if 2 <= len(numeric_cols) <= 5:  # Limit to 5 columns to avoid huge plots
            plt.figure(figsize=(10, 8))
            sns.pairplot(df[numeric_cols])
            
            buf = BytesIO()
            plt.savefig(buf, format='png')
            buf.seek(0)
            img_str = base64.b64encode(buf.read()).decode('utf-8')
            visualizations['pairplot'] = img_str
            plt.close()
    except Exception as e:
        print(f"Error generating pairplot: {str(e)}")
    
    return visualizations

@app.route('/api/run_regression', methods=['POST'])
def run_regression():
    """Run linear regression analysis"""
    data = request.json
    session_id = data.get('session_id')
    target_variable = data.get('target_variable')
    
    if not session_id or session_id not in sessions:
        return jsonify({'error': 'Invalid session ID'}), 400
    
    if not target_variable:
        return jsonify({'error': 'Target variable not specified'}), 400
    
    try:
        # Get the processed dataframe or original if not processed
        df = sessions[session_id].get('processed_df', sessions[session_id]['original_df']).copy()
        
        # Check if target variable exists
        if target_variable not in df.columns:
            return jsonify({'error': f'Target variable {target_variable} not found in dataset'}), 400
        
        # Remove non-numeric columns for regression
        numeric_df = df.select_dtypes(include=[np.number])
        
        if target_variable not in numeric_df.columns:
            return jsonify({'error': f'Target variable {target_variable} must be numeric'}), 400
        
        # Features and target
        X = numeric_df.drop(target_variable, axis=1)
        y = numeric_df[target_variable]
        
        # Feature names
        feature_names = X.columns.tolist()
        
        # Linear regression model
        model = LinearRegression()
        model.fit(X, y)
        
        # Predictions
        y_pred = model.predict(X)
        
        # Model metrics
        mse = metrics.mean_squared_error(y, y_pred)
        r2 = metrics.r2_score(y, y_pred)
        
        # Coefficients and intercept
        coefficients = {feature: float(coef) for feature, coef in zip(feature_names, model.coef_)}
        
        # Feature importance (absolute values of coefficients)
        importance = {feature: abs(float(coef)) for feature, coef in zip(feature_names, model.coef_)}
        sorted_importance = sorted(importance.items(), key=lambda x: x[1], reverse=True)
        
        # Create feature importance visualization
        plt.figure(figsize=(10, 6))
        features = [item[0] for item in sorted_importance]
        values = [item[1] for item in sorted_importance]
        
        plt.barh(features, values)
        plt.xlabel('Importance (|Coefficient|)')
        plt.ylabel('Feature')
        plt.title('Feature Importance')
        plt.tight_layout()
        
        buf = BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        feature_importance_img = base64.b64encode(buf.read()).decode('utf-8')
        plt.close()
        
        # Create regression plot
        plt.figure(figsize=(10, 6))
        plt.scatter(y, y_pred, alpha=0.5)
        
        # Draw the perfect prediction line
        min_val = min(min(y), min(y_pred))
        max_val = max(max(y), max(y_pred))
        plt.plot([min_val, max_val], [min_val, max_val], 'r--')
        
        plt.xlabel(f'Actual {target_variable}')
        plt.ylabel(f'Predicted {target_variable}')
        plt.title('Actual vs Predicted Values')
        plt.tight_layout()
        
        buf = BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        regression_plot_img = base64.b64encode(buf.read()).decode('utf-8')
        plt.close()
        
        # Save regression results in session
        sessions[session_id]['regression_results'] = {
            'target_variable': target_variable,
            'mse': mse,
            'r2': r2,
            'coefficients': coefficients,
            'feature_importance': sorted_importance
        }
        
        return jsonify({
            'model_results': {
                'mse': float(mse),
                'r2': float(r2),
                'coefficients': coefficients,
                'intercept': float(model.intercept_)
            },
            'feature_importance': {
                'data': sorted_importance,
                'image': feature_importance_img
            },
            'regression_plot': regression_plot_img
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/<session_id>', methods=['GET'])
def download_data(session_id):
    """Download the processed data as CSV"""
    if not session_id or session_id not in sessions:
        return jsonify({'error': 'Invalid session ID'}), 400
    
    # Get the download type from query parameter
    download_type = request.args.get('type', 'data')
    
    try:
        if download_type == 'data':
            # Get the processed dataframe or original if not processed
            df = sessions[session_id].get('processed_df', sessions[session_id]['original_df'])
            
            # Create a BytesIO object
            csv_data = BytesIO()
            
            # Write the dataframe to the BytesIO object
            df.to_csv(csv_data, index=False)
            
            # Seek to the beginning of the BytesIO object
            csv_data.seek(0)
            
            # Send the file
            return send_file(
                csv_data,
                mimetype='text/csv',
                as_attachment=True,
                download_name='processed_data.csv'
            )
        elif download_type == 'results':
            # Check if regression results exist
            if 'regression_results' not in sessions[session_id]:
                return jsonify({'error': 'No regression results found for this session'}), 400
            
            # Get regression results
            results = sessions[session_id]['regression_results']
            
            # Convert to JSON
            json_data = BytesIO()
            json_data.write(json.dumps(results, indent=2).encode())
            json_data.seek(0)
            
            # Send the file
            return send_file(
                json_data,
                mimetype='application/json',
                as_attachment=True,
                download_name='regression_results.json'
            )
        else:
            return jsonify({'error': 'Invalid download type'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate_report/<session_id>', methods=['GET'])
def generate_report(session_id):
    """Generate and download a report"""
    if not session_id or session_id not in sessions:
        return jsonify({'error': 'Invalid session ID'}), 400
    
    try:
        session_data = sessions[session_id]
        df = session_data.get('processed_df', session_data['original_df'])
        
        # Generate a simple text report
        report = BytesIO()
        
        report_content = [
            "DATA ANALYSIS REPORT",
            "===================="
        ]
        
        # Dataset information
        report_content.extend([
            "\nDATASET INFORMATION",
            f"Number of rows: {df.shape[0]}",
            f"Number of columns: {df.shape[1]}",
            f"Columns: {', '.join(df.columns.tolist())}"
        ])
        
        # Missing values
        missing_values = df.isnull().sum()
        missing_values = missing_values[missing_values > 0]
        if not missing_values.empty:
            report_content.extend([
                "\nMISSING VALUES",
                "\n".join([f"{col}: {val}" for col, val in missing_values.items()])
            ])
        else:
            report_content.append("\nMISSING VALUES: None")
        
        # Numeric statistics
        report_content.append("\nNUMERIC STATISTICS")
        for col in df.select_dtypes(include=[np.number]).columns:
            report_content.extend([
                f"\n{col}:",
                f"  Min: {df[col].min()}",
                f"  Max: {df[col].max()}",
                f"  Mean: {df[col].mean()}",
                f"  Median: {df[col].median()}",
                f"  Std Dev: {df[col].std()}"
            ])
        
        # Regression results if available
        if 'regression_results' in session_data:
            reg_results = session_data['regression_results']
            report_content.extend([
                "\nREGRESSION ANALYSIS",
                f"Target Variable: {reg_results['target_variable']}",
                f"R² Score: {reg_results.get('r2', 'N/A')}",
                f"Mean Squared Error: {reg_results.get('mse', 'N/A')}",
                "\nFeature Importance:",
                "\n".join([f"  {feature}: {importance}" for feature, importance in reg_results.get('feature_importance', [])])
            ])
        
        # Write the report content
        report.write("\n".join(report_content).encode())
        report.seek(0)
        
        # Send the file
        return send_file(
            report,
            mimetype='text/plain',
            as_attachment=True,
            download_name='data_analysis_report.txt'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Default route
@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "API is running"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
