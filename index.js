const express = require('express');
const app = express();

require('dotenv').config();

const cors = require('cors');
app.use(cors({
    origin: '*'
}))

app.use(express.json());

const fileUpload = require('express-fileupload');
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use(express.urlencoded({ extended: true }));

const cookieParser=require('cookie-parser');
app.use(cookieParser());

app.listen(process.env.PORT, () => {
    console.log('Server Started At Port:', process.env.PORT);
})

app.get('/', (req, res) => {
    res.send('<h1>Welcome to Blogging App</h1>');
})

const { dbConnect } = require('./config/dbConnect');
dbConnect();

const { cloudinaryConnect } = require('./config/cloudinaryConnect');
cloudinaryConnect();

const authRouter = require('./routes/authRoute');
const postRouter=require('./routes/postRoute');
const likeRouter=require('./routes/likeRoute');
app.use('/api/v1',authRouter,postRouter,likeRouter);