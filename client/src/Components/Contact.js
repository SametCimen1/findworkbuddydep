import stlyes from '../styles/getInTouch.module.css'
import {Helmet} from 'react-helmet'

export default function layout() {
    return(
    <div>
           <Helmet>
            <title> Contact Find Work Buddy</title>
          </Helmet>
     <main className = {stlyes.mainContainer}> 
       <div className = {stlyes.touchContainer}>
         <h1>Get in Touch</h1>
       </div>
      <div className = {stlyes.emailContainer} > 
        <h2>Want to get in touch? You can <a href = "mailto: cimensamet338@gmail.com"> email us </a> anytime you want!</h2>
      </div>
     </main>
   </div>
)
}