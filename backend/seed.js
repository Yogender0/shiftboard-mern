const User = require('./models/User');
const Employee = require('./models/Employee');

module.exports = async function(){
  try{
    const existing = await User.findOne({email:'hire-me@anshumat.org'});
    if(existing) return;
    const admin = new User({name:'Hiring Admin', email:'hire-me@anshumat.org', password:'HireMe@2025!', role:'admin', employeeCode:'ADM001'});
    await admin.save();
    const user = new User({name:'Normal User', email:'user1@example.com', password:'UserPass@123', role:'user', employeeCode:'EMP001'});
    await user.save();
    const emp1 = new Employee({name:'Normal User', employeeCode:'EMP001', department:'Sales', user: user._id});
    await emp1.save();
    const emp2 = new Employee({name:'Admin as employee', employeeCode:'ADM001', department:'HR', user: admin._id});
    await emp2.save();
    console.log('Seeded users');
  }catch(e){
    console.error('Seed error',e);
  }
};
