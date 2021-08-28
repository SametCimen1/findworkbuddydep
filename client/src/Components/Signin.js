import { useHistory } from "react-router-dom";
import axios from 'axios';
import {useEffect, useState} from 'react'
import { GoogleLogin } from 'react-google-login';

export default function Signup(){

  const [doesExist, setDoesExist] = useState(null);

   console.log(process.env.REACT_APP_SECRET)
  const [email, setEmail] = useState('');
  const userExist = async() =>{
    const data = await fetch("/userexist",{
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      credentials: 'include',
    })
    const response = await data.json();
    if(response){
      setDoesExist(true)
      alert("Already Logged In")
      history.push("/");
    }
    else{
      setDoesExist(false)
    }
  } 
  useEffect(()=>{
    userExist();
  })

  const [password, setPassword] = useState('');
  const history = useHistory();

  const login = async(e) =>{
    e.preventDefault();
    const data = await fetch("/api/user/signin", {  
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    // mode: 'same-origin',
    redirect: 'follow',
    credentials: 'include', // Don't forget to specify this if you need cookies
    body: JSON.stringify({password:password, email:email})
    })

    if(data.status === 200){
      history.push("/");
      history.go(0);
    }
    else{
      alert("Something went wrong try again")
      history.go(0)
    }

  }


  const onSuccess = async(res) => {
    const password = await prompt('Choose password');
    const email = res.profileObj.email;
    const name = res.profileObj.givenName;
    const img = res.profileObj.imageUrl;

      const data = await fetch('/api/user/checkemail', {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email:email})
    });
    const response = await data.json();
    
    if(!response){ //doesnt exist
      const data = await fetch('/api/user/signup', {
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email:email,name:name,img:img,password:password})
      });
      const signin = await fetch('/api/user/signin', {
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        credentials: 'include',
        body: JSON.stringify({email:email,password:password})
      })
      history.push("/");
      history.go(0);
    }
    else{ //exist
      const data = await fetch('/api/user/signin', {
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        credentials: 'include',
        body: JSON.stringify({email:email,password:password})
      })
      history.push("/")
      history.go(0);
    };

    

    // refreshTokenSetup(res);
  };


  const onFailure = (res) => {
    console.log('Login failed: res:', res);
  };
  if(!doesExist){
    const secret = process.env.REACT_APP_SECRET;
  
    return (
      <div className = "container">
      <div className ="formAndTextContainer">
        <div className = "signUpText">
        <h2>Sign up <span>findworkbuddy is totally free!</span></h2>
        </div>
        <div className  = "formContainer">
          <form onSubmit = {(e) => login(e)}>
          <div className = "form">
            
            <input type = "text"required className = "input"   placeholder = "Email"  value = {email} onChange = {(e)=> setEmail(e.target.value.toLowerCase())}/>
        </div> 
            <div className = "form">
              
                <input type = "password" className = "input"  placeholder = "Password" required  value = {password} onChange = {(e)=> setPassword(e.target.value)}/>
            </div>
            <button className = "btn" type = "submit">Log in</button>
          </form>
           <h3>or sign in with</h3>
                <GoogleLogin
              clientId={secret}
              buttonText="Login"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={'single_host_origin'}
              style={{ marginTop: '100px' }}
              isSignedIn={false}
            />
    
         </div>
          
        </div>
        <div className = "imgContainer">
            <img src  ="/signin.png" className = "img"></img>
         </div>
    </div>
    )
  }
  else{
    return (<div>
       <h1>Already logged in</h1>
    </div>)
  }
  }