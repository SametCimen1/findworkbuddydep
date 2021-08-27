const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = async function(req,res,next){

  const {token} = req.cookies;

  if(!token){
    return res.status(401).send('access denied');
  }
  try {
       
         const verified = jwt.verify(token, process.env.TOKENSECRET);
          req.user = verified;
         next();
  
     } catch (error) {
       console.log("invalid token")
         res.status(400).send("Invalid Token")
     }

  //  const token = req.header('auth-token');
  //  if(!token){
  //    return  res.status(401).json("access denied");
  //  }
  //  try {
  //      const verified = jwt.verify(token, process.env.TOKENSECRET);
  //      req.user = verified;
  //      next();

  //  } catch (error) {
  //      res.status(400).send("Invalid Token")
  //  }
}
