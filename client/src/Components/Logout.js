import { useHistory } from "react-router-dom";
import {useEffect} from 'react';

export default function Logout() {
    const history = useHistory();

    const Logout = async() =>{
    
        const data = await fetch("/api/user/logout", 
        {
          method:"POST",
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          credentials: 'include', // Don't forget to specify this if you need cookies
          });
        history.push("/");
        history.go(0);
       
      }
      useEffect(()=>{
        Logout();
      })
    
  return (
      <h1>Logging out</h1>
  )
}