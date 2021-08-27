import {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import '../styles/postStyle.css';
export default function Post({post}){
    const history = useHistory();
     
     
    useEffect(()=>{
       setMyPost(post)
       isLiked()     
    },[])

    




    const [like, setLike] = useState(false);

   
    const [myPost, setMyPost] = useState(null);
    useEffect(()=>{
        if(myPost !== null) getTime();
    },[myPost])


    const [time, setTime] = useState(0);
    const [timeUnit, setTimeUnit] = useState('');
    const getTime = () =>{

            const date = new Date(myPost.uploadtime);
            const currentTime = new Date();
            const difference =  (currentTime - date);
            const minutes = Math.floor((difference/1000)/60);
            if(minutes > 60){
                const hours = Math.floor(minutes/60);
                setTime(hours)
                setTimeUnit("hours")
            }
            else{
                setTime(minutes);
                setTimeUnit("minutes")
            }
    }

    
    const isLiked = async() =>{
        const data = await fetch('/post/didlike',{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
              },
              redirect: 'follow',
              credentials: 'include', // Don't forget to specify this if you need cookies
              body:JSON.stringify({id:post.id})
        });
        const response = await data.json();
        setLike(response);
    }
  
    const likePost = async() =>{
        if(like){// liked now unlike it 
            const data = await fetch('/post/unlikepost',{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                  },
                  redirect: 'follow',
                  credentials: 'include', // Don't forget to specify this if you need cookies
                  body:JSON.stringify({id:post.id})
            });
            const response = await data.json();
            setMyPost(response)
        }
        else{
            console.log('liking')
            const data = await fetch('/post/likepost',{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                  },
                  redirect: 'follow',
                  credentials: 'include', // Don't forget to specify this if you need cookies
                  body:JSON.stringify({id:post.id})
            });
            const response = await data.json();
            setMyPost(response)
        }
        setLike(prev => !prev)
    }
    const longPost = () =>{
        history.push(`/post/${post.id}`);
    }

    if(myPost !== null){
    return(
        <div className = "post">
         <div className = "userInfo">
                   <div className = "imgAndNameContainer">
                        <img src = {`/img/${myPost.image}`}  className = "userImage"/>
                        {/* <img src = {`http://localhost:5000/img/${myPost.image}`} onClick = {history.push(`/user/${post.userid}`)} className = "userImage"/> */}
                        <div className = "nameContainer">
                            <p className = "userName">{myPost.username}</p>
                            <p>{time} {timeUnit} ago</p>
                        </div>
                        
                    </div>
                    {/* <div className = "dots">
                      <div className="dropdown"  onClick = {()=> setPopup(prev => !prev)}>
                            <div className = "dot"></div>
                            <div className = "dot"></div>
                            <div className = "dot"></div>
                      </div>
                    <div className = {popup ? "pupopvisible" :"popupinvisible"}>
                      <div className = "popupContainer">
                        <h1>Edit post</h1>
                        <h1>share post</h1>
                      </div>
                    </div>
                    </div> */}
         </div>
         <div className = "texts"> 
            <h1 className = "userHeader "  onClick={longPost}>{myPost.header}</h1>
            <p className = "userParagraph " onClick={longPost}>{myPost.paragraph}</p>
         </div>
         {/* <button onClick = {likePost}>Like</button> */}
         <div className = "postInfo">
            <div className = "viewComment">
                <p className = "longPost" onClick={longPost}>{myPost.commentby.length}</p>
                <svg id="Layer_1" onClick={longPost} className = "longPost" data-name="Layer 1"  width = "24px" height = "24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.97 122.88"><title>instagram-comment</title><path d="M61.44,0a61.46,61.46,0,0,1,54.91,89l6.44,25.74a5.83,5.83,0,0,1-7.25,7L91.62,115A61.43,61.43,0,1,1,61.44,0ZM96.63,26.25a49.78,49.78,0,1,0-9,77.52A5.83,5.83,0,0,1,92.4,103L109,107.77l-4.5-18a5.86,5.86,0,0,1,.51-4.34,49.06,49.06,0,0,0,4.62-11.58,50,50,0,0,0-13-47.62Z"/></svg>
            </div>
            <div className = "heartContainer">
                <p>{myPost.likes}</p>
               <div className={like ? 'heart heartactive': 'heart' } onClick = {likePost}></div>
            </div>
         </div>
        </div>
    )}
    else{
        return (
            <h1>myPost is null</h1>
        )
    }
}