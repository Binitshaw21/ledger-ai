import pandas as pd  # type: ignore
import numpy as np  # type: ignore
import json
import warnings
import matplotlib.pyplot as plt  # type: ignore
import seaborn as sns  # type: ignore
import base64
from io import BytesIO

# Suppress pandas SettingWithCopyWarning for cleaner console output
warnings.filterwarnings('ignore')

def run_audit_engine(csv_path):
    print(f"Loading enterprise ledger data from {csv_path}...")
    df = pd.read_csv(csv_path)

    # =========================================================
    # STEP 1: CLEANING & INGESTION
    # =========================================================
    df['transaction_date'] = pd.to_datetime(df['transaction_date'])
    df['missing_receipt'] = df['receipt_id'].isna()

    # =========================================================
    # STEP 2: FEATURE ENGINEERING (Vectorized Math)
    # =========================================================
    print("Calculating historical vendor statistics via NumPy...")
    vendor_stats = df.groupby('vendor_id')['amount'].agg(['mean', 'std']).reset_index()
    vendor_stats['std'] = vendor_stats['std'].fillna(0)
    df = df.merge(vendor_stats, on='vendor_id', how='left')

    # Calculate Z-Score: (Amount - Mean) / Standard Deviation
    df['z_score'] = np.where(
        df['std'] > 0,
        (df['amount'] - df['mean']) / df['std'],
        0
    )

    # =========================================================
    # STEP 3: APPLY AUDIT HEURISTICS (Business Rules)
    # =========================================================
    print("Applying corporate compliance heuristics...")

    # Rule 1: High Statistical Deviation (Z-score > 3)
    df['flag_statistical_outlier'] = df['z_score'] > 3.0

    # Rule 2: The "Split Invoice" Trick
    subset_cols = ['employee_id', 'vendor_id', 'transaction_date']
    df['is_duplicate_context'] = df.duplicated(subset=subset_cols, keep=False)
    
    df['flag_potential_split'] = (
        (df['amount'] >= 450) & (df['amount'] < 500) & 
        df['is_duplicate_context']
    )

    # Rule 3: Missing receipt on a large purchase
    df['flag_missing_documentation'] = (df['amount'] > 1000) & (df['missing_receipt'])

    # Create master anomaly flag
    flag_columns = ['flag_statistical_outlier', 'flag_potential_split', 'flag_missing_documentation']
    df['is_anomalous'] = df[flag_columns].any(axis=1)

    # =========================================================
    # STEP 4: DATA VISUALIZATION (Seaborn & Matplotlib)
    # =========================================================
    print("Generating Anomaly Cluster Visualizations...")
    
    # Set up a dark theme to match your React/HTML frontend
    plt.figure(figsize=(12, 6), facecolor='#050510')
    ax = plt.gca()
    ax.set_facecolor('#0a0a1a')
    ax.tick_params(colors='white')
    for spine in ax.spines.values():
        spine.set_color('#11112b')

    # Plot the data
    sns.scatterplot(
        data=df, 
        x='transaction_date', 
        y='amount', 
        hue='is_anomalous', 
        palette={True: '#ff2a2a', False: '#00f0ff'}, # Cyber Red for Fraud, Cyber Blue for Normal
        alpha=0.6,
        edgecolor=None
    )
    
    plt.title('Enterprise Ledger Anomaly Clusters', color='white', pad=20, fontsize=14, fontweight='bold')
    plt.xlabel('Transaction Date', color='gray')
    plt.ylabel('Transaction Amount (USD)', color='gray')
    
    # Style the legend
    legend = plt.legend(title='Anomaly Detected', facecolor='#0a0a1a', edgecolor='#00f0ff', labelcolor='white')
    legend.get_title().set_color('white')

    # Save the physical image file so you can view it
    plt.savefig('anomaly_cluster.png', bbox_inches='tight', facecolor='#050510')
    print("Saved visualization to 'anomaly_cluster.png'")

    # Encode the image to Base64 (For future direct API injection to the frontend)
    buffer = BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight', facecolor='#050510')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

    # =========================================================
    # STEP 5: FILTER AND EXPORT TO AI AGENT
    # =========================================================
    anomalies = df[df['is_anomalous']].copy()
    num_anomalies = len(anomalies)
    
    print(f"Audit complete. Scanned {len(df)} rows. Found {num_anomalies} high-risk transactions.")

    cols_to_keep = [
        'transaction_id', 'employee_id', 'vendor_name', 'transaction_date',
        'amount', 'receipt_id', 'flag_statistical_outlier',
        'flag_potential_split', 'flag_missing_documentation'
    ]
    final_output = anomalies[cols_to_keep]
    final_output['transaction_date'] = final_output['transaction_date'].dt.strftime('%Y-%m-%d')

    output_file = 'flagged_anomalies.json'
    final_output.to_json(output_file, orient='records', indent=4)
    print(f"Anomalies saved to {output_file}. Ready for Llama-3 XAI Review!")

    return final_output, image_base64

if __name__ == "__main__":
    # Ensure you generated 'mock_ledger.csv' prior to running this
    run_audit_engine("mock_ledger.csv")