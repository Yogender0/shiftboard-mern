const express = require('express');
const router = express.Router();
const Shift = require('../models/Shift');
const Employee = require('../models/Employee');
const {auth, permit} = require('../middleware/auth');

// helper
function toMinutes(t){
  const [h,m] = t.split(':').map(Number);
  return h*60 + m;
}

// POST /shifts - admin only (assign shift)
router.post('/', auth, permit(['admin']), async (req,res)=>{
  try{
    const {employeeId, date, startTime, endTime} = req.body;
    if(!employeeId || !date || !startTime || !endTime) return res.status(400).json({message:'Missing fields'});

    // min 4 hours
    const diff = toMinutes(endTime) - toMinutes(startTime);
    if(diff < 240) return res.status(400).json({message:'Shift must be at least 4 hours'});

    // no overlap for same employee & date
    const existing = await Shift.find({employee:employeeId, date});
    const sStart = toMinutes(startTime), sEnd = toMinutes(endTime);
    for(const e of existing){
      const eStart = toMinutes(e.startTime), eEnd = toMinutes(e.endTime);
      // overlap check
      if(Math.max(eStart,sStart) < Math.min(eEnd,sEnd)){
        return res.status(400).json({message:'Overlapping shift exists for this employee on that date'});
      }
    }

    const shift = new Shift({employee:employeeId,date,startTime,endTime});
    await shift.save();
    res.json(shift);
  }catch(e){
    console.error(e);
    res.status(500).json({message:'Server error'});
  }
});

// GET /shifts?employee=xx&date=yyyy-mm-dd
router.get('/', auth, async (req,res)=>{
  try{
    const q = {};
    // If normal user, restrict to their employee record
    if(req.user.role === 'user'){
      const emp = await Employee.findOne({user: req.user.id});
      if(!emp) return res.status(400).json({message:'No employee linked'});
      q.employee = emp._id;
    }else{
      if(req.query.employee) q.employee = req.query.employee;
    }
    if(req.query.date) q.date = req.query.date;
    const shifts = await Shift.find(q).populate('employee');
    res.json(shifts);
  }catch(e){
    console.error(e);
    res.status(500).json({message:'Server error'});
  }
});

// DELETE /shifts/:id - admin only
router.delete('/:id', auth, permit(['admin']), async (req,res)=>{
  await Shift.findByIdAndDelete(req.params.id);
  res.json({message:'Deleted'});
});

module.exports = router;
