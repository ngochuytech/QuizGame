import mongoose from 'mongoose'

const ConnectDB = (MONGO_DB_KEY) =>{
    mongoose.connect(MONGO_DB_KEY).then(()=>{
        console.log('Connect DB success');
    })
    .catch((err)=>{
        console.log(MONGO_DB_KEY)
        console.log(err);
    })
}

export default  ConnectDB
