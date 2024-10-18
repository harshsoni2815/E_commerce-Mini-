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



router.get("/:id",async(req,res)=>{
    const {id} = req.params;
    
   try{
      const data= await query(`select * from comments where product_id=${id}`);
      res.status(200).json({
        data:data
      })
   }
   catch(err){
     res.status(500).json({
        message:"internal server error",
        error:err.message,
     })
   }
});

router.post('/comment', authenticateJWT, async (req, res) => {
  const { postId, commentText, rating } = req.body; // Include rating if needed
  console.log(req.body)
  // Get user ID from the authenticated user

  if (!postId || !commentText) {
    return res.status(400).json({ message: 'Post ID and comment text are required.' });
  }

  try {
    await query('INSERT INTO comments (product_id , comment_text, rating) VALUES (?, ?, ?)', 
                [postId,  commentText, rating]); // Include rating if storing it
    res.status(201).json({ message: 'Comment added successfully.' });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;