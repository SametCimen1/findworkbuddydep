import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet'
import { InView } from 'react-intersection-observer'
import {useState, useRef} from 'react';

export default function UserExist(){
    const [isInView, setIsInView] = useState([{name:"first", t:false}, {name:"second", t:false}, {name:"third", t:false}])
    const changeView = (myType) =>{
        if(typeof isInView !== 'undefined'){   
          const newArr = isInView.filter(elem =>  elem.name !== myType);
          setIsInView([...newArr, {name:myType, t:true}]);
        }
        else{
        }
      }
      
      
      const offer = useRef(null);
    return(
        <div>
          <Helmet>
            <title>Find Work Buddy</title>
          </Helmet>
         <main>
           <section className = "homeMain" style = {{backgroundImage:"url(/home.jpg)"}}>
           <div className = "homeMainContainer">
              <div className = " move homeMainTextContainer">
                 <h1 className = " findBuddy"> Find a buddy to collobarete on your project!</h1>
                 <p className = "signUp">Sign up for free!</p>
                 <Link className = "myLink" to = "/signup"> <button className = "getStarted">Get Started</button></Link>
                 <button className = "whatWeOffer" onClick = {()=>offer.current.scrollIntoView() }>See What we offer</button>
              </div>
             
              {/* <InView onChange={(inView)=>{changeView('first')}}> */}
              <InView onChange={(inView)=> {if(inView)changeView('first')}}>
              {({ ref, inView }) => ( 
              <div ref = {ref} className = "cardContainer">
                <div  className = {isInView.some(element => element.name === 'first' && element.t===true) ? "card inView" : "card"}>
                  <span ref = {ref}  className = "stick"></span>
                  <img src = "https://media.discordapp.net/attachments/761233693293019187/874351949397524541/unknown.png" />
                  <h3>Free: It is always free! <br></br> Find random people to work with!</h3>
                </div> 
    
                <div  className = {isInView.some(element => element.name === 'first' && element.t===true) ? "card inView" : "card"}>
                  <span ref = {ref}  className = "stick"></span>
                  <img src = "https://media.discordapp.net/attachments/761233693293019187/874351949397524541/unknown.png" />
                  <h3>Easy to sign up and start working!</h3>
                </div> 
    
    
                <div  className = {isInView.some(element => element.name === 'first' && element.t===true) ? "card inView" : "card"}>
                  <span ref = {ref}  className = "stick"></span>
                  <img src = "https://media.discordapp.net/attachments/761233693293019187/874351949397524541/unknown.png" />
                  <h3>Collaborate with anyone you like!</h3>
                </div> 
    
                <div  className = {isInView.some(element => element.name === 'first' && element.t===true) ? "card inView" : "card"}>
                  <span ref = {ref}  className = "stick"></span>
                  <img src = "https://media.discordapp.net/attachments/761233693293019187/874351949397524541/unknown.png" />
                  <h3>work in groups and easy to share projects!</h3>
                </div> 
            </div>
              )}
                </InView>
              
              
           </div>
           </section>
           
          <section ref = {offer}   className = "tryOutToday" style = {{backgroundImage:"url(/collabarete.jpg)"}}>
          <InView onChange={(inView)=> {if(inView)changeView('second')}}>
              {({ ref, inView }) => ( 
              <div className = "whatWeOfferPopUp">
                <p ref = {ref} className = {isInView.some(element => element.name === 'second' && element.t===true) ? "whatWeOfferPopUpText topToBottom" : "whatWeOfferPopUpText"}>What We Offer</p>
              </div>
                )}
              </InView>
             <InView onChange={(inView)=> {if(inView)changeView('third')}}>
              {({ ref, inView }) => ( 
             <div className = {isInView.some(element => element.name === 'third' && element.t===true) ? "tryOutTodayContainer move" : "tryOutTodayContainer"}>
               <h1 ref = {ref}  className = "tryOutTodayText">Collobarating on project just got much easier. My Work Buddy is a simple website to collaborate with random people and work together swiftly!</h1>
               <Link to = "/signup"><button className = "tryOutTodayrBtn ">Try Out Today</button></Link>
             </div>
                )}
              </InView>
          </section>
    
    
          {/* COMMENT SECTION */}
          {/* <section   className = "tryOutToday" style = {{backgroundImage:"url(/collabarete.jpg)"}}>
          <InView onChange={(inView)=> {if(inView)changeView('second')}}>
              {({ ref, inView }) => ( 
              <div className = "whatWeOfferPopUp">
                <p ref = {ref} className = {isInView.some(element => element.name === 'second' && element.t===true) ? "whatWeOfferPopUpText topToBottom" : "whatWeOfferPopUpText"}>See What Others Think</p>
              </div>
                )}
              </InView>
             <InView onChange={(inView)=> {if(inView)changeView('third')}}>
              {({ ref, inView }) => ( 
             <div className = {isInView.some(element => element.name === 'third' && element.t===true) ? "tryOutTodayContainer move" : "tryOutTodayContainer"}>
               <h1 ref = {ref}  className = "tryOutTodayText">Collobarating on project just got much easier. My Work Buddy is a simple website to collaborate with random people and work together swiftly!</h1>
               <button className = "tryOutTodayrBtn ">Try Out Today</button>
             </div>
                )}
              </InView>
          </section> */}
         </main>
         <section className = "simple">
            <div className = "simpleContainer">
              <h1 className = "simpleText">IT'S REALLY THAT SIMPLE!</h1>
            </div>
          </section>
          
          
    
          <footer>
            <div className = "developed">
              <h3 className = "developedText">Made by Samet Cimen and Afnan Habib</h3>
            </div>
    
            <div className = "menu">
            <p className = "menuText">Menu</p>
              <ul className = "menuList">
                <li>Home</li>
                <li>Services</li>
                <li>FAQ</li>
                <li>Contact</li>
              </ul>
            </div>
    
            <div className = "follow">
              <p className = "menuText">Follow us on</p>
              <ul className = "followMenu">
                <a href = "https://twitter.com/findworkbuddy"><img className = "icon" src = "/twitter.svg" /></a>
                <a href = "https://twitter.com/findworkbuddy"><img className = "icon" src = "/facebook.svg" /></a>
                <a href = "https://www.instagram.com/findworkbuddy/"><img className = "icon" src = "/instagram.svg" /></a>
              </ul>
            </div>
          </footer>
         
       </div>
    )
}
