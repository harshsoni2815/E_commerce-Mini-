const express = require('express');
const { connection } = require('../database/db');
const router = express.Router();
const authenticateJWT = require('../middleware/authentication')

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};


router.get("/", authenticateJWT, async (req, res) => {
    try {
        console.log("Fetching orders for the authenticated user...");
        const userId = req.user.id;

       
        

       const q= "SELECT  o.id AS order_id,  o.order_date,  o.status,  o.address, o.product_id,  p.name AS product_name,  p.price AS product_price,  p.image_link AS product_image, u.username AS user_name,  u.email AS user_email FROM orders o JOIN users u ON o.user_id = u.id JOIN products p ON o.product_id = p.id WHERE o.user_id = ?"
        const data = await query(q, [userId]);


        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Could not retrieve orders.",
        });
    }
});






router.post('/', authenticateJWT,async(req,res)=>{
    const { productId, address } = req.body;
    console.log(req.body) 
  const userId = req.user.id;

  if (!productId || !address) {
    return res.status(400).json({ message: "Product ID and address are required" });
  }
    
  try {
   
    const Q = 'INSERT INTO orders (user_Id, product_id, address) VALUES (?, ?, ?)';
    
    const result = await query(Q, [userId, productId, address]);
    
    if (result.affectedRows > 0) {
      res.status(201).json({
        message: 'Order placed successfully',
        orderId: result.insertId, 
      });
    } else {
      res.status(500).json({ message: 'Failed to create order' });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: 'An error occurred while creating the order' });
  }
});



module.exports = router;