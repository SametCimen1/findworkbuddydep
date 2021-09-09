import {useState, useEffect} from 'react';
import styles from '../styles/User.module.css'
import { useHistory } from "react-router-dom";

export default function User({id}){
    const history = useHistory();

    
        
    const [user, setUser] = useState();
    const getUser = async() =>{
        const data =  await fetch('/getbyid',{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
              },
              redirect: 'follow',
              credentials: 'include', // Don't forget to specify this if you need cookies
              body:JSON.stringify({id:id, user:"user"})
        });
        const response = await data.json();
        setUser(response);
    }

    useEffect(()=>{
      getUser();
    },[])

    /**
     {ownimg:user.ownimg,about:user.about, isItme:intId === myId,name:user.name, following:user.following.length,followers:user.followers.length,image:user.image, role:user.role};
     */

     if(typeof user !== 'undefined'){
         return(
            <div className = {styles.container}>
            <div className = {styles.userBox} onClick = {()=> {history.push(`/user/${id}`); history.go(0)}}>
               <img className = {styles.userImage} src = {`http://localhost:5000/img/${user.user.image}`} />
                <p className = {styles.userName}>{user.user.name}</p>
            </div>
        </div>
         )
     }
     else{
         return ('')
     }

}