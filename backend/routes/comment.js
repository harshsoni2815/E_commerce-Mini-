const express = require('express');
const { connection } = require('../database/db');
const router = express.Router();

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
module.exports = router;