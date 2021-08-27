import {  useParams} from 'react-router-dom';
import {useState, useEffect} from 'react'
import '../styles/longStyle.css';
export default function LongPost(){
    let { id } = useParams();
    

    useEffect(()=>{
     getPost();
    },[])
  
    const [myId, setMyId] = useState();
    const [like, setLike] = useState(false);
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
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
           console.log(post)
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
    },[post])

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
        const data = await fetch('/post/newcomment', {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
              },
              redirect: 'follow',
              credentials: 'include', // Don't forget to specify this if you need cookies
              body:JSON.stringify({postId:post.id, comment:comment})
        })
        getPost();
        
    
    }



    useEffect(()=>{
        if(post !== null){
        getComments();
        }
    },[post])
    
    let promises;
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
        getPost();
   }
  
    if(post !== null){
        return(
            <div className = "LongPost">
             <div className = "userInfo">
                       <div className = "imgAndNameContainer">
                            <img src = {post.image} className = "userImage"/>
                            <div className = "nameContainer">
                                <p className = "userName">Samet</p>
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
             <div className = "longTexts"> 
                <h1 className = "longUserHeader "  >{post.header}</h1>
                <p className = "longUserParagraph " >{post.paragraph}</p>
             </div>
             {/* <button onClick = {likePost}>Like</button> */}
             <div className = "postInfo">
                <div className = "viewComment">
                    <p>0 views</p>
                    <p className = "longPost">0 Comments</p>
                </div>
                <div className = "heartContainer">
                    <p>{post.likes}</p>
                   <div className={like? 'heart heartactive': 'heart' } onClick = {likePost}></div>
                </div>
             </div>

             <div> {/* Replies */}
                 <h1>Replies</h1>
                 <input type = "text" value = {comment} onChange = {(e)=> setComment(e.target.value)}></input>
                 <button onClick = {newComment}>Comment</button>
                 <div>
                  {/* {comments.map(elem => elem)} */}
                  {/* {console.log("comments")} */}
                 {comments.map(elem => {
                   if(typeof elem.userimg !== 'undefined') { return (
                         <div className = "commentContainer">
                            <div className = "commentNameContainer"> 
                               <img src =  {elem.userimg} className = "commentImage"/>
                               <p className = "userName m">{elem.username}</p>
                            </div>
                            <p className = "userParagraph">{elem.text}</p>
                            {myId === elem.userid ? <button onClick = {()=> deleteComment(elem.id)}>Delete</button> :''}
                         </div>
                     )}
                     else{

                     }
                 })}
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