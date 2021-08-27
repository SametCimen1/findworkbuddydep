import styles from '../styles/profileStyle.module.css';
import {useState, useEffect} from 'react';
import ShortPost from './ShortPost';
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
    const isItme = user.user.isItme;




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
        setFollowReq(response.friendreq);
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
          const response = await data.json();
          setFollowReq(response);
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
      }

    useEffect(()=>{
     getPosts();
     getFollowReq();
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
              <div className = {styles.editProfileContainer} >
                    <button className = {styles.editProfileBtn}  onClick = {()=> setCurrentItem('edit')}>Edit Profile</button>
              </div>
            </div>

            <div>
            <ul className =  {styles.profileOptions} >
                <li onClick = {()=> setCurrentItem('profile')} className = {currentItem ==='profile' ? styles.selected  :''}>Profile</li>
                {isItme && <li onClick = {()=> setCurrentItem('edit')}  className = {currentItem ==='edit' ? styles.selected  :''}>Edit Profile</li>}
                {isItme && <li onClick = {()=> setCurrentItem('notifications')}  className = {currentItem ==='notifications' ? styles.selected  :''}>Notifications</li>}
               {isItme && <li onClick = {()=> setCurrentItem('followers')}  className = {currentItem ==='followers' ? styles.selected  :''}>Followers</li>}
               {isItme && <li onClick = {()=> setCurrentItem('following')}  className = {currentItem ==='following' ? styles.selected  :''}>Following</li>}
            </ul>
            </div>
            <div  className = {styles.profileOptionsContainer}>
            {isItme && currentItem === 'edit' && (
                <div>
                    <form 
      id='uploadForm' 
      action='/updateData' 
      method='post' 
      encType="multipart/form-data">
                        <input type = "file" name = "newimg" />
                        <input type = "text" name = "about" value = {about} onChange = {(e)=> setAbout(e.target.value)} placeholder = "about" />
                        <input type = "text" name = "name" value = {name} onChange = {(e)=> setName(e.target.value.toLowerCase())} placeholder = "name" />
                        <input type='submit' value='Upload!' />
                    </form>
                </div> 
            )}

            { currentItem === 'profile' && (
                <div className = {styles.profileContainer}>
                    <div className = {styles.aboutContainer}>
                        <p className = {styles.userName}>About {user.user.name}:</p>                   
                        <p className = {styles.about}>{user.user.about === '' ? <p>None</p> : user.user.about}</p>
                    </div>
                    <div className = { typeof posts !== 'undefined' && posts.length !== 0 ? styles.followingPosts : styles.followingNotPosts}>
                        {typeof posts !== 'undefined' && posts.length !== 0 ?  posts.map(post =>  <ShortPost post = {post} key = {post.id}/>):                      <p className = {styles.postsText}>{user.user.name}'s posts<p>none</p></p> }
                    </div>
                </div>
            )
            }

            {isItme&&currentItem === 'notifications' && (
                <div>
                    <h1>notifications</h1>
                    {followReq.map(id => (
                    <div>
                       <h1>{id}</h1>
                       <button onClick = {()=> acceptFriend(id)}>Accept</button>
                    </div>
                    ))}
                </div>
            )}


           {isItme && currentItem === 'followers' && (
                <div>
                    <h1>followers</h1>
                    <div>
                      {followers.length === 0 ? <h2>Not following anyone</h2> : followers.map(id => 
                      <div className = {styles.followingContainer}>
                        <User id = {id} key = {id}/>
                        <button  className = {styles.massege}>Massege</button>
                      </div>
                      )}
                    
                    </div>
                </div>
            )}

            
            
           {isItme && currentItem === 'following' && (
                <div>
                    <h1>following</h1>
                    {following.length === 0 ? <h2>Not following anyone</h2> : 
                    following.map(id=>{return (
                    <div className = {styles.followingContainer}>
                       <User id = {id} key = {id}/>
                       <div className = {styles.btnContainer}>
                         <button  className = {styles.massege}>Massege</button>
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