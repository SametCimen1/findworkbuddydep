import {Helmet} from 'react-helmet'
import {  useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import Following from './following';
import NotFollowing from './notfollowing';


export default function UserId(){
    let { id } = useParams();
    const [user, setUser] = useState();
    const history = useHistory();

    const getUser = async() =>{
       const data =  await fetch("/getbyid", {
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        credentials: 'include', // Don't forget to specify this if you need cookies
        body:JSON.stringify({id:id})
       })
       const response = await data.json();
       setUser(response);
    }
    useEffect(()=>{
      getUser();
    },[])
    
    if(user){
        const newUser = {user:user, id:id}

        
    if(user.friend){
        return <Following myUser = {newUser}/>}
    else{
        return <NotFollowing myUser = {newUser}/>
    }
    }
    else{
        return(
            <div>
                <h2>loading</h2>
            </div>
        )
    }
}