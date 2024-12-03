import express from 'express'
import configViewEngine from './configs/viewEngine.js'
import routes from './routes/web.js'
import configDatabase from './configs/database.js'
import socketIO from '/app/node_modules/socket.io/dist/index.js';
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser';
const app = express()

import { Server } from "http";

const server = new Server(app);

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
import webRoutes from './routes/web.js';
import sockets from './sockets/socket.js';

webRoutes(app);
sockets(io);

server.listen(port,"0.0.0.0" ,() => {
  console.log(`Example app listening on port ${port}`)
}) 