import clientRouter from "./client"
import userRouter from "./user"

const routes = (app)=>{
    app.use('/client',clientRouter);

    app.use('/user',userRouter);

}

export default routes