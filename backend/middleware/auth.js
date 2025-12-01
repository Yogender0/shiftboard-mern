const jwt = require('jsonwebtoken');
module.exports = {
  auth: (req,res,next)=>{
    const header = req.headers.authorization;
    if(!header) return res.status(401).json({message:'No token'});
    const token = header.split(' ')[1];
    try{
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'thisisasecretkey');
      req.user = payload;
      next();
    }catch(e){
      return res.status(401).json({message:'Invalid token'});
    }
  },
  permit: (roles)=> (req,res,next)=>{
    if(!roles.includes(req.user.role)) return res.status(403).json({message:'Forbidden'});
    next();
  }
}
