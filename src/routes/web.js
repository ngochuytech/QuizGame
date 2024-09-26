import clientRouter from "./client"
import hostRouter from "./host"
import userRouter from "./user"

const routes = (app)=>{
    app.use('/client',clientRouter);
    app.use('/host',hostRouter)
    app.use('/user',userRouter);
}

export default routes