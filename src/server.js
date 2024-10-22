import express from 'express'
import configViewEngine from './configs/viewEngine'
import routes from './routes/web'
import configDatabase from './configs/database'
import socketIO from 'socket.io'
import cors from 'cors'
import 'dotenv/config'
const cookieParser = require('cookie-parser');
const app = express()

const server = require("http").Server(app);
const io = socketIO(server)

const port = 3000;


app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

configViewEngine(app);
configDatabase(process.env.MONGO_DB);

app.use((req, res, next) => {
  req.io = io;
  next();
});

// routes(app);
require('./routes/web')(app); // Định nghĩa route
require('./sockets/socket')(io);


server.listen(port,"0.0.0.0" ,() => {
  console.log(`Example app listening on port ${port}`)
}) 