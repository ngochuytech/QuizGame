import express from 'express'
import configViewEngine from './configs/viewEngine'
import routes from './routes/web'
const app = express()
const port = process.env.PORT || 3000;

configViewEngine(app);

routes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 