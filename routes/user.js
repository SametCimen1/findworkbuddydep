const pool = require('../Pool');
const router = require('express').Router();
const cookieParser = require('cookie-parser');
const checkAuth = require('./verifyToken');
router.use(cookieParser());

router.post('/followreq', checkAuth, async(req,res) =>{
    console.log("doesItExist")
   const sendId = req.body.id;
   const senderId = req.user._id;
   const doesItExist = await pool.query("SELECT * FROM users WHERE id = $1 AND   $2 = ANY (followreq)", [sendId, senderId]);
   if(doesItExist.rowCount > 0){
       res.status(400).json("already sent")
   }
   else{
    const data = await pool.query('UPDATE users SET followreq = array_append(followreq, $1) WHERE id = $2', [senderId, sendId]);
    res.json("sent")
   }

})
router.post('/getFollows', checkAuth, async(req,res) =>{
    const id = req.user._id;
    const data = await pool.query('SELECT followreq, following, followers FROM users WHERE id = $1', [id]);
    res.json(data.rows[0]) 
 })

 router.post('/acceptFollower', checkAuth, async(req,res) =>{
     const id = req.body.id;
     const updateFollowers = await pool.query('UPDATE users SET followreq = array_remove(followreq, $1), followers = array_append(followers, $2) WHERE id = $3',[id, id, req.user._id]);
     const updateFollowing = await pool.query('UPDATE users SET following =  array_append(following, $1) WHERE id = $2',[req.user._id,id]);
     res.json("ok");
    })

    router.post('/unfollow', checkAuth, async(req,res) =>{
        const id = req.body.id; 
        const senderId = req.user._id; 
        const updateFollowers = await pool.query('UPDATE users SET followers = array_remove(followers, $1) WHERE id = $2',[req.user._id, id]);
        const updateFollowing = await pool.query('UPDATE users SET following =   array_remove(following, $1) WHERE id = $2',[id,req.user._id]);
       res.json("ok")   
    })

module.exports = router;