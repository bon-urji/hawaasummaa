'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import {RegisterUser} from "@/services/auth";
export default function RegisterPage(){
  const [ name, setName] = useState('');
  const [ email, setEmail] = useState('');
  const [ password, setPassword] = useState('');
  const [ confirmPassword, setConfirmPassword] = useState('');
  const [ error, setError] = useState('');
  const [ loading, setLoading] = useState(false)
 const [success, setSuccess] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) =>{
    e.preventDefault();
    setError('');
    if (password !== confirmPassword){
      setError('passwords do not match');
      return;
    };
    if (password.length < 8){
      setError('password must be at least 8 characters');
      return;
    }
    setLoading(true);
    const result = await RegisterUser(email,password,name)
    if(result.success){
      setSuccess(true);
      setTimeout( () =>{
        router.push('/');
      }, 2000)
    }
    else{
      setError(result.error)
    }
    setLoading(false)
  };
  if(success){
    return(
      <div className="general">
        <h1 style={{color:'white'}}>Registration successful!</h1>
        <p style={{color:'white'}}>Redirecting to login page...</p>
      </div>
    )
  }
  return(
    <div className="general">
      <h2 style={{color:'wheat', fontSize:'30px',fontWeight:'600'}}>Register New User</h2>
      <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column' , gap:'10px', width:'265px' , color:'white' ,padding:'5px' , alignItems:'center', margin:'0 auto'}}>
        <label>Name:</label>
        <input style={{ border:'2px solid gray'}} type="text"  value={name}
        onChange= {(e)=> setName(e.target.value)}
        placeholder=" name"
        required  />
         <label>Email:</label>
        <input style={{ border:'2px solid  gray'}} type="email"  value={email}
        onChange= {(e)=> setEmail(e.target.value)}
        placeholder=" email"
        required  />
         <label>Password:</label>
        <input style={{border:'2px solid  gray'}} type="password"  value={password}
        onChange= {(e)=> setPassword(e.target.value)}
        placeholder=" password"
        required  />
         <label>Confirm Password:</label>
        <input style={{ border:'2px solid  gray'}} type="password"  value={confirmPassword}
        onChange= {(e)=> setConfirmPassword(e.target.value)}
        placeholder=" confirm password"
        required  />
        {error && 
        <div style={{color:'red'}}>{error}</div>}
        <button
  type="submit"
  disabled={loading}
  style={{
    backgroundColor: loading ? 'gray' :'green',
    color:'white',
    padding:'10px 20px',
    border:'2px solid red',
    borderRadius:'5px',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: 1 
  }}
>
  {loading ? 'Registering...' : 'Register'}
</button>
      </form>
          <p>Already have an account?</p>
      <a href="/login" style={{color:'green', padding:'5px 10px', fontSize:'20px',fontWeight:'600', cursor:'pointer',
    border:'2px solid red',
    borderRadius:'5px', margin: ' auto 200px auto '}}>Login</a>
    </div>
  );
}