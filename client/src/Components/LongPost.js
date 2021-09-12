import { useHistory } from "react-router-dom";
import {  useParams} from 'react-router-dom';
import {useState, useEffect} from 'react'
import '../styles/longStyle.css';
export default function LongPost(){
    let { id } = useParams();
    const history = useHistory();   
    

    useEffect(()=>{
     getPost();
    },[])
  
    const [myId, setMyId] = useState();
    const [like, setLike] = useState(false);
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [myImage, setMyImage] = useState();
    const [img, setImg] = useState('');
    useEffect(()=>{
        if(post !== null) getTime();
    },[post])

    const getPost = async() =>{
        const data = await fetch('/post/getpost', {
            method:"POST",
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow',
            credentials: 'include',
            body: JSON.stringify({id:id})
          });
        const response = await data.json();
        setPost(response);
    }
    const [time, setTime] = useState(0);
    const [timeUnit, setTimeUnit] = useState('');
    const getTime = () =>{
            const date = new Date(post.uploadtime);
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

    useEffect(()=>{
       isLiked();
       getImg();
    },[post])
    const getImg = async() =>{
        if(post  !== null){
        const userId = post.userid;
        const data = await fetch('/post/getimg', {
          method:"POST",
          headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow',
            credentials: 'include', // Don't forget to specify this if you need cookies
            body:JSON.stringify({userid:userId})
        })
        const response = await data.json();
        setImg(response.image);
       }
      
      }

    const isLiked = async() =>{
    if(post !== null){
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
  
    }
  
    const likePost = async() =>{
        if(like){// liked now unlike it 
            console.log('unliking')
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
            setPost(response)
        }
        else{
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
            setPost(response)
        }
        setLike(prev => !prev)
    }

    const newComment = async() =>{
        console.log("new comment ->", comment)
        if(comment.length <= 0){
        alert('comment is empty')
        }
        else{
            const data = await fetch('/post/newcomment', {
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                credentials: 'include', // Don't forget to specify this if you need cookies
                body:JSON.stringify({postId:post.id, comment:comment, reciever:post.userid})
            })
            getPost();
        }
      
    }



    useEffect(()=>{
        if(post !== null){
            console.log("post is not null");
            console.log(post)
        getComments();
        }
    },[post])
    

    const getComments = async() =>{
        if(post !== null){
        post.commentby.forEach((id) => {
            getComment(id);
        })
     
        }
    }

   

   const[comments, setComments] = useState([{}]);
   const getComment = async (commentId) =>{    
     const data = await fetch('/post/getcomment', {
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          credentials: 'include', // Don't forget to specify this if you need cookies
          body:JSON.stringify({id:commentId})
     })
     const response = await data.json();
     console.log("comment", response)
    
     const isInList = comments.some(function(elem) {
        return (elem.id === response.id || (elem.text === response.text && elem.id === response.id))
      })
      if(isInList === false){
        setComments(oldArray  => [...oldArray, response]);
      }
      console.log(isInList)
   };



   useEffect(() => {
    getId();
   }, [])
   const getId = async() =>{
       const data = await fetch('/getuser',{
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          credentials: 'include', // Don't forget to specify this if you need cookies
       });
       const res = await data.json();
       setMyId(res.id)
   }
   const deleteComment = async(id) =>{
    const data = await fetch('/post/deletecomment',{
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          credentials: 'include', // Don't forget to specify this if you need cookies
          body:JSON.stringify({id:id, postId:post.id})
        });
        const response = await data.json();
        history.go(0)
        getPost();
   }
  

   useEffect(()=>{
    if(img !== null ){
             let urlImage = '';             
             for(let i = 0; i < 4; i++){
             urlImage += img[i] 
             }
             if(urlImage === 'http'){
             setMyImage(false);
             } 
             else{ 
             setMyImage(true);
             }
     }
},[img])
   
    if(post !== null){
        return(
            <div className = "LongPost">
             <div className = "userInfo">
             <div className = "imgAndNameContainer">
                {console.log(myImage)}
                           {/* {myImage && <img onClick = {() => history.push(`/user/${post.id}`)} src = {`/img/${img}`} className = "userImage"/>} */}
                           {myImage &&  <img src = {img} className = "userImage"/>}
                            
                            <div className = "nameContainer">
                                <p className = "userName">{post.username}</p>
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
             {console.log(post)}
             <div className = "longTexts"> 
                <h1 className = "longUserHeader"  >{post.header}</h1>
                <p className = "longUserParagraph" >{post.paragraph}</p>
             </div>
             {/* <button onClick = {likePost}>Like</button> */}
             <div className = "postInfo">
                <div className = "viewComment">
                    <p className = "longPost">{post.commentby.length} Comments</p>
                </div>
                <div className = "heartContainer">
                    <p>{post.likes}</p>
                    {console.log("DID I LIKE IT")}
                    {console.log(like)}
                   <div className={like? 'heart heartactive': 'heart' } onClick = {likePost}></div>
                </div>
             </div>

             <div> {/* Replies */}
                 <h1>Replies</h1>
                 <input type = "text" value = {comment} onChange = {(e)=> setComment(e.target.value)}></input>
                 <button onClick = {newComment}>Comment</button>
                 <div>
                  {console.log("commentsssssssss")}
                  {console.log(comments)}
                  {/* {console.log("comments")} */}
                 {comments.map(elem => (
                   (typeof elem.userimg !== 'undefined' && (
                    <div className = "commentContainer">
                       <div className = "commentNameContainer"> 
                          <img  onClick = {() => history.push(`/user/${elem.id}`)} src =  {`/img/${elem.userimg}`} className = "commentImage"/>
                          <p className = "userName m">{elem.username}</p>
                          <p className = "LonguserParagraph">{elem.text}</p>
                          {myId === elem.userid ? <button onClick = {()=> deleteComment(elem.id)} className = "dltBtn">Delete</button> :''}
                       </div>

                    </div>
                )) 
                 ))}
                 </div>
             </div>
            </div>
        )}
        else{
            return (
                <p>Empty</p>
            )
        } 
    
}