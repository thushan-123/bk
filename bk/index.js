const express = require('express')
const axios = require('axios')
const cors = require('cors')
const url = require('url')
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')
const multer = require('multer')
const fs = require("fs")
const path = require('path')

const validObjectId = new ObjectId();

console.log(validObjectId)

const mongooes = require('mongoose')
const User = require('./mongooes')
const book = require("./mongodbbook")

const app =  express()
app.use(express.json())
app.use(cors())

/*
app.get('/User/Getdata/:username/:password',async (req,res)=>{
    const username = req.params.username;
    const  password = req.params.password;
    console.log(username,password)
    const data = await  User.find({username:{username} , password : {password}})
    //const data =await User.findOne({username:username , password : password})
    
     if(!data) { res.status(401).json('invalied')}
           else{ 
          res.status(200).json('valied')
       }

})
*/
app.get('/', (req, res) => {
   res.send("hello world")
});

app.get('/User/Getdata/:username/:password',cors(), async (req, res) => {
    const username = req.params.username;
    const password = req.params.password;
    //console.log(username, password);

    try {
        const data = await User.findOne({ username: username, password: password });
        console.log(data._id);
        if (!data) {
            res.json({status:'invalid'}).status(200);
        } else {
            const jsonobj = {status: 'valied', user_id: data._id};
            res.json(jsonobj).status(200);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({status:'internal_server_error'});
    }
});

app.get("/Book/Details",async(req,res)=>{
    try{
        await book.find({}).then((data)=>{
            res.json(data).status(200)
        }).catch((e)=>res.send(e))
    }catch(err){
        //res.json("internal_server_error").status(200)
        res.send(err)
    }
})

app.post('/User/Checkdata', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    //console.log(username, password);

    try {
        const data = await User.findOne({ username: username, password: password });
        if (!data) {
            res.json({status:'invalid'}).status(200);
        } else {
            const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
            const jsonobj = {status: 'valied', user_id: data._id,username:data.username,webtoken: token,email:data.email,mobile:data.mobile };
            res.json(jsonobj).status(200);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({status:'internal_server_error'});
    }
});




app.post('/User/Getdata',async(req,res)=>{

    const {username,password,email,mobile} = req.body
    const NewUser = new  User ({username,password,email,mobile});
    try{
        const user = await NewUser.save()
        .then((result)=> {
             res.json({status:'inserted'}).status(200)
               })
    }catch(err){
        res.status(500).json({status:'internal_server_error'})
    }

})

/*
const upload = multer()

const storage = multer.diskStorage({
    destination: './uploads', // Specify destination folder
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  

app.post('/Book/Uploading',upload.single('myfile'),async(req,res)=>{
    
    //console.log(req.body.file);
    try{
        const file = req.body.file
    if (!file) {
        return res.status(200).json({status:'no_file_uploaded'})
    }else{

        res.status(200).json({status:'file_uploaded_successfully'})
    }    
    }catch(err){
        res.status(200).json({status:"internal_server_error"})
    }
})
*/
/*
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = './';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({storage: storage}).array('files', 12);
app.post('/Book/Uploading', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong:(");
        }
        res.end("Upload completed.");
    });
})
*/



app.post('/Book/Uploading/Data',async(req,res)=>{
    console.log(req.body)
    //const {userid,author,bookname,price,description} = req.body.data;
    id =req.body.userid
    author = req.body.author
    bookname=  req.body.bookname
    description = req.body.description
    price= req.body.price
    console.log(id,author,bookname,description,bookname,price)
     
    const newbook = new book({id,bookname,author,description,price})
    try{
        await  newbook.save().then((data)=>{
            res.json({status:'inserted'}).status(200)
        }).catch((e)=>{
            //res.json({status:"not_inserted"}).status(200)
            res.send(e)
        })

    }catch(err){
            res.json({status:"internal_server_error"}).status(200)
    }
    
})



app.post('/User/ValiedID',async (req , res) =>{
    
    const userid = req.body.userId
    try{
        const statusValiedid = await User.findOne( { _id : userid} )
        console.log(statusValiedid)
        if(!statusValiedid){
            res.json({isvalid:false}).status(200)
        }else{
            res.json({isvalid:true}).status(200)
        }
    }catch(err){
        console.log(err)
        res.json({status:"internal_server_error"}).status(500)
    }
})


app.post('User/Token',(req,res)=>{
    const token = req.body.webtoken
    if(!token){
        res.status(403).json({massage:'invalied_token'})
    }else{
        res.status(200),json( {massage:'valied_token'} )
    }
})




app.post('/User/ValiedID', async (req, res) => {
    const userId = req.body.userId;
    
    try {
        const isValidUserId = mongooes.Types.validObjectId.isValid(userId);
        if (!isValidUserId) {
            return res.json({ isvalid: false }).status(200);
        }
        
        const statusValidId = await User.findOne({ _id: mongoose.Types.ObjectId(userId) });
        if (!statusValidId) {
            return res.json({ isvalid: false }).status(200);
        } else {
            return res.json({ isvalid: true }).status(200);
        }
    } catch (err) {
        console.log(err);
        return res.json({ status: "internal_server_error" }).status(500);
    }
});


app.listen(8000,()=>console.log("server is runnig 8000"))  
