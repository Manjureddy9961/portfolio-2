from flask import Flask, request, send_from_directory, jsonify
import csv
import os
from datetime import datetime

app = Flask(__name__, static_folder='.', static_url_path='')

# We use a CSV file because it opens natively in Microsoft Excel seamlessly
# without requiring gigantic third-party libraries like Pandas
EXCEL_FILE = 'contacts.csv'

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/submit', methods=['POST'])
def submit():
    name = request.form.get('name')
    email = request.form.get('email')
    subject = request.form.get('subject')
    message = request.form.get('message')
    
    file_exists = os.path.isfile(EXCEL_FILE)
    
    try:
        # Append data to the Excel-compatible CSV file
        with open(EXCEL_FILE, mode='a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if not file_exists:
                # Write Excel headers if file is created for the first time
                writer.writerow(['Timestamp', 'Name', 'Email', 'Subject', 'Message'])
            writer.writerow([datetime.now().strftime("%Y-%m-%d %H:%M:%S"), name, email, subject, message])
            
        return jsonify({"success": True, "message": "Successfully saved to local excel sheet!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    print("==================================================")
    print("🚀 Starting local server at http://localhost:5000")
    print("📝 Contact form submissions will be saved to:", EXCEL_FILE)
    print("==================================================")
    app.run(port=5000, debug=True)
