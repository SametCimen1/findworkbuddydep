import '../../styles/userExistStyle.css'
import {useState, useEffect} from 'react'
import { useHistory } from "react-router-dom";
import ShortPost from '../ShortPost';
export default function UserExist(){
    const [INwhat, setINwhat] = useState('');
    const [INheader, setINheader] = useState('');
    const [INkey, setINkey] = useState('');
    const [INimg, setINimg] = useState('');
    const [isSuccess,setIsSuccess] = useState(false);
    const history = useHistory();


    const [sort, setSort] = useState('');
    const [subject, setSubject] = useState('');


    const [posts, setPosts] = useState([]);
    const [createPost, setCreatePost] = useState(false);

    const submitPost = async() =>{
      if(INheader === '' || INwhat === ''){
        alert("please fill in all of the inputs")
      }
      else{
     const data  = await fetch('/post/newpost', {
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        credentials: 'include', // Don't forget to specify this if you need cookies
        body:JSON.stringify({image:INimg, header:INheader, paragraph:INwhat, keywords:INkey})
     });
     const response = await data.json();
     if(response){
      history.go(0);
      setIsSuccess(true)
     }
     else{
         alert("error check console")
     }
    }
    }

    const getPosts = async(sort) =>{
        const data = await fetch('/post/getposts', {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
              },
              redirect: 'follow',
              credentials: 'include', // Don't forget to specify this if you need cookies
              body:JSON.stringify({sort:sort, subject:subject})
        })
        const response = await data.json();
        setPosts(response)
    }



    const sortPosts = (subject) =>{
         getPosts(subject);
         setSort(subject);
    }
    useEffect(()=>{
      getPosts('');
    },[])
    return(
      <div className =  "userExistContainer">
          <div className = "userExistImageContainer" style = {{backgroundImage:'url(/search.jpg)'}}>
               <h1 className = "userExistStart">Subject Search</h1>
               <p className = "userExistType">Type your subject in to find related posts for your subject or create a post for your subject for others to see</p>
               <p className = "userExistSubjectInfo">You can type multiple subjects <q>math science</q> or just one single subject</p>

              <div className = "search">
                <input type = "text" value = {subject} onChange = {(e) => setSubject(e.target.value)} className = "subject"  placeholder = "type in the subject"/>
                <button className = "searchBtn" onClick = {()=>getPosts('')}>Search</button>
              </div>  
          </div>
          

  
              {/* <div className = {posts.length > 0 ? "posts visible" : "posts invisible" }> */}
              <div className = {posts.length > 0 ? "posts visible" : "posts visible" }>
                  <div className = "postSettings">
                      <div className = "sortContainer">
                          <p>Sort by</p>
                          <select className="sort" value = {sort} onChange = {(e) => sortPosts(e.target.value)}>
                           <option value="">All posts</option>
                           <option value="date">Date</option>
                           <option value="populer">Populer</option>
                         </select>
                      </div> 
                      <div className = "createPost">
                          <button className = "createPostBtn" onClick = {(e)=> setCreatePost(prev => !prev)}>Create new post</button>
                      </div>
                  </div>
                  {createPost && 
                  <div className = "newPost">                          
                        <div className = "searchPost">
                          <input type  = "text" value = {INheader} onChange = {(e)=> setINheader(e.target.value)} className = "INheader"  placeholder = "Tpye in the title"/>
                          <input type = "text" value = {INkey} onChange = {(e)=> setINkey(e.target.value)} className = "INkey"  placeholder = "Type in subject &quot;math science&quot;"/>
                        </div>
                          <div className = "textContainer">
                            <textarea type = "text" className = "INwhat" value = {INwhat} onChange = {(e)=> setINwhat(e.target.value)}  placeholder = "Write your post here."/>
                          </div>
                          {isSuccess && <p className= 'scPost'>successfully added the post</p>}
                          <div className = "existBtnContainer">
                            <button className = "cancelBtn" onClick = {(e)=> setCreatePost(prev => !prev)}>Cancel</button>
                            <button className = "createBtn" onClick = {submitPost}>Create</button>
                          </div>
                        </div>                  
                        } 

                  </div>

                  <div className = "postsFlex">
                   {posts.map(post =>  <ShortPost post = {post} key = {post.id}/>)}  
                  </div>
                  <div className = "henryContainer">
                      <div className = "henry">
                        <p className = "henryText"><q>Coming together is a begginning. Keeping together is a process. Working together is a success...</q></p>
                        <p >Henry Ford</p>
                      </div>
                  </div> 
          </div>
  
  )
}
