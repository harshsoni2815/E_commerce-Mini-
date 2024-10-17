// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '281500',  // Update with your MySQL password
    database: 'ecommerce' // Your database name
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Exporting the connection
module.exports = { connection }; // Change here to export as an object
