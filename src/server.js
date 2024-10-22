import express from 'express'
import configViewEngine from './configs/viewEngine'
import routes from './routes/web'
import configDatabase from './configs/database'
import socketIO from 'socket.io'
import 'dotenv/config'
const cookieParser = require('cookie-parser');
const app = express()

const server = require("http").Server(app);
const io = socketIO(server)

const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


configViewEngine(app);
configDatabase(process.env.MONGO_DB);

require('./sockets/index')(io);
routes(app);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 