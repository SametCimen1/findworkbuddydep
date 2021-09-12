import { Link} from 'react-router-dom';
import './styleLayout.css';
import {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";

export default function Layout({children}) {
  const [user, setUser] = useState();
  const [popup, setPopup] = useState(false);
  const [notif, setNotif] = useState(false);
  const [settings, setSettings] = useState(false);
  const [menu, setMenu] = useState(false);


  const history = useHistory();
  const checkIfUserExist = async() =>{
      const doesTokenExist =  await fetch("/userexist",{
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        credentials: 'include',
      });
      const res = await doesTokenExist.json();
      console.log("USER EXIST")
      console.log(res)
      if(res){
        const data = await fetch("/getuser", 
        {
          method:"POST",
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          credentials: 'include', // Don't forget to specify this if you need cookies
          })
        .then(res => res.json()).then(res => setUser(res)).catch(err => {
          if(err.status === 401){
            setUser(); 
          }
        });
      
      }
      else{
        setUser()
      }
    }
 
 
    

    useEffect(()=>{
      checkIfUserExist();
    },[]);


  
  

   
  //  const settingsClicked = () =>{
  //   if(popup || notif){

  //   }
  //   else{
  //   setSettings(prev => !prev);
  //   }
  // }
   
    const notifClicked = () =>{
      if(popup || settings){

      }
      else{
      setNotif(prev => !prev);
      }
    }

    const dotsClicked = () =>{
      if(notif){

      }
      else{
        setPopup(prev => !prev)
      }
    }

      return(
        <div>
         <header >
            <nav className = "navbar">{/* flex */} 
              <div className = "logo">{/* logo and text 50% */} 
                  <Link to = "/"><img src= "/logo.png"></img></Link> {/* add alt and change styling   */}
              </div>
              
             
              <div className = {user ?  "links" : "linksexist"}> 
                
  
            
    
    
              {/* { user && <div className = {typeof user !== 'undefined' ? "firstLinks larger": "firstLinks smaller"}>
                  <ul className = "ulList">
                      <li><Link className = "link" to ="/collobarete">ask question</Link></li> 
                     <li><Link  className = "link"to ="/groups">Groups</Link></li> 
                  </ul>    
                </div>} */}
                   {/*phone view*/}
                   {typeof user !== 'undefined' && 
                  <div className = "hamburger" onClick = {()=> setMenu(prev => !prev)}>
                    <span className = "line"></span>
                    <span className = "line"></span>
                    <span className = "line"></span>
                    <div className = "hamdropdown">
                       <div className = {menu ? "dropdownContainer dropdownvisible": "dropdownContainer dropdowninvisible"}>
                          <Link className = "blackLink" to = "/"><p className = "menuparag">Ask Question</p></Link>
                          <Link  className = "blackLink" to = "/groups"><p className = "menuparag">Groups</p></Link>
                          <Link  className = "blackLink"  to = "/about"> <p className = "menuparag">About</p></Link>
                          <Link  className = "blackLink" to = "/contact"> <p className = "menuparag">Contact</p></Link>
                          <Link   className = "blackLink" to = {`/user/${user.id}`}> <p className = "menuparag">My Profile</p></Link>
                       </div>
                    </div>
                  </div>
                  }

                   {typeof user !== 'undefined' && 
                    <div className = "firstLinksContainer">
                          <div className="dropdown" onClick = {dotsClicked}>
                                <div className = "dot dotwhite"></div>
                                <div className = "dot dotwhite"></div>
                                <div className = "dot dotwhite"></div>
                          </div>
                            <div className = {popup? 'popupvisible popup':"popupinvisible"}>
                              <div className = "layoutPupop">
                                <h1>Edit post</h1>
                                <h1>share post</h1>
                                <h1>share post</h1>
                                <h1>share post</h1>
                              </div>
                          </div>
                       {user.ownimg ?
                   <img   src = {`http://localhost:5000/img/${user.image}`}  onClick={() => {history.push(`/user/${user.id}`); history.go(0)}} className = "userImage" />
                    : 
                     < img src = {`${user.image}`} onClick={() => {history.push(`/user/${user.id}`); history.go(0)}} className = "userImage" />
                      }
                    </div>
                  }
                        
                        { user ?
                <div className = "btnContainer">
                     <Link className = "link" to = "/logout"><button className = "logout">Log out</button></Link> 
                </div>:
                <div className = "signBtnContainer">
                  <Link  className = "link"  to = "/signup">  <button className = "signup">Sign up</button></Link>
                  <Link  className = "link"  to = "/signin"><button className = "signin">Sign in</button></Link>
                </div>
                }    
               
             
    
               </div>
                           

                           </nav>
                        </header>
                        <main>
                            {children}
                        </main>
                      </div>
      )
  
}