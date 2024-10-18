const express = require('express');
const authenticateJWT = require('../middleware/authentication');
const router = express.Router();
const { connection } = require('../database/db'); 

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

router.post('/', authenticateJWT, async (req, res) => {
  const { productId } = req.body; 
  const userId = req.user.id;

  try {
   
    const result = await query(
      'INSERT INTO cart (userid, productid) VALUES (?, ?)',
      [userId, productId]
    );

    res.status(201).json({
      message: "Product added to cart successfully",
      cartItemId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

router.get('/',authenticateJWT,async(req,res)=>{
    const userId = req.user.id; 

  try {
    const Q = `
      SELECT c.id, c.productId, c.created_at, p.name, p.description, p.image_link, p.price, p.rating
      FROM cart AS c
      JOIN products AS p ON c.productId = p.id
      WHERE c.userId = ?
    `;

    const datas = await query(Q, [userId]);
    
    res.status(200).json({
      success: true,
      data: datas,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
})

router.delete('/:id', authenticateJWT, async (req, res) => {
    const cartItemId = req.params.id;
    const userId = req.user.id; 

    try {
        const result = await query(
            'DELETE FROM cart WHERE id = ? AND userId = ?',
            [cartItemId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Cart item removed successfully" });
    } catch (error) {
        console.error("Error removing cart item:", error);
        res.status(500).json({ message: "Failed to remove cart item" });
    }
});


module.exports = router;
