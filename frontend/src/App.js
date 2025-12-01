import React, {useState, useEffect} from 'react';
import axios from 'axios';

const api = axios.create({baseURL:process.env.REACT_APP_API_URL || 'http://localhost:8080/api'});

function Login({onLogin}) {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState('');
  async function submit(e){
    e.preventDefault();
    try{
      const res = await api.post('/auth/login',{email,password});
      localStorage.setItem('token',res.data.token);
      onLogin(res.data.user);
    }catch(e){
      setErr(e.response?.data?.message || 'Login failed');
    }
  }
  return (<form onSubmit={submit} style={{maxWidth:400, margin:'20px auto'}}>
    <h2>Login</h2>
    {err && <div style={{color:'red'}}>{err}</div>}
    <div><input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} /></div>
    <div><input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} /></div>
    <button>Login</button>
  </form>);
}

function AdminPanel({user}) {
  const [employees,setEmployees] = useState([]);
  const [shifts,setShifts] = useState([]);
  const [form, setForm] = useState({employeeId:'',date:'',startTime:'09:00',endTime:'13:00'});
  useEffect(()=>{ fetchShifts(); fetchEmployees(); },[]);
  const token = localStorage.getItem('token');
  const authHeader = {headers:{Authorization:'Bearer '+token}};
  async function fetchEmployees(){
    try{
      const res = await api.get('/employees', authHeader);
      setEmployees(res.data);
    }catch(e){ console.error(e); }
  }
  async function fetchShifts(){
    try{
      const res = await api.get('/shifts', authHeader);
      setShifts(res.data);
    }catch(e){ console.error(e); }
  }
  async function submit(e){
    e.preventDefault();
    try{
      await api.post('/shifts', {
        employeeId: form.employeeId, date: form.date, startTime: form.startTime, endTime: form.endTime
      }, authHeader);
      alert('Shift added');
      fetchShifts();
    }catch(e){
      alert(e.response?.data?.message || 'Error');
    }
  }
  return (<div style={{padding:20}}>
    <h2>Admin Dashboard</h2>
    <form onSubmit={submit} style={{marginBottom:20}}>
      <div>
        <select value={form.employeeId} onChange={e=>setForm({...form, employeeId: e.target.value})}>
          <option value=''>Select employee</option>
          {employees.map(emp=> <option key={emp._id} value={emp._id}>{emp.name} ({emp.employeeCode})</option>)}
        </select>
      </div>
      <div><input type='date' value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required /></div>
      <div><input type='time' value={form.startTime} onChange={e=>setForm({...form,startTime:e.target.value})} required /></div>
      <div><input type='time' value={form.endTime} onChange={e=>setForm({...form,endTime:e.target.value})} required /></div>
      <button>Add Shift</button>
    </form>

    <h3>Shifts</h3>
    <table border='1' cellPadding='6'>
      <thead><tr><th>Employee</th><th>Date</th><th>Start</th><th>End</th></tr></thead>
      <tbody>
        {shifts.map(s=> <tr key={s._id}><td>{s.employee?.name}</td><td>{s.date}</td><td>{s.startTime}</td><td>{s.endTime}</td></tr>)}
      </tbody>
    </table>
  </div>);
}

function UserPanel({user}) {
  const [shifts,setShifts] = useState([]);
  useEffect(()=>{ fetchShifts(); },[]);
  const token = localStorage.getItem('token');
  const authHeader = {headers:{Authorization:'Bearer '+token}};
  async function fetchShifts(){
    try{
      const res = await api.get('/shifts', authHeader);
      setShifts(res.data);
    }catch(e){ console.error(e); }
  }
  return (<div style={{padding:20}}>
    <h2>Your Shifts</h2>
    <table border='1' cellPadding='6'>
      <thead><tr><th>Date</th><th>Start</th><th>End</th></tr></thead>
      <tbody>
        {shifts.map(s=> <tr key={s._id}><td>{s.date}</td><td>{s.startTime}</td><td>{s.endTime}</td></tr>)}
      </tbody>
    </table>
  </div>);
}

export default function App(){
  const [user,setUser] = useState(null);
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      // no verification here; keep simple
    }
  },[]);
  if(!user) return <Login onLogin={setUser} />;
  return (<div>
    <div style={{padding:10, background:'#eee'}}>
      <span>Welcome {user.name} ({user.role})</span>
      <button style={{marginLeft:20}} onClick={()=>{localStorage.removeItem('token'); window.location.reload();}}>Logout</button>
    </div>
    {user.role === 'admin' ? <AdminPanel user={user} /> : <UserPanel user={user} />}
  </div>);
}
