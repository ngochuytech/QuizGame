import express from 'express'

const app = express()
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", "./src/view");

app.get('/', function (req, res) {
  return res.render('index.ejs')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 