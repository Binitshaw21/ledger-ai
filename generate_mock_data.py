import csv
import random
from datetime import datetime, timedelta

def create_mock_ledger():
    print("Initializing Data Generation...")
    
    # Setup our mock companies and employees
    vendors = ['V_001_Uber', 'V_002_DeltaAirlines', 'V_003_AWS', 'V_004_Staples', 'V_005_WeWork']
    vendor_ids = {v: v.split('_')[1] for v in vendors}
    
    data = []
    start_date = datetime(2023, 1, 1)
    
    print("Generating 9,900 standard, boring transactions...")
    for i in range(9900):
        v_name = random.choice(vendors)
        v_id = vendor_ids[v_name]
        emp_id = f"EMP_{random.randint(100, 150)}"
        
        # Pick a random date in the year
        days_offset = random.randint(0, 365)
        t_date = start_date + timedelta(days=days_offset)
        
        # Generate normal spending amounts based on the vendor
        if 'AWS' in v_name:
            amount = round(random.uniform(500, 2000), 2)
        elif 'Uber' in v_name:
            amount = round(random.uniform(15, 80), 2)
        else:
            amount = round(random.uniform(50, 400), 2)
            
        data.append({
            'transaction_id': f"TXN_{100000+i}",
            'employee_id': emp_id,
            'vendor_id': v_id,
            'vendor_name': v_name,
            'transaction_date': t_date.strftime('%Y-%m-%d'),
            'amount': amount,
            'receipt_id': f"REC_{random.randint(1000,9999)}"
        })
        
    # ---------------------------------------------------------
    # INJECTING THE FRAUD / ANOMALIES FOR YOUR APP TO CATCH
    # ---------------------------------------------------------
    print("Injecting corporate fraud anomalies (split invoices, missing receipts, outliers)...")
    anomalies = []
    
    # 1. The "Split Invoice" Trick (Same emp, same day, same vendor, just under $500)
    anomalies.append({'transaction_id': "TXN_999990", 'employee_id': "EMP_101", 'vendor_id': "004", 'vendor_name': "V_004_Staples", 'transaction_date': "2023-05-15", 'amount': 499.00, 'receipt_id': "REC_8881"})
    anomalies.append({'transaction_id': "TXN_999991", 'employee_id': "EMP_101", 'vendor_id': "004", 'vendor_name': "V_004_Staples", 'transaction_date': "2023-05-15", 'amount': 495.50, 'receipt_id': "REC_8882"})
    
    # 2. Missing Receipt on Large Purchase
    anomalies.append({'transaction_id': "TXN_999992", 'employee_id': "EMP_122", 'vendor_id': "003", 'vendor_name': "V_003_AWS", 'transaction_date': "2023-08-20", 'amount': 2500.00, 'receipt_id': ""})
    
    # 3. Statistical Outlier (An Uber ride that costs $5,430 instead of $50)
    anomalies.append({'transaction_id': "TXN_999993", 'employee_id': "EMP_140", 'vendor_id': "001", 'vendor_name': "V_001_Uber", 'transaction_date': "2023-11-02", 'amount': 5430.00, 'receipt_id': "REC_9999"})
    
    # Combine normal data with our anomalies
    data.extend(anomalies)
    fieldnames = [
        'transaction_id',
        'employee_id',
        'vendor_id',
        'vendor_name',
        'transaction_date',
        'amount',
        'receipt_id'
    ]
    with open("mock_ledger.csv", "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
    
    print("SUCCESS! Created 'mock_ledger.csv' with 9,904 rows. Ready for the Audit Pipeline.")

if __name__ == "__main__":
    create_mock_ledger()