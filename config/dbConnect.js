const mongoose=require('mongoose');

require('dotenv').config();

exports.dbConnect=()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(()=>console.log('Database Successfully Connected'))
    .catch((error)=>{
        console.log('Database Connection Failure :',error.message);
        process.exit(1);
    })
}