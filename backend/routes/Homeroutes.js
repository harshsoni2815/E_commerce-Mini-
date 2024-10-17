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

router.get("/",async(req,res)=>{
  const data= await query("select * from products where  quantity >0");
  try{

      res.status(200).json({
        success: true,
        data
    });
  }
  catch(err){
    res.status(500).json({
        success:false,
        message:"internal server error",
    })
  }
 
});

router.get("/:id",async(req,res)=>{
  
  try{

    const data =await query(`select * from products where id=${req.params.id}`);
    res.status(200).json({
      data
    })
  }
  catch(err){
    res.status(500).json({
      message:"internal server error",
      error:err,
    })
  }
   

});
module.exports = router;