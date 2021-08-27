import styles from '../styles/Verify.module.css'
export default function Verify(){
    return(
        <div className = {styles.container}>
             <div className = {styles.box}>
               <p className = {styles.plsVerify}>Please Verify Your Email Address</p>
               <p className = {styles.plsVerifyLong}>Please verify your account. To verify your account open your email and simply click the link and login</p>
             </div>
        </div>
    )
}