const express=require('express');
const app=express();

require('dotenv').config();

const cors=require('cors');
app.use(cors({
    origin: '*'
}))

app.use(express.json());

const fileUpload=require('express-fileupload');
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/temp/'
}));

app.use(express.urlencoded({extended: true}));

app.listen(process.env.PORT,()=>{
    console.log('Server Started At Port:',process.env.PORT);
})

app.get('/',(req,res)=>{
    res.send('<h1>Welcome to Blogging App</h1>');
})

const {dbConnect}=require('./config/dbConnect');
dbConnect();

const {cloudinaryConnect}=require('./config/cloudinaryConnect');
cloudinaryConnect();