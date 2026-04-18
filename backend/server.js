const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Parses incoming JSON requests

// MySQL Database Connection
// Update these credentials with your actual database details!
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Change to your DB username
  password: '6265873339', // Change to your DB password
  database: 'portfolio_db' // Ensure you create this database in MySQL first
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ', err);
    return;
  }
  console.log('Connected to MySQL database!');

  // Creates contacts table if it doesn't already exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Contacts table ready.');
    }
  });
});

// Endpoint 1: Handle form submission
app.post('/submit', (req, res) => {
  // Capture values from request body
  const { name, email, subject, message } = req.body;

  // Validate required inputs
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields (Name, Email, Message)' });
  }

  // Insert data into contacts table
  const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
  db.query(query, [name, email, message], (err, result) => {
    if (err) {
      console.error('Error saving data:', err);
      return res.status(500).json({ success: false, message: 'Database error occurred' });
    }

    // Return a success JSON response
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  });
});

// Endpoint 2: View stored data
app.get('/contacts', (req, res) => {
  const query = 'SELECT * FROM contacts ORDER BY created_at DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Database error occurred' });
    }

    // If browser expects HTML, send simple admin interface
    if (req.accepts('html')) {
      let html = `
          <html>
          <head>
            <title>Contact Submissions</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f4f4f4; }
              tr:nth-child(even) { background-color: #fafafa; }
            </style>
          </head>
          <body>
            <h2>Contact Form Submissions</h2>
            <table>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date Sent</th>
              </tr>
        `;

      results.forEach(row => {
        const date = new Date(row.created_at).toLocaleString();
        html += `
            <tr>
              <td>${row.id}</td>
              <td>${row.name}</td>
              <td><a href="mailto:${row.email}">${row.email}</a></td>
              <td>${row.message}</td>
              <td>${date}</td>
            </tr>
          `;
      });

      html += `
            </table>
          </body>
          </html>
        `;
      res.send(html);
    } else {
      // If API expects JSON (like a frontend client request)
      res.status(200).json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
  console.log(`- Submit Endpoint: POST http://localhost:${port}/submit`);
  console.log(`- View Data Endpoint: GET http://localhost:${port}/contacts`);
});
