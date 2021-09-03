const pool = require('../Pool');
const router = require('express').Router();
const cookieParser = require('cookie-parser')
const checkAuth = require('./verifyToken');
router.use(cookieParser());

router.post('/newpost', checkAuth, async(req,res) =>{
    const {_id} = req.user; 
    const id = _id; 
  
      if(typeof id !== undefined){
      const imageUser = await pool.query("SELECT image, name FROM users  WHERE id = $1", [id])
      const image = imageUser.rows[0].image;
      const username = imageUser.rows[0].name;
      const words = req.body.keywords;
      const addWord = words.trim();
      const wordsArr = addWord.split(' ');
      const dateObj = new Date();
  
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const seconds = dateObj.getSeconds();
      const minutes = dateObj.getMinutes();
      const hour = dateObj.getHours();
      const currentTime = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
  
       const user = await pool.query("INSERT INTO posts(userId, image, header, paragraph, keywords, likes, commentby, uploadtime, username) VALUES($1,$2,$3,$4,$5,$6,$7, $8, $9)",[id, image, req.body.header, req.body.paragraph, wordsArr, 0,[], currentTime,username]);
      if(user){
        res.json(true)
      }
      else{
        res.json(false);
      }
      
      }
    })
    
    const getSinglePost = async(id) =>{
      const post = await pool.query(`SELECT * FROM posts WHERE id = $1`, [id]);
      return post.rows[0];
    }
    router.post('/getpost', async(req,res) =>{
     const post = await getSinglePost(req.body.id);
     if(post){
         res.json(post);
     }
     else{
         res.json("no post found")
     }
    })
    router.post('/getuserposts', checkAuth,async(req,res) =>{
      const userid = req.body.userid;
      const posts = await pool.query('SELECT * FROM posts WHERE userid = $1', [userid])
      res.json(posts.rows)
    });

    router.post('/getposts', async(req,res) =>{
      const subjectArr = req.body.subject.trim();
      const subject = subjectArr.split(' ');
      const sort = req.body.sort;
      if(subject.length === 1 && subject[0] === ''){ //empty subject
          if(sort === ''){

            const posts =await pool.query("SELECT * FROM posts ORDER BY id ASC  LIMIT 20"); //SAVE the last id and fetch from there on click next
            res.json(posts.rows);
          }
          else if(sort === 'date'){

            const posts =await pool.query(`SELECT * FROM posts  ORDER BY id DESC`); //SAVE the last id and fetch from there on click next
            res.json(posts.rows);
          }
          else if(sort === 'populer'){
  
            const posts =await pool.query(`SELECT * FROM posts  ORDER BY likes DESC`); //SAVE the last id and fetch from there on click next
            res.json(posts.rows);
          }
      }
      else if(subject.length > 0 && subject[0] !== ''){
       let myWord = '';
       for(let i = 0; i< subject.length; i++){
        if(i === subject.length -1){
          myWord += "'" +subject[i]+"'"
        }
        else{ 
        myWord += "'" +subject[i]+"',"
        } 
      }
       if(sort === ''){

          const posts =await pool.query(`SELECT * FROM posts  WHERE  keywords && ARRAY[${myWord}]`); //SAVE the last id and fetch from there on click next

          res.json(posts.rows);
         
        }
        else if(sort === 'date'){

          const posts =await pool.query(`SELECT * FROM posts  WHERE  keywords && ARRAY[${myWord}] ORDER BY id`); //SAVE the last id and fetch from there on click next
          res.json(posts.rows);
        }
        else if(sort === 'populer'){

          const posts =await pool.query(`SELECT * FROM posts  WHERE  keywords && ARRAY[${myWord}] ORDER BY likes`); //SAVE the last id and fetch from there on click next
          res.json(posts.rows);
        }
      }
    })
  
    router.post('/likepost', checkAuth,async(req,res) =>{
    //  const data = await pool.query('UPDATE posts SET likes = likes + 1 WHERE id = $1', [req.body.id]);
    //  res.json('updated')
    const userId = req.user._id;
    const postId = req.body.id;
    const didLike = await pool.query('SELECT * FROM posts WHERE  id = $1 AND  $2 = ANY (likedby) ', [postId, userId]);
    if(didLike.rowCount > 0){
        res.json("already liked")
      }
      else{
        const data = await pool.query('UPDATE posts SET likes = likes + 1, likedby = array_append(likedby, $1) WHERE id = $2', [userId, postId]);
        const post = await getSinglePost(postId);
        res.json(post)
      } 
 
  })
  
  router.post('/unlikepost', checkAuth,async(req,res) =>{
    //  const data = await pool.query('UPDATE posts SET likes = likes + 1 WHERE id = $1', [req.body.id]);
    //  res.json('updated')
    const userId = req.user._id;
    const postId = req.body.id;
    const data = await pool.query('UPDATE posts SET likes = likes - 1 WHERE id = $1', [ postId]);
    const removeElem = await pool.query('UPDATE posts SET likedby =  array_remove(likedby, $1)  WHERE id = $2', [userId, postId])
   const post = await getSinglePost(postId);
     res.json(post)
  })

  router.post('/getcomments', checkAuth, async(req,res) =>{
    const id = req.user._id;
    const data = await pool.query('SELECT newcomment FROM users WHERE id = $1', [id])
    res.json(data.rows[0])
  })
  
  router.post('/getcomment', checkAuth, async(req,res) =>{
    const id = req.body.id;
    const comment = await pool.query("SELECT * FROM comment WHERE id = $1", [id])
    const cm = comment.rows[0];
    if(typeof cm === 'undefined'){
      return res.json("cmUn");
    }
    const data = {id:id,userid:cm.userid, userimg:cm.userimg, username:cm.username, text:cm.text}
    res.json(data)
  })
  
  router.post('/didlike', checkAuth, async(req,res) =>{
    const userId = req.user._id;
    const postId = req.body.id
    const didLike = await pool.query('SELECT * FROM posts WHERE  id = $1 AND  $2 = ANY (likedby) ', [postId, userId])
 if(didLike.rowCount > 0){
      res.json(true)
    }
    else{
      res.json(false);
    }
  })

  router.post('/newcomment', checkAuth, async(req,res) =>{
    const userId = req.user._id;
    const postId = req.body.postId;
    const reciever = req.body.reciever;
    const userData = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    const user = await userData.rows[0];
    
    const newComment = await pool.query('INSERT INTO comment(text, userid, userImg, userName) VALUES($1, $2, $3, $4) RETURNING *', [req.body.comment, userId, user.image,user.name]);
    const commentId = newComment.rows[0].id;
    const comment = await pool.query('UPDATE posts SET commentby = array_append(commentby, $1) WHERE id = $2', [commentId, postId]);
    const newCommentUser = await pool.query('UPDATE users SET newcomment = array_append(newcomment, $1) WHERE id = $2', [commentId, reciever])
    if(comment.rowCount > 0){
      res.json(true)
    }
    else{
      res.json(false);
    }

  })
  // router.post('/getcomment', checkAuth, async(req,res) =>{
  //  console.log("comment hit")
  //   const commentId = req.body.id;
  //   const commentAll = await pool.query('SELECT * FROM comment WHERE id = $1', [commentId])
  //   const comment = commentAll.rows[0];
  //   console.log(commentId)
  //   console.log(comment)
  //   if(commentAll.rowCount > 0){
  //     res.json(comment)
  //   }
  //   else{
  //     res.json("no comments");
  //   }
  // })

  router.post('/deletenewcm', checkAuth, async(req,res) =>{
    const myId = req.user._id;
   const commentId = req.body.cmid; 
   const data =  await pool.query('UPDATE users SET newcomment =  array_remove(newcomment, $1)  WHERE id = $2',[commentId, myId])
  res.json("updated")
  })

  router.post('/deletecomment', checkAuth, async(req,res) =>{
    const commentId = req.body.id;
    const postId = req.body.postId;
    const commentAll = await pool.query('UPDATE posts SET commentby =  array_remove(commentby, $1)  WHERE id = $2', [commentId, postId])
    const deleteCm = await pool.query('DELETE FROM comment WHERE id = $1',[commentId])
    res.json('deleted')
        
  })


  
  module.exports = router;