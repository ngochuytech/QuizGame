import express from 'express'
import configViewEngine from './configs/viewEngine'
import routes from './routes/web'
import mongoose from 'mongoose'
import 'dotenv/config'

const app = express()
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

configViewEngine(app);

mongoose.connect(process.env.MONGO_DB).then(()=>{
  console.log('Connect DB success');
})
.catch((err)=>{
  console.log(err);
})

routes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 