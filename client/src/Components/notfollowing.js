import styles from '../styles/profileStyle.module.css';
import {useState, useEffect} from 'react';
export default function NotFollowing({myUser}){
  const [currentItem, setCurrentItem] = useState('profile');
  const user = myUser.user;
  const id = myUser.id;
  console.log("NOT FOLLOWING USEr") /*
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
                    <div className = {styles.aboutContainer}>
                        <p className = {styles.userName}>About {user.user.name}:</p>                   
                        <p className = {styles.about}>{user.user.about === '' ? <p>None</p> : user.user.about}</p>
                    </div>
                </div>
            )
            }

    </div>
  )
}