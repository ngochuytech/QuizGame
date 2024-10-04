import clientRouter from "./client"
import hostRouter from "./host"
import userRouter from "./user"
import authMiddleware from '../middleware/authMiddleware'

const routes = (app)=>{
    app.use('/client',authMiddleware.AuthRequired,clientRouter);
    app.use('/host',authMiddleware.AuthRequired, hostRouter)
    app.use('/user',userRouter);
}

export default routes