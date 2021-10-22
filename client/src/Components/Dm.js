
import {useEffect, useState} from 'react'
import {  useParams} from 'react-router-dom';
export default function Dm(){
    let { id } = useParams();
    
    const [reciever, setReciever] = useState();
     
    useEffect(()=>{
      isFriends()
    },[])
    
    const isFriends = async() =>{
     const data = await fetch('/getbyid',{
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          credentials: 'include', // Don't forget to specify this if you need cookies
          body:JSON.stringify({id:id})
     })
     const response = await data.json()
     setReciever(reciever);

    }

   return(
       <h1>dm</h1>
   )

}