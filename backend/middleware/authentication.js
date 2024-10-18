
const jwt = require('jsonwebtoken');


const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); 
            }
            console.log(user);
            req.user = user; 
            next();
        });
    } else {
        res.sendStatus(401); 
    }
};

module.exports = authenticateJWT; 
