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
      const doesTokenExist =  await fetch("http://localhost:5000/userexist",{
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        credentials: 'include',
      });
      const res = await doesTokenExist.json();
      if(res){
        const data = await fetch("http://localhost:5000/getuser", 
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
            
            {/* <div className = "links" > */}
        


            { user && <div className = {typeof user !== 'undefined' ? "firstLinks larger": "firstLinks smaller"}>
                  <ul className = "ulList">
                      <li><Link className = "link" to ="/collobarete">ask question</Link></li> 
                     <li><Link  className = "link"to ="/groups">Groups</Link></li> 
                  </ul>    
                </div>}
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
                      <svg onClick = {notifClicked} className = "notif" id="Layer_2" fill="#dbdbdb"  enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" xmlns="http://www.w3.org/2000/svg"><g><path d="m13.5 4.18c-.276 0-.5-.224-.5-.5v-1.68c0-.551-.449-1-1-1s-1 .449-1 1v1.68c0 .276-.224.5-.5.5s-.5-.223-.5-.5v-1.68c0-1.103.897-2 2-2s2 .897 2 2v1.68c0 .277-.224.5-.5.5z"/></g><g><path d="m12 24c-1.93 0-3.5-1.57-3.5-3.5 0-.276.224-.5.5-.5s.5.224.5.5c0 1.378 1.122 2.5 2.5 2.5s2.5-1.122 2.5-2.5c0-.276.224-.5.5-.5s.5.224.5.5c0 1.93-1.57 3.5-3.5 3.5z"/></g><g><path d="m20.5 21h-17c-.827 0-1.5-.673-1.5-1.5 0-.439.191-.854.525-1.14 1.576-1.332 2.475-3.27 2.475-5.322v-3.038c0-3.86 3.14-7 7-7 3.86 0 7 3.14 7 7v3.038c0 2.053.899 3.99 2.467 5.315.342.293.533.708.533 1.147 0 .827-.672 1.5-1.5 1.5zm-8.5-17c-3.309 0-6 2.691-6 6v3.038c0 2.348-1.028 4.563-2.821 6.079-.115.098-.179.237-.179.383 0 .276.224.5.5.5h17c.276 0 .5-.224.5-.5 0-.146-.064-.285-.175-.38-1.796-1.519-2.825-3.735-2.825-6.082v-3.038c0-3.309-2.691-6-6-6z"/></g></svg>
                      <div className = {notif? 'popupvisible popnotif':"popupinvisible"}>
                          <div className = "layoutPupop">
                            <h1>Edit post</h1>
                            <h1>share post</h1>
                            <h1>share post</h1>
                            <h1>share post</h1>
                          </div>
                      </div>
                      
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