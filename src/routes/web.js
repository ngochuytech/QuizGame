import clientRouter from "./client.js"
import hostRouter from "./host.js"
import userRouter from "./user.js"
import root from '../root.js'

export default  (app) => {
    app.use('/client',authMiddleware.AuthRequired,clientRouter);
    app.use('/host',authMiddleware.AuthRequired, hostRouter)
    app.use('/user',userRouter);
    app.use('/',root);
}
