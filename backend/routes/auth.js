const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req,res)=>{
  const {email,password} = req.body;
  if(!email || !password) return res.status(400).json({message:'email and password required'});
  const user = await User.findOne({email});
  if(!user) return res.status(401).json({message:'Invalid credentials'});
  const ok = await user.comparePassword(password);
  if(!ok) return res.status(401).json({message:'Invalid credentials'});
  const token = jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET || 'thisisasecretkey',{expiresIn:'7d'});
  res.json({token, user:{name:user.name,email:user.email,role:user.role,employeeCode:user.employeeCode}});
});

module.exports = router;
