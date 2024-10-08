import express from 'express'
import configViewEngine from './configs/viewEngine'
import routes from './routes/web'
const cookieParser = require('cookie-parser');
import configDatabase from './configs/database'
import 'dotenv/config'
const app = express()
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

configViewEngine(app);
configDatabase(process.env.MONGO_DB);

routes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 