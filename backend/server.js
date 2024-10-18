const express = require('express');
const bodyParser = require('body-parser'); // Only if you are using body-parser
const cors = require('cors'); // Only if you are using CORS
const authRoutes = require('./routes/auth'); // Adjust the path as necessary
const Homeroutes = require('./routes/Homeroutes');
const commentrout = require('./routes/comment');
const order = require('./routes/order');
const cartroute =require('./routes/cart');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes); 

app.use('/api/home',Homeroutes);

app.use('/api/comments',commentrout);

app.use('/api/order',order)

app.use('/api/cart',cartroute);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
