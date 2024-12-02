import clientRouter from "./client"
import hostRouter from "./host"
import userRouter from "./user"
import root from "./root"
import authMiddleware from '../middleware/authMiddleware'

module.exports = (app) => {
    app.use('/client',authMiddleware.AuthRequired,clientRouter);
    app.use('/host',authMiddleware.AuthRequired, hostRouter)
    app.use('/user',userRouter);
    app.use('/',root);
}
