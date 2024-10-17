const express = require('express');
const bodyParser = require('body-parser'); // Only if you are using body-parser
const cors = require('cors'); // Only if you are using CORS
const authRoutes = require('./routes/auth'); // Adjust the path as necessary
const Homeroutes = require('./routes/Homeroutes');
const commentrout = require('./routes/comment');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Only if you are using body-parser

// Routes
app.use('/api/auth', authRoutes); // Adjust based on your routes

app.use('/api/home',Homeroutes);

app.use('/api/comments',commentrout);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
