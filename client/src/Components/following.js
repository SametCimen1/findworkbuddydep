import NewComment from './NewComment'
import styles from '../styles/profileStyle.module.css';
import {useState, useEffect} from 'react';
import ShortPost from './ShortPost';
import { useHistory } from "react-router-dom";
import User from './User';
export default function Profile({myUser}){
    const user = myUser.user;
    const [currentItem, setCurrentItem] = useState('profile');
    const [about, setAbout] = useState('');
    const [name, setName] = useState('');
    const [posts, setPosts] = useState();
    const [followReq, setFollowReq] = useState();
    const [followers, setFollowers] = useState();
    const [following, setFollowing] = useState();
    const [newComments, setNewComments] = useState();
    const isItme = user.user.isItme;
    const history = useHistory();



    const getPosts = async() =>{
      const data = await fetch('/post/getuserposts', {
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          credentials: 'include', // Don't forget to specify this if you need cookies
          body:JSON.stringify({userid:myUser.id})
      });
      const response = await data.json();
      setPosts(response);
    }
    
    const getFollowReq = async() =>{
        const data = await fetch('/user/getFollows', {
          method:"POST",
          headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow',
            credentials: 'include', // Don't forget to specify this if you need cookies
        });
        const response = await data.json();
        setFollowReq(response.followreq);
        setFollowers(response.followers);
        setFollowing(response.following);
      }
      const acceptFriend = async(id) =>{
        const data = await fetch('/user/acceptFollower', {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
              },
              redirect: 'follow',
              credentials: 'include', // Don't forget to specify this if you need cookies
              body:JSON.stringify({id:id})
            });
            console.log("RETUNED")
          const response = await data.json();
          history.go(0);
      }

      const unfollow = async(id) =>{
        const data = await fetch('/user/unfollow', {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
              },
              redirect: 'follow',
              credentials: 'include', // Don't forget to specify this if you need cookies
              body:JSON.stringify({id:id})
        })
        history.go(0);
      }


      const getNewComments = async() =>{
        const data = await fetch("/post/getcomments",{
          method:"POST",
          headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow',
            credentials: 'include', // Don't forget to specify this if you need cookies
        })
        const response = await data.json();
        setNewComments(response.newcomment)
      
      }
    useEffect(()=>{
     getPosts();
     getFollowReq();
     getNewComments();
    },[])

    const deleteNewComment = async(id) =>{
     const data = await fetch('/post/deletenewcm', {
      method:"POST",
      headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        credentials: 'include', // Don't forget to specify this if you need cookies
        body: JSON.stringify({cmid:id})
    })
    const response = await data.json();
    if(response === 'updated'){
     getNewComments();
    }

    }
    return(
        <div className = {styles.bgcolor} >
            <div className = {styles.imgContainer}>
              <div className =  {styles.imgAndName} > 
                      {user.user.ownimg ? 
                    <img src = {`/img/${user.user.image}`} alt = "profile img  of the user" className = {styles.userimg}/>
                    :
                    <img src = {user.user.image} alt = "profile img  of the user" className = {styles.userimg}/>
                }
               
                <div className = {styles.nameFollowers}>
                   <div className = {styles.nameContainer}>
                       <p>{user.user.name}</p>
                   </div>
                   <div className = {styles.foll}>
                       <p className = {styles.profileOne}>{user.user.followers} followers</p>
                       <span className ={styles.profileDot}></span>
                       <p className = {styles.profileTwo}>{user.user.following} following</p>
                   </div>
                </div>
              </div>
              <div className = {styles.editProfileContainer} >
                    <button className = {styles.editProfileBtn}  onClick = {()=> setCurrentItem('edit')}>Edit Profile</button>
              </div>
            </div>

            <div>
            <ul className =  {styles.profileOptions} >
                <li onClick = {()=> setCurrentItem('profile')} className = {currentItem ==='profile' ? styles.selected  :''}>Profile</li>
                
                {isItme && <li onClick = {()=> setCurrentItem('notifications')}  className = {currentItem ==='notifications' ? styles.selected  :''}>Notifications</li>}
               {isItme && <li onClick = {()=> setCurrentItem('followers')}  className = {currentItem ==='followers' ? styles.selected  :''}>Followers</li>}
               {isItme && <li onClick = {()=> setCurrentItem('following')}  className = {currentItem ==='following' ? styles.selected  :''}>Following</li>}
            </ul>
            </div>

            <div  className = {styles.profileOptionsContainer}>
            
            { currentItem === 'profile' && (
                <div className = {styles.profileContainer}>
                    <div className = {styles.aboutContainer} onClick =  {()=> setCurrentItem('edit')}>
                        <p className = {styles.userName}>About {user.user.name}:</p>                   
                        <p className = {styles.about}>{user.user.about === '' ? <p>None</p> : user.user.about}</p>
                    </div>
                    <div className = { typeof posts !== 'undefined' && posts.length !== 0 ? styles.followingPosts : styles.followingNotPosts}>
                      <p className = {styles.userName, styles.usersPosts}>{user.user.name}'s posts</p>
                      <div className = {styles.postsContainer}>
                        {typeof posts !== 'undefined' && posts.length !== 0 ?  posts.map(post =>  <ShortPost post = {post} key = {post.id} />): <p className = {styles.none}>none</p>}
                      </div>
                    </div>
                </div>
            )
            }



            {isItme && currentItem === 'edit' && (
                <div className = {styles.editContainer}>
                    <form 
      id='uploadForm' 
      action='/updateData' 
      method='post' 
      encType="multipart/form-data">
                        <div className = {styles.inputContainer}>
                        <div className = {styles.newImgContainer}>
                          <input type = "file" name = "newimg"  className = {styles.newImageFile}/>
                          <p>or paste url</p>
                          <input type = "text" name = "newimgurl"  className = {styles.newImage}/>
                        </div>
                        <input type = "text" className = {styles.aboutInput} name = "about" value = {about} onChange = {(e)=> setAbout(e.target.value)} placeholder = "about" />
                        <input type = "text"className = {styles.nameInput}  name = "name" value = {name} onChange = {(e)=> setName(e.target.value.toLowerCase())} placeholder = "name" />
                        <input className = {styles.uploadInput} type='submit' value='Upload!' />
                        </div>
                    </form>
                </div> 
            )}



            {isItme&&currentItem === 'notifications' && (
                <div>
                    <p className = {styles.option}>notifications</p>
                    {(newComments !== null && newComments.length >= 0) ?  newComments.map(id => (
                      <div className = {styles.newCommentContainer}>
                        <NewComment id = {id}  key = {id}/>
                        <button className = {styles.okBtn} onClick = {()=>deleteNewComment(id)}>OK</button>
                      </div>
                    )): <p className = {styles.none}>No new Comment</p>}
                    {followReq.length <= 0 ? <p className = {styles.none}>No new follow Request</p>:followReq.map(id => (
                    <div className = {styles.notifications}>
                       <User id = {id} key = {id}/>
                       <button className = {styles.acceptBtn} onClick = {()=> acceptFriend(id)}>Accept</button>
                    </div>
                    ))}
                    
                    {}
                </div>
            )}


           {isItme && currentItem === 'followers' && (
                <div>
                     <p className = {styles.option}>followers</p>
                    <div>
                      {followers.length === 0 ? <p className = {styles.none}>No followers</p> : followers.map(id => 
                      <div className = {styles.followingContainer}>
                        <User id = {id} key = {id}/>
                        {/* <button  className = {styles.massege}>Massege</button> */}
                      </div>
                      )}
                    
                    </div>
                </div>
            )}

            
            
           {isItme && currentItem === 'following' && (
                <div>
                    <p className = {styles.option}>following</p>
                    {following.length === 0 ? <p className = {styles.none}>Not following anyone</p> : 
                    following.map(id=>{return (
                    <div className = {styles.followingContainer}>
                       <User id = {id} key = {id}/>
                       <div className = {styles.btnContainer}>
                         {/* <button  className = {styles.massege}>Massege</button> */}
                         <button className ={styles.unfollow}onClick = {()=> unfollow(id)}>Unfollow</button>
                       </div>
                    </div>
                    )})
                    
                    }
                </div>
            )}
            </div>
             
        </div>
    )
}