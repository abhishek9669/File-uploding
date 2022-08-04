//import area
const { uuid } = require('uuidv4');
const express = require('express');
const env = require('dotenv');
const multer = require('multer');

const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2
env.config();
// const upload = multer({ dest: './uplodes' })
const app = express();

//mongoess conect
console.log(process.env.mongo_pass)
mongoose.connect(`mongodb+srv://${process.env.mongo_user}:${process.env.mongo_pass}@cluster0.bpsvpki.mongodb.net/?retryWrites=true&w=majority`).then((s)=>{
    console.log("mongodb connect")
    const Friends = mongoose.model('imageurl',{
        url:String
    })

}).catch((err)=>{
    console.log(err)

})
  


cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret,
    secure: true 
  });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
      cb(null, './uplodes')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      
      cb(null, uuid()+""+file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })


//post route
app.post("/fileuplode",upload.single('myfile'),(req,res)=>{
    console.log(req.file.path)
    cloudinary.uploader.upload(req.file.path, 
      function(error, result) {
        console.log("result",result.secure_url)
        let onlineurl = result.secure_url;     

    });
    res.status(200).json({
        "msg":"file uploding successfully"
    })
})

let port = process.env.PORT||3000;
app.listen(port,()=>{
    console.log("port is running on "+port);
})