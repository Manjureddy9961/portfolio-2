const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '6265873339',
  database: 'portfolio_db'
});

db.query("DESCRIBE contacts", (err, results) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(results);
  }
  process.exit(0);
});
