const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const pool = require('./Pool');
const checkAuth = require('./routes/verifyToken');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const nodemailer = require('nodemailer');
//routes

const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const userRoute = require('./routes/user');
const fileUpload = require('express-fileupload');
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions))
app.use(fileUpload());
app.use(express.static('userimg'))
require('dotenv').config();
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
}) 


app.use('/api/user', authRoute);

app.post('/userexist', async(req,res) =>{
  const {token} = req.cookies;
  if(token === '' || typeof token === 'undefined'){

    return res.json(false); 
  }
  else{
    const verified = jwt.verify(token, process.env.TOKENSECRET);

    try {
      const data = await pool.query('SELECT * FROM users WHERE id = $1', [verified._id]);
      const user = await data.rows[0];
      if(user){
        res.json(true);
      }  
    } catch (error) {
      res.clearCookie('token').json("logged out")
      res.json(false); 
    }
  }

})
app.use('/post', postRoute);  
app.use('/user', userRoute);  

app.post('/admin', checkAuth, async(req,res,next) =>{

  try {
    const isAdmin =await pool.query('SELECT * FROM users WHERE id = $1' ,[_id]);
    const user = await  isAdmin.rows[0];
    if(user.role === 'admin'){
        res.json(true);
    }
    else{
      res.json(false);
    }
  } catch (error) {
    console.log(error)
    res.status(401).send("Unauthorized")
  }
  
})
app.get('/sample', checkAuth, async(req,res,next) =>{
  const data = await pool.query("SELECT * FROM users");
  console.log(data)
})



app.post('/getbyid', checkAuth, async(req,res) =>{
  const id = req.body.id;
  const myId = req.user._id;
  const isUser = req.body.user;
  try {
    const intId = parseInt(id)
    const data = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = data.rows[0];
    let informations = {ownimg:user.ownimg,about:user.about, isItme:intId === myId,name:user.name, following:user.following.length,followers:user.followers.length,image:user.image, role:user.role};
    if(isUser === 'user'){
       informations = {ownimg:user.ownimg,name:user.name,image:user.image, role:user.role};
    }
    if(user.followers.length === 0 && intId !== myId){
      res.json({"friend":false, user:informations})  
    }
    else if(user.followers.some(id => id === myId) || intId === myId){
      res.json({"friend":true, user:informations})
    }
    else{
      res.json({"friend":false, user:informations})  
    }
  } catch (error) {
    
  }
})

//ch
app.post('/getuser',checkAuth, async(req,res) =>{
  const id = req.user._id;
  try {
    if(typeof id !== undefined){
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if(user.rows.length === 0){
      res.status(404).send("cant find user")
    }
    else{
      const row = user.rows[0];
      const informations = {id:id, ownimg:row.ownimg, name:row.name, emial:row.email, friendnum:row.friendnum, role:row.role, image:row.image};
      res.json(informations);
    }
  }
  } catch (error) {
     console.log(error)
  }

})
// function readFiles(dirname, onFileContent, onError) {
//   fs.readdir(dirname, function(err, filenames) {
//     if (err) {
//       onError(err);
//       return;
//     }
//     for(let i = 0; i<filenames.length; i++){
//       const filename = filenames[i];
//         fs.readFile(dirname + filename, 'utf-8', function(err, content) {
//         if (err) {
//           onError(err);
//           return;
//         }
//         if(filename === "fvwflktcilramizdayi.jpg"){
//           console.log("FOUND")
//           console.log(filename)
//           return content;
//         }
//       });
//     }
    // filenames.forEach(function(filename) {
    //   fs.readFile(dirname + filename, 'utf-8', function(err, content) {
    //     if (err) {
    //       onError(err);
    //       return;
    //     }
    //     onFileContent(filename, content);
    //   });
    // });
//   });
// }

// const onFileContentFunc = (filename, content) =>{
//  console.log("IN FILE CONTENT");
//  console.log(filename);
//  if(filename === "fvwflktcilramizdayi.jpg"){
//    console.log("FOUND")
//    console.log(filename)
//    return content;
//  }
// }
app.get('/getimg', checkAuth, async(req,res) =>{
  const dirName =__dirname + '/client/public/userImages' 
  // const filename = readFiles(dirName, onFileContentFunc, ()=> {console.log("ERROR IN DIR")})
})
app.post('/updateData', checkAuth, async(req,res) =>{
  if(req.files && Object.keys(req.files).length !== 0){
    await uploadImg(req.files, req.user._id);
  }
  if(req.body.about !== '' && req.body.name !== ''){
    await pool.query('UPDATE users SET about = $1, name = $2 WHERE id = $3', [req.body.about, req.body.name, req.user._id])
  }
  else if(req.body.about !== '' && req.body.name === ''){
    await pool.query('UPDATE users SET about = $1 WHERE id = $2', [req.body.about,req.user._id])
  }
  else if(req.body.about === '' && req.body.name !== ''){
    await pool.query('UPDATE users SET  name = $1 WHERE id = $2', [req.body.name, req.user._id])
  }
  res.redirect(`http://localhost:3000/user/${req.user._id}`);
})
const uploadImg = async(files, id) => {
  const imgName = await pool.query('SELECT image, ownimg FROM users WHERE id = $1', [id]);
  console.log(imgName)
  if(imgName.rows[0].ownimg){
    fs.unlink(`${__dirname}/userimg/img/${imgName.rows[0].image}`, function (err) {
      if (err) console.log(err);
      // if no error, file has been deleted successfully
      console.log('File deleted!');
    }); 
  }

  const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  let random = "";
  for(let i = 0; i<10; i++){
    random += alphabet[Math.floor(Math.random() * 26)]
  } 
  const newimg = files.newimg;
  const imageName = random + newimg.name
  newimg.mv('./userimg/img/' +imageName);
  const updateImg = await pool.query('UPDATE users SET ownimg = true, image = $1 WHERE id = $2', [imageName, id]);
}

app.post('/verify', async(req,res) =>{
  const {email, password, url} = req.body;
  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if(user){
  const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if(!validPassword){
      console.log("Invalid password")
        return res.status(400).send("Invalid Password");
    }
    if(!(user.rows[0].active)){
      if(user.rows[0].confirm === url){
        await pool.query('UPDATE users SET active = $1, confirm = $2 WHERE email = $3', [true,'',email]);
        return res.status(200).json('ok');
      }
      else{
        console.log("url doesnt match")
        return res.status(400).json('bad');
      }
    }
    else{
      console.log("already confirmed")
      return res.status(500).json('bad');
    }
  }
  else{
    return res.json("cant find the user")
  }

})

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})