const pool = require('../Pool');
const router = require('express').Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const nodemailer = require('nodemailer');

const signupSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    img: Joi.string(),
})


const signinSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
})

router.use(cookieParser());

router.post('/signup', async(req,res) => {

    //validate
  
    // const {error} = signupSchema.validate(req.body);
    // if(error){
    //    return res.status(404).json(error.details[0].message)
    // }

    //check if user exist
    const emailExist = await pool.query('SELECT * FROM users WHERE email = $1', [req.body.email]);
    if(emailExist.rowCount > 0){
        return res.status(409).send("email alreadyyyyyy exist");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const lowerName = req.body.name.toLowerCase();

    const gmailPassword = process.env.GMAILPASSWORD;

    const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    let random = "";
    for(let i = 0; i<20; i++){
      random += alphabet[Math.floor(Math.random() * 26)]
    } 

    const  confirmURL = random;
    const addUser = await pool.query('INSERT INTO users(name, email, password, following, followreq, newcomment, followers, ispublic,groupid, role, image, ownimg, about, active, confirm) VALUES($1,$2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', [lowerName, req.body.email, hashPassword, [], [], [], [], true, [], 'user', "https://i.stack.imgur.com/l60Hf.png", false, '', false, confirmURL]);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'cimensamet338@gmail.com',
          pass: process.env.GMAILPASSWORD
        }
      });
      
      const mailOptions = {
        from: 'cimensamet338@gmail.com',
        to: req.body.email,
        subject: 'Find Work Buddy Verification code',
        text: `click this link to verify your account http://localhost:3000/verify/${confirmURL}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    try {
        res.send(addUser)
    } catch (error) {
    res.status(400).send(error)
    
}
}
)

router.post('/logout', (req,res) =>{
    res.clearCookie('token').json("logged out")
})

router.post('/signin', async(req,res) =>{
    
    console.log("called")
    console.log("called signin")
    
    // const {error} = signinSchema.validate(req.body)
    // if(error){
    //     return res.status(404).send(error.details[0].message)
    // }

    const doesExist = await pool.query('SELECT * FROM users WHERE email = $1', [req.body.email]);
    if(!(doesExist.rowCount > 0)){
        return res.status(404).json("email doesnt exist");
    }
    const user = doesExist.rows[0];
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        return res.status(400).json("Invalid Password");
    }
    if(user.active === true){
        const token = jwt.sign({_id: user.id}, process.env.TOKENSECRET, {expiresIn: "3day"});

        res.cookie('token', token, { secure: process.env.NODE_ENV !== "development",
        httpOnly: true, maxAge: 72 * 60 * 60 * 1000 }); //3days
        res.header('auth-token', token).send("token set"); 
        res.json('success');
    }
    else{
        res.redirect("http://localhost:3000/mustbeactivated")
    }
    


    //create jwt token

 
    
})

router.post('/checkemail', async(req,res) =>{
    const email = req.body.email;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if(user.rowCount > 0){
        res.json(true) // exist
    }
    else{
        res.json(false) //doesnt exist
    }
})




module.exports = router;
