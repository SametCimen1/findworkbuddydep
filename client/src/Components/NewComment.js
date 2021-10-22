import styles from '../styles/User.module.css'
import {useEffect, useState} from 'react'
import { useHistory } from "react-router-dom";
export default function NewComment({id, clickFund}){
    const [comment, setComment] = useState();
    const history = useHistory();
    
    const getComment = async() =>{

        const data = await fetch("/post/getcomment",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
              },
              redirect: 'follow',
              credentials: 'include', // Don't forget to specify this if you need cookies
              body:JSON.stringify({id:id})
        })
        const response = await data.json();

        if(response === 'cmUn' || response.text === ''){

        }
        else{
            setComment(response)

        }
    }
    
    useEffect(()=>{
        getComment();
    },[])

    if(typeof comment !== 'undefined'){
    return (
        <div className = {styles.container}>
        <div className = {styles.userBox} onClick = {()=> {history.push(`/user/${comment.userid}`); history.go(0)}}>
            {comment.userimg === null || comment.userimg === '' ? <img  className = {styles.userImage} src = "/default.svg" /> : <img  className = {styles.userImage} src = {`/img/${comment.userimg}`} />}
            
            <p className = {styles.userName}>{comment.username}</p>
        </div>
        <div className = {styles.textContainer}>
            <p>commented {comment.text}</p>
        </div>
        <button className = {styles.okBtn} onClick = {()=> clickFund(id)}>OK</button>
    </div>
    
    )
    }
    else{
        return ('')
    }
}