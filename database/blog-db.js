const mysql = require('mysql2');
require('dotenv').config()

const credentials = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'my-db-user',
  password: process.env.DB_PASSWORD || 'my-secret-password',
  database: process.env.DB_NAME || 'my-db-name'
}

const connection = mysql.createConnection(credentials);

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

module.exports = connection;