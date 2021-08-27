import { useHistory } from "react-router-dom";
import {useState, useEffect} from 'react';

export default function Admin(){
    const [admin, setAdmin] = useState(undefined);
    const history = useHistory();   


    const verify = async() =>{
      const data = await fetch('/admin', {
          method:"POST",
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
      }).then(res => res.json()).then(res => setAdmin(res));

    };

    useEffect(()=>{
        verify();
    })
    if(admin){
      return (
          <h1>Hello admin</h1>
      )
    }
    if(admin === false){
        
        return(
            <>
            {history.push("/401")}
            </>
        )
       
     }
    else{
        return (
            ''
        )
    }
    
}