import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
function Login(){
    const backend="https://planitnow-backend.onrender.com";
    const navigate=useNavigate();
    const[email,setEmail]=useState("");
    const[pass,setPass]=useState("");
    const[error,setError]=useState("");
    async function userLogin(e){
        e.preventDefault();
        try{
            const result=await axios.post(`${backend}/api/users/login`,{email,pass});
            setError(result.data.message);
            if(result.data.message==="login successful"){
                navigate('/homepage');
                const decodedToken=jwtDecode(result.data.token);
                localStorage.setItem("id",decodedToken.Id);
                localStorage.setItem('token',result.data.token);
            }
        }catch(err){
            setError('login failed');
            console.error(err.message);
        }
    }
    return(
        <div className="Logincontainer">
            <div className="name">
                <h2>Welcome Back...</h2>
            </div>
            <form onSubmit={userLogin} className="form">
                <input type="email" placeholder="Enter Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                <input type="password" placeholder="Enter Password" value={pass} onChange={(e)=>setPass(e.target.value)} required />
                <div className="Registerbuttonclass">
                    <button type="submit">Login</button>
                    <button type="button" onClick={()=>navigate('/')}>New user? Register here...</button>
                </div>
            </form>
            {error && <p className="message">{error}</p>}
        </div>
    )
}
export default Login;