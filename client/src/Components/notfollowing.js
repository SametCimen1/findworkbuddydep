import ShortPost from './ShortPost';
import styles from '../styles/profileStyle.module.css';

import {useState, useEffect} from 'react';
export default function NotFollowing({myUser}){
  const [currentItem, setCurrentItem] = useState('profile');
  const [posts, setPosts] = useState();
  const user = myUser.user;
  const id = myUser.id;
/*
  about: "Hello I am 16"
followers: 0
following: 0
image: "nhpftybyewramizdayi.jpg"
name: "samet"
ownimg: true
*/
  const followRequest = async() =>{
    const addFriend = await fetch('/user/followreq',{
      method:"POST",
      headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        credentials: 'include', // Don't forget to specify this if you need cookies
        body:JSON.stringify({id:id})
    })
  }
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
  useEffect(()=>{
    getPosts();
  },[])



  return(
    <div>
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
    </div>
    <div>
            <ul className =  {styles.profileOptions} >
                <li onClick = {()=> setCurrentItem('profile')} className = {currentItem ==='profile' ? styles.selected  :''}>Profile</li>
            </ul>
     </div>

     { currentItem === 'profile' && (
                <div className = {styles.profileContainer}>
                    <div className = {styles.btnContainer}>
                        <button className = {styles.followBtn} onClick = {() => followRequest()}>Follow</button>
                    </div>
                    <div className = {styles.aboutContainer}>          
                        <p className = {styles.userName}>About {user.user.name}:</p>                   
                        <p className = {styles.about}>{user.user.about === '' ? <p>None</p> : user.user.about}</p>
                    </div>
                    <div className = { typeof posts !== 'undefined' && posts.length !== 0 ? styles.followingPosts : styles.followingNotPosts}>
                      <p className = {`${styles.userName}  ${styles.usersPosts}`}>{user.user.name}'s posts</p>
                      <div className = {styles.postsContainer}>
                        {typeof posts !== 'undefined' && posts.length !== 0 ?  posts.map(post =>  <ShortPost post = {post} key = {post.id} />): <p className = {styles.none}>none</p>}
                      </div>
                    </div>
                </div>
            )
      }

    </div>
  )
}