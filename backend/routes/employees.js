const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const {auth, permit} = require('../middleware/auth');

// GET /employees - admin only
router.get('/', auth, permit(['admin']), async (req,res)=>{
  const emps = await Employee.find().populate('user','email name');
  res.json(emps);
});

module.exports = router;
